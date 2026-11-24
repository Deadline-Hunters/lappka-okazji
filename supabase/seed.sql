-- Local development seed data.
--
-- This started from the mobile mock data:
--   apps/mobile/src/features/deals/mockDeals.ts
--   apps/mobile/src/features/coupons/mockCoupons.ts
--   apps/mobile/src/features/profile/data/mockProfile.ts
--
-- It is loaded by `supabase db reset` (see [db.seed] in supabase/config.toml).
-- The whole file is idempotent: it can be re-run on top of itself.

set search_path = public, extensions;

-- Dev users ----------------------------------------------------------------
-- All four accounts use the password: password.
-- The auth trigger creates the profile row; the update below fills it in.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'kamil.seed@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Kamil","last_name":"Kowalski","username":"Kamil_PK"}'::jsonb,
    '2025-01-15T10:00:00Z',
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111112',
    'authenticated',
    'authenticated',
    'anna.seed@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Anna","last_name":"Nowak","username":"ania_nowak"}'::jsonb,
    '2025-02-03T09:30:00Z',
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111113',
    'authenticated',
    'authenticated',
    'piotr.seed@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Piotr","last_name":"Wiśniewski","username":"piotr_w"}'::jsonb,
    '2025-03-21T14:15:00Z',
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111114',
    'authenticated',
    'authenticated',
    'zofia.seed@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Zofia","last_name":"Lewandowska","username":"zofia_l"}'::jsonb,
    '2025-04-08T18:45:00Z',
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do nothing;

insert into auth.identities (
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    jsonb_build_object(
      'sub', '11111111-1111-1111-1111-111111111111',
      'email', 'kamil.seed@example.com',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '11111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111112',
    jsonb_build_object(
      'sub', '11111111-1111-1111-1111-111111111112',
      'email', 'anna.seed@example.com',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '11111111-1111-1111-1111-111111111113',
    '11111111-1111-1111-1111-111111111113',
    jsonb_build_object(
      'sub', '11111111-1111-1111-1111-111111111113',
      'email', 'piotr.seed@example.com',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '11111111-1111-1111-1111-111111111114',
    '11111111-1111-1111-1111-111111111114',
    jsonb_build_object(
      'sub', '11111111-1111-1111-1111-111111111114',
      'email', 'zofia.seed@example.com',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider_id, provider) do nothing;

insert into public.profiles (id) values
  ('11111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111112'),
  ('11111111-1111-1111-1111-111111111113'),
  ('11111111-1111-1111-1111-111111111114')
on conflict (id) do nothing;

update public.profiles p
set
  first_name = v.first_name,
  last_name = v.last_name,
  username = v.username,
  is_verified = v.is_verified,
  lappsy_balance = v.lappsy_balance,
  created_at = v.created_at
from (values
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Kamil', 'Kowalski', 'Kamil_PK', true, 150,
    '2025-01-15T10:00:00Z'::timestamptz
  ),
  (
    '11111111-1111-1111-1111-111111111112'::uuid,
    'Anna', 'Nowak', 'ania_nowak', true, 80,
    '2025-02-03T09:30:00Z'::timestamptz
  ),
  (
    '11111111-1111-1111-1111-111111111113'::uuid,
    'Piotr', 'Wiśniewski', 'piotr_w', false, 30,
    '2025-03-21T14:15:00Z'::timestamptz
  ),
  (
    '11111111-1111-1111-1111-111111111114'::uuid,
    'Zofia', 'Lewandowska', 'zofia_l', true, 210,
    '2025-04-08T18:45:00Z'::timestamptz
  )
) as v(id, first_name, last_name, username, is_verified, lappsy_balance, created_at)
where p.id = v.id;

-- Categories ----------------------------------------------------------------

insert into public.categories (id, label, emoji) values
  ('jedzenie', 'Jedzenie', '🍔'),
  ('kawa', 'Kawa', '☕'),
  ('moda', 'Moda', '👕'),
  ('elektronika', 'Elektronika', '🎧'),
  ('rozrywka', 'Rozrywka', '🎟️'),
  ('uslugi', 'Usługi', '🖨️'),
  ('inne', 'Inne', '🛍️'),
  ('sport', 'Sport', '🏋️'),
  ('zdrowie', 'Zdrowie', '💊'),
  ('ksiazki', 'Książki', '📚')
on conflict (id) do update set
  label = excluded.label,
  emoji = excluded.emoji;

-- Locations -----------------------------------------------------------------

insert into public.locations (id, name, address, location) values
  (
    '10000000-0000-0000-0000-000000000001',
    'Żabka',
    'Rynek Główny',
    st_setsrid(st_makepoint(19.9385, 50.0624), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Biedronka',
    'Floriańska',
    st_setsrid(st_makepoint(19.9398, 50.0638), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Ksero Pod Palmą',
    'ul. Karmelicka',
    st_setsrid(st_makepoint(19.9315, 50.0640), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Piekarnia Pawlak',
    'ul. Szewska',
    st_setsrid(st_makepoint(19.9348, 50.0619), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Kino Pod Baranami',
    'Rynek Główny 27',
    st_setsrid(st_makepoint(19.9356, 50.0612), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'Media Expert',
    'ul. Floriańska 12',
    st_setsrid(st_makepoint(19.9399, 50.0645), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    'Pizzeria Trattoria',
    null,
    st_setsrid(st_makepoint(19.9360, 50.0630), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'Awiteks',
    'Grodzka 12',
    st_setsrid(st_makepoint(19.9375, 50.0576), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000009',
    'Empik',
    'Rynek Główny 5',
    st_setsrid(st_makepoint(19.9370, 50.0618), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000010',
    'Rossmann',
    'ul. Długa 12',
    st_setsrid(st_makepoint(19.9388, 50.0660), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000011',
    'Decathlon',
    'ul. Pawia 5',
    st_setsrid(st_makepoint(19.9450, 50.0680), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000012',
    'Multikino',
    'ul. Pawia 5',
    st_setsrid(st_makepoint(19.9445, 50.0685), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000013',
    'Księgarnia Pod Globusem',
    'ul. Długa 1',
    st_setsrid(st_makepoint(19.9372, 50.0655), 4326)::geography
  ),
  (
    '10000000-0000-0000-0000-000000000014',
    'Fit Fabric',
    'ul. Starowiślna 12',
    st_setsrid(st_makepoint(19.9430, 50.0580), 4326)::geography
  )
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  location = excluded.location;

-- Brands --------------------------------------------------------------------

insert into public.brands (id, name, logo_url, logo_background) values
  ('20000000-0000-0000-0000-000000000001', 'Costa Coffee', '', '#F3EDE3'),
  ('20000000-0000-0000-0000-000000000002', 'Pizza Hut', '', '#F6E2D8'),
  ('20000000-0000-0000-0000-000000000003', 'KFC', '', '#F6E8DE'),
  ('20000000-0000-0000-0000-000000000004', 'Bubble Tea Kraków', '', '#F3E3EC'),
  ('20000000-0000-0000-0000-000000000005', 'Cinema City', '', '#EDE6F3'),
  ('20000000-0000-0000-0000-000000000006', 'Empik', '', '#F3E9D8'),
  ('20000000-0000-0000-0000-000000000007', 'Rossmann', '', '#E6F0FA'),
  ('20000000-0000-0000-0000-000000000008', 'Decathlon', '', '#E3EEF7'),
  ('20000000-0000-0000-0000-000000000009', 'Multikino', '', '#EFE3F0'),
  ('20000000-0000-0000-0000-000000000010', 'Fit Fabric', '', '#E8F3E6')
on conflict (id) do update set
  name = excluded.name,
  logo_url = excluded.logo_url,
  logo_background = excluded.logo_background;

-- Coupons -------------------------------------------------------------------

insert into public.coupons (
  id,
  brand_id,
  category_id,
  title,
  description,
  price,
  old_price,
  discount_label,
  valid_until,
  code,
  qr_code
) values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'kawa',
    'Drugi napój na hasło studenckie',
    'Kup dowolną kawę lub herbatę w rozmiarze M/L, a drugi napój tej samej lub mniejszej pojemności zgarniesz z mega rabatem!',
    6,
    15,
    '-60%',
    date_trunc('day', now()) + interval '4 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'LAPPKA-STUDENT24',
    'LAPPKA-STUDENT24'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'jedzenie',
    'Duża pizza dla studenta',
    'Wybierz dowolną dużą pizzę z klasycznego menu i zapłać studencką cenę.',
    29,
    41,
    '-30%',
    date_trunc('day', now()) + interval '12 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'PIZZA-STUDENT30',
    'PIZZA-STUDENT30'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000003',
    'jedzenie',
    'Kubetek Student Box',
    null,
    19.99,
    32,
    '-38%',
    date_trunc('day', now()) + interval '3 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    null,
    'KFC-STUDENT-BOX'
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000004',
    'kawa',
    'Dwa bubble tea w cenie jednego',
    'Wybierz dwa dowolne napoje z menu i zapłać tylko za jeden. Oferta dostępna na miejscu i na wynos.',
    17.9,
    35.8,
    '2 za 1',
    date_trunc('day', now()) + interval '9 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'BUBBLE-2ZA1',
    'BUBBLE-2ZA1'
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000005',
    'rozrywka',
    'Bilet do kina w środy',
    'Obowiązuje na wszystkie seanse 2D z ważną legitymacją studencką.',
    18,
    null,
    null,
    date_trunc('day', now()) + interval '30 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    null,
    null
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000006',
    'ksiazki',
    'Książka -20% z legitymacją studencką',
    'Rabat obejmuje książki z wybranych działów. Nie łączy się z innymi promocjami.',
    31.99,
    39.99,
    '-20%',
    date_trunc('day', now()) + interval '6 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'EMPIK-STUDENT20',
    'EMPIK-STUDENT20'
  ),
  (
    '30000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000007',
    'zdrowie',
    'Kosmetyki pielęgnacyjne -25%',
    'Na hasło STUDENT przy kasie. Oferta dotyczy kosmetyków własnych marek.',
    22.49,
    29.99,
    '-25%',
    date_trunc('day', now()) + interval '8 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'ROSSMANN-STUDENT25',
    'ROSSMANN-STUDENT25'
  ),
  (
    '30000000-0000-0000-0000-000000000008',
    '20000000-0000-0000-0000-000000000008',
    'sport',
    'Buty do biegania -30%',
    'Wybrane modele obuwia treningowego. Rabat dostępny również online.',
    174.99,
    249.99,
    '-30%',
    date_trunc('day', now()) + interval '14 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'DECATHLON-RUN30',
    'DECATHLON-RUN30'
  ),
  (
    '30000000-0000-0000-0000-000000000009',
    '20000000-0000-0000-0000-000000000009',
    'rozrywka',
    'Bilet 2D za 15 zł',
    'Ważny od poniedziałku do czwartku, z wyłączeniem premier.',
    15,
    25,
    '-40%',
    date_trunc('day', now()) + interval '5 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'MULTIKINO-15',
    'MULTIKINO-15'
  ),
  (
    '30000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000010',
    'sport',
    'Karnet miesięczny open -30%',
    'Karnet obejmuje siłownię i strefę cardio. Wymagana legitymacja studencka.',
    89,
    129,
    '-31%',
    date_trunc('day', now()) + interval '20 days'
      + interval '23 hours 59 minutes 59.999 seconds',
    'FIT-STUDENT30',
    'FIT-STUDENT30'
  )
on conflict (id) do update set
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  old_price = excluded.old_price,
  discount_label = excluded.discount_label,
  valid_until = excluded.valid_until,
  code = excluded.code,
  qr_code = excluded.qr_code;

-- Deals ---------------------------------------------------------------------

insert into public.deals (
  id,
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
  confirmations,
  denials,
  moderation_status,
  created_at
) values
  (
    '40000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000001',
    'kawa',
    'Kawa 2 za 1 (dowolna wielkość)',
    'Wszystkie rodzaje kawy z ekspresu na wynos.',
    6,
    12,
    '-50%',
    null,
    date_trunc('day', now()) + interval '22 hours',
    14,
    0,
    'approved',
    now() - interval '8 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    null,
    '10000000-0000-0000-0000-000000000002',
    'jedzenie',
    'Lody rzemieślnicze Marletto 500ml',
    'Promocja wielosztukowa przy zakupie 3 opakowań z kartą sklepu.',
    9.99,
    14.99,
    '-33%',
    null,
    date_trunc('day', now()) + interval '21 hours',
    9,
    0,
    'approved',
    now() - interval '35 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    null,
    '10000000-0000-0000-0000-000000000003',
    'uslugi',
    'Druk pracy dyplomowej & twarda oprawa ze złoceniem',
    'Zniżka na hasło "SESJA24" przy okazaniu legitymacji studenckiej. Czas realizacji poniżej 2h.',
    0,
    null,
    '-30%',
    'SESJA24',
    date_trunc('day', now()) + interval '23 hours',
    28,
    0,
    'approved',
    now() - interval '65 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    null,
    '10000000-0000-0000-0000-000000000004',
    'jedzenie',
    'Pieczywo rzemieślnicze & słodkie bułki po 19:00',
    'Wszystkie wypieki z bieżącego dnia przecenione o połowę.',
    2.5,
    5,
    '-50%',
    null,
    date_trunc('day', now()) + interval '21 hours',
    19,
    0,
    'approved',
    now() - interval '12 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    null,
    '10000000-0000-0000-0000-000000000005',
    'rozrywka',
    'Bilety do kina 2 za 1 na seanse popołudniowe',
    null,
    22,
    44,
    '-50%',
    null,
    date_trunc('day', now()) + interval '23 hours',
    7,
    0,
    'approved',
    now() - interval '25 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    null,
    '10000000-0000-0000-0000-000000000006',
    'elektronika',
    'Słuchawki bezprzewodowe ANC -40%',
    null,
    179,
    299,
    '-40%',
    null,
    date_trunc('day', now()) + interval '20 hours',
    4,
    1,
    'approved',
    now() - interval '180 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000007',
    '11111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000007',
    'jedzenie',
    'Pizza z pieca -40% po 20:00',
    null,
    14.99,
    24.99,
    null,
    null,
    date_trunc('day', now()) - interval '1 day' + interval '23 hours',
    28,
    0,
    'approved',
    date_trunc('day', now()) - interval '1 day'
      + interval '19 hours 30 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000008',
    '11111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000002',
    'jedzenie',
    'Lody Marletto 2+1 GRATIS',
    null,
    9.99,
    null,
    '2+1 GRATIS',
    null,
    date_trunc('day', now()) + interval '1 day' + interval '21 hours',
    9,
    0,
    'approved',
    date_trunc('day', now()) - interval '2 days'
      + interval '11 hours 15 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000009',
    '11111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000008',
    'jedzenie',
    'Croissant maślany -50%',
    null,
    2.5,
    5,
    '-50%',
    null,
    date_trunc('day', now()) - interval '3 days' + interval '18 hours',
    19,
    0,
    'approved',
    date_trunc('day', now()) - interval '4 days'
      + interval '8 hours 45 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000010',
    '11111111-1111-1111-1111-111111111112',
    '10000000-0000-0000-0000-000000000009',
    'ksiazki',
    'Książki -20% na hasło STUDENT',
    'Rabat na całą ofertę książek, z wyłączeniem podręczników i gier.',
    31.99,
    39.99,
    '-20%',
    'EMPIK20',
    date_trunc('day', now()) + interval '2 days' + interval '21 hours',
    6,
    0,
    'approved',
    now() - interval '45 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000011',
    '11111111-1111-1111-1111-111111111114',
    '10000000-0000-0000-0000-000000000010',
    'zdrowie',
    'Kosmetyki pielęgnacyjne -25%',
    'Oferta dotyczy kosmetyków własnych marek Rossmanna.',
    22.49,
    29.99,
    '-25%',
    'ROSSMANN25',
    date_trunc('day', now()) + interval '4 days' + interval '22 hours',
    11,
    0,
    'approved',
    now() - interval '2 hours'
  ),
  (
    '40000000-0000-0000-0000-000000000012',
    '11111111-1111-1111-1111-111111111113',
    '10000000-0000-0000-0000-000000000011',
    'sport',
    'Buty do biegania -30%',
    'Wybrane modele obuwia treningowego. Rabat dostępny również online.',
    174.99,
    249.99,
    '-30%',
    null,
    date_trunc('day', now()) + interval '6 days' + interval '20 hours',
    3,
    1,
    'approved',
    now() - interval '3 hours'
  ),
  (
    '40000000-0000-0000-0000-000000000013',
    '11111111-1111-1111-1111-111111111112',
    '10000000-0000-0000-0000-000000000012',
    'rozrywka',
    'Bilet do kina 2D za 15 zł',
    'Ważny od poniedziałku do czwartku, z wyłączeniem premier.',
    15,
    25,
    '-40%',
    'MULTIKINO15',
    date_trunc('day', now()) + interval '1 day' + interval '23 hours',
    8,
    0,
    'approved',
    now() - interval '90 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000014',
    '11111111-1111-1111-1111-111111111114',
    '10000000-0000-0000-0000-000000000014',
    'sport',
    'Karnet miesięczny open -30%',
    'Karnet obejmuje siłownię i strefę cardio. Wymagana legitymacja studencka.',
    89,
    129,
    '-31%',
    null,
    date_trunc('day', now()) + interval '10 days' + interval '21 hours',
    5,
    0,
    'approved',
    now() - interval '5 hours'
  ),
  (
    '40000000-0000-0000-0000-000000000015',
    '11111111-1111-1111-1111-111111111113',
    '10000000-0000-0000-0000-000000000009',
    'ksiazki',
    'Zeszyt A5 3 w cenie 2',
    'Promocja na zeszyty w kratkę i w linie z wybranych serii.',
    9.99,
    14.99,
    '-33%',
    null,
    date_trunc('day', now()) + interval '3 days' + interval '22 hours',
    2,
    0,
    'approved',
    now() - interval '4 hours'
  ),
  (
    '40000000-0000-0000-0000-000000000016',
    '11111111-1111-1111-1111-111111111112',
    '10000000-0000-0000-0000-000000000013',
    'ksiazki',
    'Książki akademickie -15%',
    'Rabat na wybrane pozycje z działu nauk społecznych i humanistycznych.',
    42.49,
    49.99,
    '-15%',
    null,
    date_trunc('day', now()) + interval '7 days' + interval '20 hours',
    4,
    0,
    'approved',
    now() - interval '6 hours'
  ),
  (
    '40000000-0000-0000-0000-000000000017',
    '11111111-1111-1111-1111-111111111113',
    '10000000-0000-0000-0000-000000000001',
    'jedzenie',
    'Kanapka z kurczakiem -30%',
    'Oferta na kanapki z witryny, ważna do wyczerpania zapasów.',
    6.99,
    9.99,
    '-30%',
    null,
    date_trunc('day', now()) + interval '2 days' + interval '20 hours',
    0,
    0,
    'pending',
    now() - interval '20 minutes'
  ),
  (
    '40000000-0000-0000-0000-000000000018',
    '11111111-1111-1111-1111-111111111114',
    '10000000-0000-0000-0000-000000000010',
    'zdrowie',
    'Maseczki nawilżające -50%',
    'Dotyczy maseczek w saszetkach z wybranej linii.',
    4.99,
    9.99,
    '-50%',
    null,
    date_trunc('day', now()) + interval '5 days' + interval '21 hours',
    0,
    0,
    'pending',
    now() - interval '30 minutes'
  )
on conflict (id) do update set
  created_by = excluded.created_by,
  location_id = excluded.location_id,
  category_id = excluded.category_id,
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  old_price = excluded.old_price,
  discount_label = excluded.discount_label,
  coupon_code = excluded.coupon_code,
  valid_until = excluded.valid_until,
  confirmations = excluded.confirmations,
  denials = excluded.denials,
  moderation_status = excluded.moderation_status,
  created_at = excluded.created_at;

-- Deal votes ----------------------------------------------------------------

insert into public.deal_votes (deal_id, user_id, vote, created_at) values
  ('40000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111112', 'confirm', now() - interval '7 minutes'),
  ('40000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111113', 'confirm', now() - interval '6 minutes'),
  ('40000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111114', 'confirm', now() - interval '5 minutes'),
  ('40000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'confirm', now() - interval '30 minutes'),
  ('40000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111112', 'confirm', now() - interval '28 minutes'),
  ('40000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111113', 'confirm', now() - interval '60 minutes'),
  ('40000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111114', 'confirm', now() - interval '55 minutes'),
  ('40000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111112', 'deny', now() - interval '150 minutes'),
  ('40000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'confirm', now() - interval '40 minutes'),
  ('40000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111113', 'confirm', now() - interval '35 minutes'),
  ('40000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111112', 'confirm', now() - interval '100 minutes'),
  ('40000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111114', 'confirm', now() - interval '80 minutes'),
  ('40000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111113', 'confirm', now() - interval '4 hours'),
  ('40000000-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', 'confirm', now() - interval '5 hours')
on conflict (deal_id, user_id) do update set
  vote = excluded.vote,
  created_at = excluded.created_at;

-- Keep aggregate counters deterministic on repeated seed runs.
-- The vote trigger increments them while seeding; reset them to the mock
-- values afterwards (the seeded votes are a sample, not the full history).

update public.deals d
set
  confirmations = v.confirmations,
  denials = v.denials
from (values
  ('40000000-0000-0000-0000-000000000001'::uuid, 14, 0),
  ('40000000-0000-0000-0000-000000000002'::uuid, 9, 0),
  ('40000000-0000-0000-0000-000000000003'::uuid, 28, 0),
  ('40000000-0000-0000-0000-000000000006'::uuid, 4, 1),
  ('40000000-0000-0000-0000-000000000010'::uuid, 6, 0),
  ('40000000-0000-0000-0000-000000000011'::uuid, 11, 0),
  ('40000000-0000-0000-0000-000000000013'::uuid, 8, 0),
  ('40000000-0000-0000-0000-000000000014'::uuid, 5, 0),
  ('40000000-0000-0000-0000-000000000016'::uuid, 4, 0)
) as v(id, confirmations, denials)
where d.id = v.id;

-- Bookmarks -----------------------------------------------------------------

insert into public.bookmarked_deals (user_id, deal_id, created_at) values
  ('11111111-1111-1111-1111-111111111111', '40000000-0000-0000-0000-000000000002', now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', '40000000-0000-0000-0000-000000000003', now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', '40000000-0000-0000-0000-000000000005', now() - interval '20 hours'),
  ('11111111-1111-1111-1111-111111111111', '40000000-0000-0000-0000-000000000010', now() - interval '30 minutes'),
  ('11111111-1111-1111-1111-111111111111', '40000000-0000-0000-0000-000000000012', now() - interval '15 minutes'),
  ('11111111-1111-1111-1111-111111111112', '40000000-0000-0000-0000-000000000001', now() - interval '3 days'),
  ('11111111-1111-1111-1111-111111111112', '40000000-0000-0000-0000-000000000004', now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111112', '40000000-0000-0000-0000-000000000011', now() - interval '90 minutes'),
  ('11111111-1111-1111-1111-111111111113', '40000000-0000-0000-0000-000000000007', now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111113', '40000000-0000-0000-0000-000000000013', now() - interval '75 minutes')
on conflict (user_id, deal_id) do nothing;
