-- KAN-14: Deal submission, photo storage, nearby locations

-- 1. Storage bucket for deal images -------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'deal-images',
  'deal-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS policies
create policy "deal_images_public_read" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'deal-images');

create policy "deal_images_auth_insert" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'deal-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

create policy "deal_images_auth_delete" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'deal-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- 2. Alter deals table to support deal photos ---------------------------------
alter table public.deals
  add column if not exists image_url text;

alter table public.deals
  alter column price set default 0;

-- 3. Function to find nearby store locations ----------------------------------
create or replace function public.locations_near (
  p_latitude  double precision,
  p_longitude double precision,
  p_radius_m  integer default 5000,
  p_limit     integer default 50
)
  returns table (
    id         uuid,
    name       text,
    address    text,
    latitude   double precision,
    longitude  double precision,
    distance_m double precision
  )
  language sql
  stable
  set search_path to 'public', 'extensions'
  as $function$
  with origin as (
    select st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography as point
  )
  select
    l.id,
    l.name,
    l.address,
    st_y(l.location::geometry) as latitude,
    st_x(l.location::geometry) as longitude,
    st_distance(l.location, o.point) as distance_m
  from origin o
  join public.locations l on st_dwithin(
    l.location,
    o.point,
    least(greatest(p_radius_m, 1), 50000)
  )
  order by st_distance(l.location, o.point)
  limit least(greatest(p_limit, 1), 200);
$function$;

grant execute on function public.locations_near(double precision, double precision, integer, integer)
  to anon, authenticated, service_role;

-- 4. Replace submit_deal with a version that supports image_url and an optional
-- price. Drop the old overload first: two functions with the same named
-- arguments make PostgREST calls ambiguous.
drop function if exists public.submit_deal(
  text, text, numeric, timestamp with time zone, uuid, text, text,
  double precision, double precision, text, numeric, text, text
);

create or replace function public.submit_deal (
  p_category_id        text,
  p_title              text,
  p_valid_until        timestamp with time zone,
  p_price              numeric                  default 0,
  p_location_id        uuid                     default null::uuid,
  p_location_name      text                     default null::text,
  p_location_address   text                     default null::text,
  p_location_latitude  double precision         default null::double precision,
  p_location_longitude double precision         default null::double precision,
  p_description        text                     default null::text,
  p_old_price          numeric                  default null::numeric,
  p_discount_label     text                     default null::text,
  p_coupon_code        text                     default null::text,
  p_image_url          text                     default null::text
)
  returns uuid
  language plpgsql
  security definer
  set search_path to 'public', 'extensions'
  as $function$
declare
  v_user uuid := auth.uid();
  v_location_id uuid := p_location_id;
  v_point geography;
  v_deal_id uuid;
begin
  if v_user is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  if (
    select count(*)
    from public.deals d
    where d.created_by = v_user
      and d.created_at > now() - interval '1 hour'
  ) >= 10 then
    raise exception 'too many submissions, try again later'
      using errcode = '54000';
  end if;

  if v_location_id is not null then
    perform 1 from public.locations l where l.id = v_location_id;
    if not found then
      raise exception 'unknown location' using errcode = '23503';
    end if;
  else
    if nullif(btrim(p_location_name), '') is null
      or p_location_latitude is null
      or p_location_longitude is null then
      raise exception 'provide p_location_id, or a location name with coordinates'
        using errcode = '22023';
    end if;

    if p_location_latitude not between -90 and 90
      or p_location_longitude not between -180 and 180 then
      raise exception 'coordinates out of range' using errcode = '22023';
    end if;

    v_point := st_setsrid(
      st_makepoint(p_location_longitude, p_location_latitude),
      4326
    )::geography;

    select l.id
    into v_location_id
    from public.locations l
    where lower(l.name) = lower(btrim(p_location_name))
      and st_dwithin(l.location, v_point, 50)
    order by st_distance(l.location, v_point)
    limit 1;

    if v_location_id is null then
      insert into public.locations (name, address, location)
      values (btrim(p_location_name), nullif(btrim(p_location_address), ''), v_point)
      returning id into v_location_id;
    end if;
  end if;

  insert into public.deals (
    created_by,
    location_id,
    category_id,
    title,
    description,
    price,
    old_price,
    discount_label,
    coupon_code,
    valid_until,
    image_url,
    moderation_status
  )
  values (
    v_user,
    v_location_id,
    p_category_id,
    p_title,
    p_description,
    coalesce(p_price, 0),
    p_old_price,
    p_discount_label,
    p_coupon_code,
    p_valid_until,
    p_image_url,
    'pending'
  )
  returning id into v_deal_id;

  return v_deal_id;
end;
$function$;

revoke all on function public.submit_deal(text, text, timestamp with time zone, numeric, uuid, text, text, double precision, double precision, text, numeric, text, text, text)
  from public, anon;

grant execute on function public.submit_deal(text, text, timestamp with time zone, numeric, uuid, text, text, double precision, double precision, text, numeric, text, text, text)
  to authenticated, service_role;
