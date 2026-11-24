ALTER TABLE public.profiles
  ADD COLUMN registration_age smallint,
  ADD CONSTRAINT profiles_registration_age_check
    CHECK (registration_age IS NULL OR registration_age BETWEEN 13 AND 150);

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  registration_age_text text := new.raw_user_meta_data ->> 'registration_age';
  chosen_username text := new.raw_user_meta_data ->> 'username';
BEGIN
  IF coalesce(new.raw_app_meta_data ->> 'provider', 'email') = 'email' THEN
    IF chosen_username IS NULL
      OR chosen_username !~ '^[A-Za-z0-9_.]{3,30}$'
      OR registration_age_text IS NULL
      OR registration_age_text !~ '^(1[3-9]|[2-9][0-9]|1[0-4][0-9]|150)$'
    THEN
      RAISE EXCEPTION 'A valid username and registration age are required';
    END IF;

    INSERT INTO public.profiles (id, username, registration_age)
    VALUES (new.id, chosen_username, registration_age_text::smallint)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.profiles (id)
    VALUES (new.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$function$;
