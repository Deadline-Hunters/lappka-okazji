CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $function$
DECLARE
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  first_name text;
  last_name text;
  requested_username text;
  candidate_username text;
  username_bits bit(130);
  candidate_id uuid := new.id;
  alphabet constant text := '0123456789abcdefghijklmnopqrstuv';
  attempt integer;
  digit integer;
BEGIN
  IF (metadata ? 'first_name' AND jsonb_typeof(metadata -> 'first_name') NOT IN ('string', 'null'))
    OR (metadata ? 'last_name' AND jsonb_typeof(metadata -> 'last_name') NOT IN ('string', 'null'))
    OR (metadata ? 'username' AND jsonb_typeof(metadata -> 'username') NOT IN ('string', 'null'))
  THEN
    RAISE EXCEPTION 'Profile metadata fields must be strings' USING ERRCODE = '22023';
  END IF;

  first_name := nullif(btrim(metadata ->> 'first_name'), '');
  last_name := nullif(btrim(metadata ->> 'last_name'), '');
  requested_username := nullif(btrim(metadata ->> 'username'), '');

  IF requested_username IS NOT NULL THEN
    INSERT INTO public.profiles (id, first_name, last_name, username)
    VALUES (new.id, first_name, last_name, requested_username);
    RETURN new;
  END IF;

  -- Encode the complete UUID as lowercase base32 to fit the username constraint.
  FOR attempt IN 1..10 LOOP
    username_bits := '00'::bit(2) || ('x' || replace(candidate_id::text, '-', ''))::bit(128);
    candidate_username := 'u_';
    FOR digit IN 0..25 LOOP
      candidate_username := candidate_username
        || substr(alphabet, substring(username_bits FROM digit * 5 + 1 FOR 5)::integer + 1, 1);
    END LOOP;

    INSERT INTO public.profiles (id, first_name, last_name, username)
    VALUES (new.id, first_name, last_name, candidate_username)
    ON CONFLICT (username) DO NOTHING;

    IF FOUND THEN
      RETURN new;
    END IF;
    candidate_id := gen_random_uuid();
  END LOOP;

  RAISE EXCEPTION 'Unable to generate a unique profile username';
END;
$function$;
