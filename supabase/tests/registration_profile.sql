-- Run against the local database with:
-- docker exec -i supabase_db_lappkaOkazji psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/tests/registration_profile.sql
-- Test data is rolled back, including all auth users.
BEGIN;

DO $test$
DECLARE
  metadata_id uuid := 'e1111111-1111-4111-8111-111111111111';
  default_id uuid := 'e2222222-2222-4222-8222-222222222222';
  collision_id uuid := '00000000-0000-0000-0000-000000000000';
  profile public.profiles%ROWTYPE;
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id IN (metadata_id, default_id, collision_id, 'e3333333-3333-4333-8333-333333333333')
  ) THEN
    RAISE EXCEPTION 'Test user IDs are already in use';
  END IF;

  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES (metadata_id, 'profile-metadata-test@example.invalid',
    '{"first_name":" Anna ","last_name":" Nowak ","username":"test_profile_kan47"}');

  SELECT * INTO STRICT profile FROM public.profiles WHERE id = metadata_id;
  IF profile.first_name IS DISTINCT FROM 'Anna'
    OR profile.last_name IS DISTINCT FROM 'Nowak'
    OR profile.username::text IS DISTINCT FROM 'test_profile_kan47'
    OR profile.lappsy_balance <> 0
    OR profile.is_verified
  THEN
    RAISE EXCEPTION 'Profile metadata or defaults were not saved correctly';
  END IF;

  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES (default_id, 'profile-default-test@example.invalid', '{}'::jsonb);

  SELECT * INTO STRICT profile FROM public.profiles WHERE id = default_id;
  IF profile.username IS NULL
    OR profile.username::text !~ '^u_[0-9a-v]{26}$'
    OR profile.first_name IS NOT NULL
    OR profile.last_name IS NOT NULL
    OR profile.lappsy_balance <> 0
  THEN
    RAISE EXCEPTION 'Default profile was not created correctly';
  END IF;

  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES ('e3333333-3333-4333-8333-333333333333', 'profile-collision-owner@example.invalid',
    '{"username":"u_00000000000000000000000000"}');
  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES (collision_id, 'profile-collision-test@example.invalid', '{}'::jsonb);
  SELECT * INTO STRICT profile FROM public.profiles WHERE id = collision_id;
  IF profile.username::text = 'u_00000000000000000000000000'
    OR profile.username::text !~ '^u_[0-9a-v]{26}$'
  THEN
    RAISE EXCEPTION 'Generated username collision was not resolved';
  END IF;

  BEGIN
    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES ('e4444444-4444-4444-8444-444444444444', 'profile-invalid-test@example.invalid',
      '{"first_name": ["invalid"]}');
    RAISE EXCEPTION 'Invalid metadata was accepted';
  EXCEPTION WHEN invalid_parameter_value THEN
    NULL;
  END;

  BEGIN
    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES ('e5555555-5555-4555-8555-555555555555', 'profile-duplicate-test@example.invalid',
      '{"username":"TEST_PROFILE_KAN47"}');
    RAISE EXCEPTION 'Duplicate username was accepted';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  IF (SELECT count(*) FROM auth.users u JOIN public.profiles p ON p.id = u.id
      WHERE u.id IN ('11111111-1111-1111-1111-111111111111',
                     '11111111-1111-1111-1111-111111111112',
                     '11111111-1111-1111-1111-111111111113',
                     '11111111-1111-1111-1111-111111111114')
        AND u.confirmation_token = '' AND u.recovery_token = ''
        AND u.email_change_token_new = '' AND u.email_change = '') <> 4
  THEN
    RAISE EXCEPTION 'Seeded users, profiles or authentication tokens are missing';
  END IF;
END;
$test$;

ROLLBACK;
