SET local check_function_bodies = off;

CREATE TABLE "public"."bookmarked_deals" (
  "user_id"    uuid                     NOT NULL,
  "deal_id"    uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "bookmarked_deals_pkey" PRIMARY KEY (user_id, deal_id)
);

ALTER TABLE "public"."bookmarked_deals"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."bookmarked_deals" FROM "anon";

CREATE TABLE "public"."brands" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"            text                     NOT NULL,
  "logo_url"        text                     NOT NULL,
  "logo_background" text,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"      timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "brands_name_key" UNIQUE (name),
  CONSTRAINT "brands_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."brands"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."categories" (
  "id"         text                     NOT NULL,
  "label"      text                     NOT NULL,
  "emoji"      text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "categories_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."categories"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."coupons" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "brand_id"       uuid                     NOT NULL,
  "category_id"    text                     NOT NULL,
  "title"          text                     NOT NULL,
  "description"    text,
  "price"          numeric(10,2),
  "old_price"      numeric(10,2),
  "discount_label" text,
  "valid_until"    timestamp with time zone,
  "code"           text,
  "qr_code"        text,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "coupons_check" CHECK (((old_price IS NULL) OR ((price IS NOT NULL) AND (old_price > price)))),
  CONSTRAINT "coupons_pkey" PRIMARY KEY (id),
  CONSTRAINT "coupons_price_check" CHECK (((price IS NULL) OR (price >= (0)::numeric)))
);

ALTER TABLE "public"."coupons"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."deal_votes" (
  "id"      uuid NOT NULL DEFAULT gen_random_uuid(),
  "deal_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  CONSTRAINT "deal_votes_deal_id_user_id_key" UNIQUE (deal_id, user_id),
  CONSTRAINT "deal_votes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."deal_votes"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."deal_votes" FROM "anon";

CREATE TABLE "public"."deals" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_by"     uuid,
  "location_id"    uuid                     NOT NULL,
  "category_id"    text                     NOT NULL,
  "title"          text                     NOT NULL,
  "description"    text,
  "price"          numeric(10,2)            NOT NULL,
  "old_price"      numeric(10,2),
  "discount_label" text,
  "coupon_code"    text,
  "valid_until"    timestamp with time zone NOT NULL,
  "confirmations"  integer                  NOT NULL DEFAULT 0,
  "denials"        integer                  NOT NULL DEFAULT 0,
  CONSTRAINT "deals_check" CHECK (((old_price IS NULL) OR (old_price > price))),
  CONSTRAINT "deals_confirmations_check" CHECK ((confirmations >= 0)),
  CONSTRAINT "deals_coupon_code_check" CHECK (((coupon_code IS NULL) OR (char_length(coupon_code) <= 64))),
  CONSTRAINT "deals_denials_check" CHECK ((denials >= 0)),
  CONSTRAINT "deals_description_check" CHECK (((description IS NULL) OR (char_length(description) <= 1000))),
  CONSTRAINT "deals_discount_label_check" CHECK (((discount_label IS NULL) OR (char_length(discount_label) <= 40))),
  CONSTRAINT "deals_pkey" PRIMARY KEY (id),
  CONSTRAINT "deals_price_check" CHECK ((price >= (0)::numeric)),
  CONSTRAINT "deals_title_check" CHECK (((char_length(btrim(title)) >= 3) AND (char_length(btrim(title)) <= 120)))
);

ALTER TABLE "public"."deals"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"             uuid                     NOT NULL,
  "first_name"     text,
  "last_name"      text,
  "username"       extensions.citext,
  "is_verified"    boolean                  NOT NULL DEFAULT false,
  "lappsy_balance" integer                  NOT NULL DEFAULT 0,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_first_name_check" CHECK (((first_name IS NULL) OR (char_length(first_name) <= 60))),
  CONSTRAINT "profiles_lappsy_balance_check" CHECK ((lappsy_balance >= 0)),
  CONSTRAINT "profiles_last_name_check" CHECK (((last_name IS NULL) OR (char_length(last_name) <= 60))),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_username_check" CHECK (((username IS NULL) OR (username OPERATOR(extensions.~) '^[A-Za-z0-9_.]{3,30}$'::extensions.citext))),
  CONSTRAINT "profiles_username_key" UNIQUE (username)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."profiles" FROM "anon";

CREATE TABLE "public"."locations" (
  "id"         uuid                             NOT NULL DEFAULT gen_random_uuid(),
  "osm_id"     text,
  "name"       text                             NOT NULL,
  "address"    text,
  "location"   extensions.geography(Point,4326) NOT NULL,
  "created_at" timestamp with time zone         NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone         NOT NULL DEFAULT now(),
  CONSTRAINT "locations_address_check" CHECK (((address IS NULL) OR (char_length(address) <= 200))),
  CONSTRAINT "locations_name_check" CHECK (((char_length(btrim(name)) >= 1) AND (char_length(btrim(name)) <= 120))),
  CONSTRAINT "locations_osm_id_key" UNIQUE (osm_id),
  CONSTRAINT "locations_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."locations"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."deal_vote" AS ENUM (
  'confirm',
  'deny'
);

ALTER TABLE "public"."deal_votes"
  ADD COLUMN "vote" public.deal_vote NOT NULL;

ALTER TABLE "public"."deal_votes"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

CREATE TYPE "public"."moderation_status" AS ENUM (
  'pending',
  'approved',
  'rejected'
);

ALTER TABLE "public"."deals"
  ADD COLUMN "moderation_status" public.moderation_status NOT NULL DEFAULT 'pending'::public.moderation_status;

ALTER TABLE "public"."deals"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."deals"
  ADD COLUMN "updated_at" timestamp WITH time zone NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.deals_near (
  p_latitude        double precision,
  p_longitude       double precision,
  p_radius_m        integer          DEFAULT 1500,
  p_include_expired boolean          DEFAULT false,
  p_limit           integer          DEFAULT 200
)
  RETURNS TABLE (
    id             uuid,
    is_mine        boolean,
    title          text,
    description    text,
    price          numeric,
    old_price      numeric,
    discount_label text,
    coupon_code    text,
    valid_until    timestamp with time zone,
    confirmations  integer,
    denials        integer,
    created_at     timestamp with time zone,
    location_id    uuid,
    location_name  text,
    address        text,
    latitude       double precision,
    longitude      double precision,
    category_id    text,
    category_label text,
    emoji          text,
    distance_m     double precision
  )
  LANGUAGE sql
  STABLE
  SET search_path TO 'public', 'extensions'
  AS $function$
  with origin as (
    select st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography as point
  )
  select
    d.id,
    coalesce(d.created_by = (select auth.uid()), false),
    d.title,
    d.description,
    d.price,
    d.old_price,
    d.discount_label,
    d.coupon_code,
    d.valid_until,
    d.confirmations,
    d.denials,
    d.created_at,
    l.id,
    l.name,
    l.address,
    st_y(l.location::geometry),
    st_x(l.location::geometry),
    c.id,
    c.label,
    c.emoji,
    st_distance(l.location, o.point)
  from origin o
  join public.locations l on st_dwithin(
    l.location,
    o.point,
    least(greatest(p_radius_m, 1), 20000)
  )
  join public.deals d on d.location_id = l.id
  join public.categories c on c.id = d.category_id
  where d.moderation_status = 'approved'
    and (p_include_expired or d.valid_until > now())
  order by st_distance(l.location, o.point)
  limit least(greatest(p_limit, 1), 500);
$function$;

CREATE OR REPLACE FUNCTION public.get_my_profile_stats()
  RETURNS TABLE (
    submissions_count   bigint,
    confirmations_count bigint,
    lappsy_balance      integer
  )
  LANGUAGE sql
  STABLE
  SET search_path TO 'public'
  AS $function$
  select
    (
      select count(*)
      from public.deals d
      where d.created_by = (select auth.uid())
    ) as submissions_count,
    (
      select coalesce(sum(d.confirmations), 0)::bigint
      from public.deals d
      where d.created_by = (select auth.uid())
    ) as confirmations_count,
    p.lappsy_balance
  from public.profiles p
  where p.id = (select auth.uid());
$function$;

REVOKE ALL ON FUNCTION "public"."get_my_profile_stats"() FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.protect_deal_moderation()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO 'public'
  AS $function$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.moderation_status is distinct from old.moderation_status then
    raise exception 'moderation_status can only be changed by the service role'
      using errcode = '42501';
  end if;

  if (
    new.location_id,
    new.category_id,
    new.title,
    new.description,
    new.price,
    new.old_price,
    new.discount_label,
    new.coupon_code,
    new.valid_until
  ) is distinct from (
    old.location_id,
    old.category_id,
    old.title,
    old.description,
    old.price,
    old.old_price,
    old.discount_label,
    old.coupon_code,
    old.valid_until
  ) then
    new.moderation_status = 'pending';
  end if;

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."protect_deal_moderation"() FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."set_updated_at"() FROM PUBLIC, "anon", "authenticated";

-- SECURITY DEFINER is intentional: clients can only create deals through this
-- RPC. There are no INSERT policies on deals/locations, and this function
-- enforces auth, input validation, a rate limit and moderation_status=pending.
CREATE OR REPLACE FUNCTION public.submit_deal (
  p_category_id        text,
  p_title              text,
  p_price              numeric,
  p_valid_until        timestamp with time zone,
  p_location_id        uuid                     DEFAULT NULL::uuid,
  p_location_name      text                     DEFAULT NULL::text,
  p_location_address   text                     DEFAULT NULL::text,
  p_location_latitude  double precision         DEFAULT NULL::double precision,
  p_location_longitude double precision         DEFAULT NULL::double precision,
  p_description        text                     DEFAULT NULL::text,
  p_old_price          numeric                  DEFAULT NULL::numeric,
  p_discount_label     text                     DEFAULT NULL::text,
  p_coupon_code        text                     DEFAULT NULL::text
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public', 'extensions'
  AS $function$
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
    moderation_status
  )
  values (
    v_user,
    v_location_id,
    p_category_id,
    p_title,
    p_description,
    p_price,
    p_old_price,
    p_discount_label,
    p_coupon_code,
    p_valid_until,
    'pending'
  )
  returning id into v_deal_id;

  return v_deal_id;
end;
$function$;

REVOKE ALL
  ON FUNCTION "public"."submit_deal"(text, text, numeric, timestamp WITH time zone, uuid, text, text, double precision, double precision, text, numeric, text, text)
  FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.sync_deal_vote_counts()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  if tg_op = 'INSERT' then
    update public.deals
    set
      confirmations = confirmations
        + case when new.vote = 'confirm' then 1 else 0 end,
      denials = denials
        + case when new.vote = 'deny' then 1 else 0 end
    where id = new.deal_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.deals
    set
      confirmations = greatest(
        confirmations - case when old.vote = 'confirm' then 1 else 0 end,
        0
      ),
      denials = greatest(
        denials - case when old.vote = 'deny' then 1 else 0 end,
        0
      )
    where id = old.deal_id;
    return old;
  elsif tg_op = 'UPDATE' then
    if new.vote is distinct from old.vote
      or new.deal_id is distinct from old.deal_id then
      update public.deals
      set
        confirmations = greatest(
          confirmations - case when old.vote = 'confirm' then 1 else 0 end,
          0
        ),
        denials = greatest(
          denials - case when old.vote = 'deny' then 1 else 0 end,
          0
        )
      where id = old.deal_id;

      update public.deals
      set
        confirmations = confirmations
          + case when new.vote = 'confirm' then 1 else 0 end,
        denials = denials
          + case when new.vote = 'deny' then 1 else 0 end
      where id = new.deal_id;
    end if;
    return new;
  end if;

  return null;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."sync_deal_vote_counts"() FROM PUBLIC, "anon", "authenticated";

ALTER TABLE "public"."coupons"
  ADD CONSTRAINT "coupons_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES public.brands(id);

ALTER TABLE "public"."coupons"
  ADD CONSTRAINT "coupons_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE "public"."deals"
  ADD CONSTRAINT "deals_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE "public"."bookmarked_deals"
  ADD CONSTRAINT "bookmarked_deals_deal_id_fkey" FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE CASCADE;

ALTER TABLE "public"."deal_votes"
  ADD CONSTRAINT "deal_votes_deal_id_fkey" FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."bookmarked_deals"
  ADD CONSTRAINT "bookmarked_deals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."deal_votes"
  ADD CONSTRAINT "deal_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."deals"
  ADD CONSTRAINT "deals_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE "public"."deals"
  ADD CONSTRAINT "deals_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

CREATE INDEX bookmarked_deals_deal_id_idx ON public.bookmarked_deals USING btree (deal_id);

CREATE INDEX coupons_brand_id_idx ON public.coupons USING btree (brand_id);

CREATE INDEX coupons_valid_until_idx ON public.coupons USING btree (valid_until);

CREATE INDEX deal_votes_user_id_idx ON public.deal_votes USING btree (user_id);

CREATE INDEX deals_category_id_idx ON public.deals USING btree (category_id);

CREATE INDEX deals_created_at_idx ON public.deals USING btree (created_at DESC);

CREATE INDEX deals_created_by_idx ON public.deals USING btree (created_by);

CREATE INDEX deals_location_id_idx ON public.deals USING btree (location_id);

CREATE INDEX deals_valid_until_idx ON public.deals USING btree (valid_until);

CREATE INDEX locations_location_idx ON public.locations USING gist (location);

CREATE TRIGGER brands_set_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER coupons_set_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER deal_votes_sync_counts
  AFTER INSERT OR DELETE OR UPDATE ON public.deal_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_deal_vote_counts();

CREATE TRIGGER deals_protect_moderation
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_deal_moderation();

CREATE TRIGGER deals_set_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER locations_set_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "bookmarked_deals_delete_own" ON "public"."bookmarked_deals"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "bookmarked_deals_insert_own" ON "public"."bookmarked_deals"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE (d.id = bookmarked_deals.deal_id)))));

CREATE POLICY "bookmarked_deals_select_own" ON "public"."bookmarked_deals"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "brands_read" ON "public"."brands"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "categories_read" ON "public"."categories"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "coupons_read" ON "public"."coupons"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "deal_votes_delete_own" ON "public"."deal_votes"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "deal_votes_insert_own" ON "public"."deal_votes"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE
    ((d.id = deal_votes.deal_id) AND (d.moderation_status = 'approved'::public.moderation_status) AND (d.valid_until > now()) AND (d.created_by IS DISTINCT FROM ( SELECT auth.uid()
    AS uid)))))));

CREATE POLICY "deal_votes_select_own" ON "public"."deal_votes"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "deal_votes_update_own" ON "public"."deal_votes"
  FOR UPDATE
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)))
  WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE
    ((d.id = deal_votes.deal_id) AND (d.moderation_status = 'approved'::public.moderation_status) AND (d.valid_until > now()) AND (d.created_by IS DISTINCT FROM ( SELECT auth.uid()
    AS uid)))))));

CREATE POLICY "deals_delete_own" ON "public"."deals"
  FOR DELETE
  TO "authenticated"
  USING ((created_by = ( SELECT auth.uid() AS uid)));

CREATE POLICY "deals_select_approved_or_own" ON "public"."deals"
  FOR SELECT
  TO "anon", "authenticated"
  USING (((moderation_status = 'approved'::public.moderation_status) OR (created_by = ( SELECT auth.uid() AS uid))));

CREATE POLICY "deals_update_own" ON "public"."deals"
  FOR UPDATE
  TO "authenticated"
  USING ((created_by = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((created_by = ( SELECT auth.uid() AS uid)));

CREATE POLICY "profiles_select_own" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "profiles_update_own" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((id = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "locations_read" ON "public"."locations"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

REVOKE ALL ON FUNCTION "public"."deals_near"(double precision, double precision, integer, boolean, integer) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."deals_near"(double precision, double precision, integer, boolean, integer) TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."deals_near"(double precision, double precision, integer, boolean, integer) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."deals_near"(double precision, double precision, integer, boolean, integer) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."deals_near"(double precision, double precision, integer, boolean, integer) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_my_profile_stats"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."get_my_profile_stats"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_my_profile_stats"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_my_profile_stats"() TO "service_role";

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "service_role";

REVOKE ALL ON FUNCTION "public"."protect_deal_moderation"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_deal_moderation"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_deal_moderation"() TO "service_role";

REVOKE ALL ON FUNCTION "public"."set_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT EXECUTE
  ON FUNCTION "public"."submit_deal"(text, text, numeric, timestamp WITH time zone, uuid, text, text, double precision, double precision, text, numeric, text, text)
  TO "authenticated";

REVOKE ALL
  ON FUNCTION "public"."submit_deal"(text, text, numeric, timestamp WITH time zone, uuid, text, text, double precision, double precision, text, numeric, text, text)
  FROM "postgres";

GRANT EXECUTE
  ON FUNCTION "public"."submit_deal"(text, text, numeric, timestamp WITH time zone, uuid, text, text, double precision, double precision, text, numeric, text, text)
  TO "postgres";

GRANT EXECUTE
  ON FUNCTION "public"."submit_deal"(text, text, numeric, timestamp WITH time zone, uuid, text, text, double precision, double precision, text, numeric, text, text)
  TO "service_role";

REVOKE ALL ON FUNCTION "public"."sync_deal_vote_counts"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."sync_deal_vote_counts"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."sync_deal_vote_counts"() TO "service_role";

REVOKE ALL ON TABLE "public"."bookmarked_deals" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."bookmarked_deals" TO "authenticated";

REVOKE ALL ON TABLE "public"."bookmarked_deals" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmarked_deals" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmarked_deals" TO "service_role";

REVOKE ALL ON TABLE "public"."brands" FROM "anon";

GRANT SELECT ON TABLE "public"."brands" TO "anon";

REVOKE ALL ON TABLE "public"."brands" FROM "authenticated";

GRANT SELECT ON TABLE "public"."brands" TO "authenticated";

REVOKE ALL ON TABLE "public"."brands" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."brands" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."brands" TO "service_role";

REVOKE ALL ON TABLE "public"."categories" FROM "anon";

GRANT SELECT ON TABLE "public"."categories" TO "anon";

REVOKE ALL ON TABLE "public"."categories" FROM "authenticated";

GRANT SELECT ON TABLE "public"."categories" TO "authenticated";

REVOKE ALL ON TABLE "public"."categories" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "service_role";

REVOKE ALL ON TABLE "public"."coupons" FROM "anon";

GRANT SELECT ON TABLE "public"."coupons" TO "anon";

REVOKE ALL ON TABLE "public"."coupons" FROM "authenticated";

GRANT SELECT ON TABLE "public"."coupons" TO "authenticated";

REVOKE ALL ON TABLE "public"."coupons" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."coupons" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."coupons" TO "service_role";

REVOKE ALL ON TABLE "public"."deal_votes" FROM "authenticated";

REVOKE ALL ("vote") ON TABLE "public"."deal_votes" FROM "authenticated";

GRANT UPDATE ("vote") ON TABLE "public"."deal_votes" TO "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."deal_votes" TO "authenticated";

REVOKE ALL ON TABLE "public"."deal_votes" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."deal_votes" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."deal_votes" TO "service_role";

REVOKE ALL ON TABLE "public"."deals" FROM "anon";

GRANT SELECT ON TABLE "public"."deals" TO "anon";

REVOKE ALL ON TABLE "public"."deals" FROM "authenticated";

REVOKE ALL ("category_id") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("category_id") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("coupon_code") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("coupon_code") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("description") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("description") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("discount_label") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("discount_label") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("old_price") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("old_price") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("price") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("price") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("location_id") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("location_id") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("title") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("title") ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ("valid_until") ON TABLE "public"."deals" FROM "authenticated";

GRANT UPDATE ("valid_until") ON TABLE "public"."deals" TO "authenticated";

GRANT DELETE, SELECT ON TABLE "public"."deals" TO "authenticated";

REVOKE ALL ON TABLE "public"."deals" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."deals" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."deals" TO "service_role";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

REVOKE ALL ("first_name") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("first_name") ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ("last_name") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("last_name") ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ("username") ON TABLE "public"."profiles" FROM "authenticated";

GRANT UPDATE ("username") ON TABLE "public"."profiles" TO "authenticated";

GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

REVOKE ALL ON TABLE "public"."locations" FROM "anon";

GRANT SELECT ON TABLE "public"."locations" TO "anon";

REVOKE ALL ON TABLE "public"."locations" FROM "authenticated";

GRANT SELECT ON TABLE "public"."locations" TO "authenticated";

REVOKE ALL ON TABLE "public"."locations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "service_role";

GRANT USAGE ON TYPE "public"."deal_vote" TO "anon", "authenticated";

GRANT USAGE ON TYPE "public"."moderation_status" TO "anon", "authenticated";

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter default privileges in schema public
  revoke all on tables from anon, authenticated;
alter default privileges in schema public
  revoke all on functions from public, anon, authenticated;
