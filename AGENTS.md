# AGENTS.md: Łappka Okazji mobile app

Context for coding agents working in this repo. The root `CLAUDE.md` imports
this file, so Claude Code loads it from the repo root as well.

**Łappka Okazji** is a Polish mobile app for finding local deals ("okazje") on a
map. Users report deals and confirm or deny them (Yanosik-style). It also has
coupons (which are affiliate brand deals), a profile with submission history,
and "Łappsy" reward points. It is a student team project (Projekt biznesowy,
semester 5) with an MVP target of **30.11.2026**. Work is tracked in Jira
project **KAN**, and the UI is designed in Figma.

## Stack

- Monorepo with npm workspaces (`apps/*`, `packages/*`). Required Node/npm
  versions are in `package.json` `engines`. The root `package-lock.json` is the
  real lock file.
- `apps/mobile`: **Expo SDK**, React Native, React, **Expo Router** with typed
  routes, TypeScript `strict`, `@/*` → `apps/mobile/src/*`. Versions live in
  `apps/mobile/package.json`.
- Backend: **Supabase, run locally** (Docker + Supabase CLI,
  `supabase/config.toml`). Data, auth users and storage don't sync between
  developers, so migrations and `seed.sql` must be committed. The schema lives
  in `supabase/migrations`.
- The client is in `src/lib/supabase.ts`. It reads `EXPO_PUBLIC_SUPABASE_URL`
  and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `apps/mobile/.env`, which is
  gitignored. Never commit or print its values.

## Expo has changed, so don't trust your training data

Expo ships breaking changes every SDK release. Before writing code that touches
an Expo or React Native API:

1. Check the installed `expo` version in `apps/mobile/package.json`.
2. Read the docs for that SDK version (start from
   <https://docs.expo.dev/llms.txt> and follow the version link) and never
   answer from memory.

## Commands (from the repo root)

```bash
npm install                 # first time; also installs the git hooks
npm run mobile              # Expo server; open with Expo Go (Android)
npm run mobile:web          # quick check in a browser
npm run format              # format code
npm run format:check        # check formatting
npm run lint                # run ESLint
npm run typecheck           # check TypeScript types
npm run supabase:start      # local Supabase (needs Docker)
npm run db:types            # regenerate database.types.ts from local Supabase
npm run db:types:check      # verify committed types are current
cd apps/mobile && npx expo install <pkg>    # add deps, never a bare `npm i`
cd apps/mobile && npx expo install --check  # verify SDK-compatible versions
```

- `apps/mobile/src/lib/database.types.ts` is generated, so never edit it by
  hand. After changing a migration, run `npm run supabase:start` then
  `npm run db:types`, and commit the regenerated file.
- `npm run db:types:check` regenerates the types in memory and exits non-zero if
  the committed file is stale; it never writes to the file. CI runs it when the
  database or the types file changes.
- The scripts in `package.json` are the source of truth for quality checks. CI
  (`.github/workflows/ci.yml`) and the git hook (`.husky/pre-commit`) run them,
  so don't skip them.
- Run the project's quality scripts before calling a task done.

## Rules

- **Language:** code in English, UI in Polish. English covers file, route and
  component names, variables, types, union values and comments. Polish covers
  everything the user sees: titles, labels, messages, `accessibilityLabel`s,
  permission strings and mock data. Legacy exception: the `DealCategory` keys
  (`jedzenie`, `kawa`, …) are Polish.
- **Errors:** log failures with `console.error` and useful context; don't show
  `Alert` popups for errors. Keep validation feedback inline in the UI.
- **Database calls:** use the typed Supabase client (`createClient<Database>`
  with `database.types.ts`) and let RPC/table results be inferred instead of
  writing local row types or casts.
- **Expo Go only.** The team tests with `npx expo start` and Expo Go on Android.
  Don't add native modules that Expo Go doesn't ship, because that would force a
  dev build on everyone. Raise it with the team first. No EAS builds; discuss
  CI/CD changes before making them.
- **Structure:**
  - A feature lives in `src/features/<feature>/` (screen, `components/`,
    `types.ts`, `mock*.ts`).
  - Route files in `src/app/` are thin re-exports, and no non-route code goes in
    `src/app/`.
  - Import with `@/`.
  - Colors, spacing, radius and shadows come from `@/theme`, with no stray hex
    values. Use `StyleSheet.create`.
- **Reuse before adding.** Check `src/components/` (below) before writing a new
  button, input, chip or card. Add a new shared component only when two views
  need it.
- **Theme tokens:** add new tokens only when Figma needs them, and **never
  change an existing value**, because that restyles other people's screens.
- **Shared files** affect everyone: `theme/index.ts`,
  `features/deals/types.ts` + `mockDeals.ts` (used by the deals list _and_ the
  map), `lib/geo.ts`, `app/(tabs)/_layout.tsx`, `package.json`/lock, `app.json`.
  List every change to them in the PR.
- **Mobile UX:** handle the keyboard (`keyboardShouldPersistTaps`, dismiss on
  drag), give every list Polish empty and error states, and keep tap targets at
  44 px or more (`IconButton` adds `hitSlop`). Android comes first.
- **Native dirs:** `ios/` and `android/` are generated (Continuous Native
  Generation) and gitignored. Never edit or commit them.

## Git

- Long-lived branches are `main`, `test` and `develop`. **PRs target
  `develop`.**
- Feature branches are named `feature/KAN-<n>-<slug>`. Jira links PRs by the
  `KAN-<n>` key, so keep it in the branch name and the PR title.
- Commits use Conventional Commits with the ticket as scope, in English, e.g.
  `feat(KAN-32): map header, search and deal voting`.

## App shell

- `src/app/(tabs)/_layout.tsx` defines **5 tabs**: `index` = Mapa, `deals` =
  Okazje, `coupons` = Kupony, `profile` = Profil, `preferences` = Preferencje
  (favorite categories; KAN-34).
- Every tab gets the same `AppHeader` (app name + tab title) from the layout's
  `header` option, which also handles the top safe-area inset. Screens don't
  draw their own top bar or add a top inset.
- Product decisions (KAN-11):
  - **The profile is not a social profile.** It is for points and your own
    history, so there are no avatars or profile photos, and `UserProfileDto` has
    no `avatarUrl`.
  - There is **no notifications bell** until push notifications exist (KAN-22).
  - The **Obserwowane** (watchlist) tab was removed. Okazje keeps a local
    bookmark and a "Zapisane" sort for now.
  - Mock data uses **no stock photos**. Cards fall back to initials or emoji.

## Shared UI (`src/components/`)

| Component                     | Use it for                                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppHeader`                   | Tab header. Rendered by the tabs layout only.                                                                                                                                    |
| `ScreenHeader`                | Header of a pushed or standalone screen: title plus optional back arrow (`onBack`) and `left`/`right` slots.                                                                     |
| `SearchBar`                   | Every search field. `onFilterPress` shows the "Filtry" button, and `elevated` is for floating over the map.                                                                      |
| `FilterChips` / `Chip`        | A horizontal single-select chip row (`ChipOption<T>`: `id`, `label`, `icon` or `emoji`). `elevated` makes the chips white for use over the map. Use `Chip` for wrapping layouts. |
| `FilterSheet`                 | Bottom sheet with every filter option. It is opened by `SearchBar`'s "Filtry" button.                                                                                            |
| `SegmentedControl`            | 2–3 mutually exclusive modes, e.g. profile tabs or Logowanie/Rejestracja (`tone="primary"`).                                                                                     |
| `Button`                      | Variants `primary`, `secondary`, `tonal`, `surface`, `dark`; sizes `sm`/`md`/`lg`. Supports `icon` + `iconPosition` and `loading`.                                               |
| `IconButton`                  | Icon-only actions. `accessibilityLabel` is required. Variants `plain`, `muted` (modal close), `surface` (map controls).                                                          |
| `Card`                        | Surface container. Props `elevation` (`none`/`sm`/`md`/`lg`) and `bordered`.                                                                                                     |
| `Badge`                       | Small label. Tones `highlight`, `accent`, `primary`, `muted`; optional `icon` or `dot`.                                                                                          |
| `PriceTag`                    | Price, old price and discount label. `0` renders as "Gratis".                                                                                                                    |
| `TextField`                   | Labelled input with `icon`, `hint`, `error` and `clearable`. Password fields get a show/hide toggle.                                                                             |
| `Checkbox`                    | Labelled checkbox.                                                                                                                                                               |
| `EmptyState` / `LoadingState` | Empty, error (`tone="danger"`, optional retry `action`) and loading states. `fill` for whole screens, `card` inside scroll views.                                                |
| `Toast`                       | Short confirmation, e.g. "Skopiowano kod".                                                                                                                                       |

Helpers:

- `src/lib/format.ts`: `formatPrice`, `formatTimeAgo`, `formatHunters`.
- `src/lib/search.ts`: `normalizeText` and `matchesQuery`. Search ignores Polish
  diacritics, and every typed word must match.
- `src/lib/geo.ts`: `LatLng`, `DEFAULT_CENTER` (Kraków), `distanceInMeters`,
  `formatDistance`.
- `features/deals/search.ts`: `matchesDealSearch`, used by the deals list and
  the map.
- `features/deals/categories.ts`: `CategoryFilter` (`"all"`, `"favorites"` or a
  category), `categoryFilterOptions` (all, for the sheet),
  `quickCategoryOptions` ("Wszystkie", "Ulubione" + the 4 categories with the
  most deals, plus the selected one) and `matchesCategory`.
- `features/deals/useCategoryFilter.ts`: category filter state (used by Mapa).
  It defaults to "Ulubione" when favorite categories are set in Preferencje
  (`usePreferences()` from `features/preferences/PreferencesProvider`).

**Filter pattern:** chips under the search bar show the most common options, and
the search bar's "Filtry" button opens a `FilterSheet` with all of them. A pick
from the sheet also gets a chip. Mapa uses this for deal categories. On Okazje
and Kupony the "Filtry" button is still a placeholder alert.

`theme/index.ts` holds `colors`, `radius`, `spacing` and `shadows` (`sm` for
inputs and chips, `md` for list cards, `lg` for cards over the map). Use the
semantic colors: `highlight`/`highlightText` for discount badges, `price` for
prices, `neutralDark` for selected chips, `surfaceMuted` for idle chips.

## Map (`features/map/`)

- Requirements: Android, **must run in Expo Go**, OSM data, no API keys or cost.
- Implementation: **MapLibre GL JS + OpenFreeMap** vector tiles inside an **Expo
  DOM component** (`DealsMap.tsx`, `"use dom"`). maplibre-gl is loaded as UMD
  5.x from unpkg with SRI, because Metro breaks its worker and v6 is ESM-only.
  The npm package is used for types only.
- OSM tile policy: the "© OpenStreetMap contributors" attribution must **never
  be covered**, which is why the preview card sits above the attribution bar.
  Don't prefetch tiles or download them for offline use
  (<https://operations.osmfoundation.org/policies/tiles/>).
- DOM component gotchas:
  - Drive the map through props. Camera moves go through a `CameraTarget` prop
    with an incrementing `id`.
  - Function props passed to the DOM component must be `async`.
  - Open links with `Linking`.
  - Never set CSS `position` on marker elements.
  - OpenFreeMap "liberty" defaults to English labels, so they are overridden
    with `name:pl`.
- Ruled out, so don't re-propose them: `react-native-maps` (OSM returns 403 in
  Expo Go), `expo-maps` (Google only, no Expo Go), native MapLibre RN (needs a
  dev build), CARTO basemaps (needs a key).
- `LogBox.ignoreLogs(["DomWebView.injectJavaScript"])` in the root layout works
  around a known Expo DOM bug. Leave it in.

## Gotchas

- **Windows line endings:** with `core.autocrlf=true`, files are checked out
  with CRLF, and Prettier (which expects LF) flags them. The hook then rejects
  files you edited. Run `npm run format`, or `npx prettier --write <files>`,
  before committing. To check without rewriting, use
  `npx prettier --check --end-of-line auto .`.
- **Several clones on one machine:** Metro's cache is shared between clones. If
  the map fails with `Unable to resolve "../<other-clone>/…/DealsMap.tsx"`,
  restart with `cd apps/mobile && npx expo start --clear`.
  `npm run mobile -- --clear` does not forward the flag.
- **Expo Go can't connect:** turn off your VPN or try `npx expo start --tunnel`.
- **Dev login shortcut:** the auth screen has a dev button that signs in as a
  seeded user. It needs a running local Supabase with the seed loaded.
- **Guest mode (KAN-63):** „Kontynuuj jako gość” lets people browse without an
  account (`isGuest` in `useAuthSession()`). Wrap every action that needs an
  account (voting, bookmarking, adding deals) with `useRequireAccount()` from
  `@/lib/auth-session`.

## Navigation & routing

- Use **Expo Router** for all navigation. Routes live in `src/app/`: every file
  there is a screen, and `_layout.tsx` files define navigators.
- Import `Link`, `router` and `useLocalSearchParams` from `expo-router`.
- Docs: <https://docs.expo.dev/router/introduction.md>

## Deal submission form (`features/deals/form/`)

- Route: `/add-deal` (`src/app/add-deal.tsx`). Guests can open the form, but
  publishing requires an account and prompts them to sign in.
- 3-step wizard:
  - Step 1: photo (`expo-image-picker`), title, category (`CATEGORIES`),
    optional price.
  - Step 2: location on MapLibre DOM component (`DealsMap.tsx`), GPS detection,
    draggable pin, store selection list (`storeLocationsService.ts` calling
    `locations_near` RPC).
  - Step 3: validity date, optional hint/description, complete summary card,
    publication button.
- Local profanity moderation (`features/deals/validation/profanity.ts`):
  standalone Polish profanity matcher with Polish roots, leetspeak resolution,
  diacritics normalization, and false-positive whitelisting (e.g. "sukienka",
  "kuchnia").
- Supabase Storage: bucket `deal-images` stores user photos under
  `${userId}/${fileName}` with RLS policies restricting write access to the
  authenticated owner. Cleanup of orphaned files is handled on RPC error.

## Documentation maintenance

Keep the root `README.md` accurate about features, setup, architecture and how
to run the project. Update it in the same task when a change affects those
things, and never describe mocks or plans as implemented.

Don't duplicate volatile details in docs. Dependency versions, individual
rule/config names, exact hook or CI step lists, and file inventories belong in
`package.json`, the config files and the source — point to them instead of
copying their contents, so routine commits don't require doc edits.
