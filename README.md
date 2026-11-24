# Łappka Okazji

> Społecznościowa aplikacja mobilna do wyszukiwania, weryfikowania i dzielenia
> się lokalnymi okazjami cenowymi w czasie rzeczywistym.

[![Projekt studencki](https://img.shields.io/badge/status-MVP%20%28in%20progress%29-orange.svg)](https://github.com/Deadline-Hunters/lappka-okazji)
[![Expo](https://img.shields.io/badge/Expo-SDK%2058-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88.1-61dafb.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/backend-Supabase%20%28local%29-3ecf8e.svg)](https://supabase.com)

---

## Spis treści

- [1. Informacje o projekcie](#1-informacje-o-projekcie)
  - [1.1. Cel i koncepcja](#11-cel-i-koncepcja)
  - [1.2. Rozwiązywane problemy](#12-rozwiązywane-problemy)
  - [1.3. Charakter projektu i ramy czasowe](#13-charakter-projektu-i-ramy-czasowe)
- [2. Funkcjonalności](#2-funkcjonalności)
  - [2.1. Zestawienie statusu implementacji](#21-zestawienie-statusu-implementacji)
  - [2.2. Opis poszczególnych modułów](#22-opis-poszczególnych-modułów)
- [3. Technologie](#3-technologie)
- [4. Architektura i struktura projektu](#4-architektura-i-struktura-projektu)
  - [4.1. Struktura katalogów](#41-struktura-katalogów)
  - [4.2. Zasady architektoniczne i przepływ danych](#42-zasady-architektoniczne-i-przepływ-danych)
- [5. Wymagania środowiskowe](#5-wymagania-środowiskowe)
- [6. Instalacja i uruchomienie](#6-instalacja-i-uruchomienie)
  - [6.1. Instrukcja krok po kroku](#61-instrukcja-krok-po-kroku)
  - [6.2. Dostępne skrypty npm](#62-dostępne-skrypty-npm)
- [7. Konfiguracja](#7-konfiguracja)
  - [7.1. Plik środowiskowy `.env`](#71-plik-środowiskowy-env)
  - [7.2. Zmienne środowiskowe](#72-zmienne-środowiskowe)
  - [7.3. Tryb deweloperski bez bazy danych](#73-tryb-deweloperski-bez-bazy-danych)
- [8. Dalszy rozwój i standardy jakości](#8-dalszy-rozwój-i-standardy-jakości)
  - [8.1. Konwencje językowe](#81-konwencje-językowe)
  - [8.2. Wzorce projektowe (Feature-based)](#82-wzorce-projektowe-feature-based)
  - [8.3. Spójność UI i Design System](#83-spójność-ui-i-design-system)
  - [8.4. Ograniczenia środowiska Expo Go](#84-ograniczenia-środowiska-expo-go)
  - [8.5. Kontrola jakości kodu](#85-kontrola-jakości-kodu)
- [9. Zespół i zarządzanie projektem](#9-zespół-i-zarządzanie-projektem)
  - [9.1. Zespół projektowy](#91-zespół-projektowy)
  - [9.2. Zarządzanie zadaniami (Jira)](#92-zarządzanie-zadaniami-jira)
  - [9.3. Model pracy z gałęziami (Git Flow)](#93-model-pracy-z-gałęziami-git-flow)
  - [9.4. Konwencja commitów](#94-konwencja-commitów)
  - [9.5. Wymagania dla Pull Requestów](#95-wymagania-dla-pull-requestów)

---

## 1. Informacje o projekcie

### 1.1. Cel i koncepcja

**Łappka Okazji** to polska aplikacja mobilna stworzona z myślą o szybkim
wyszukiwaniu lokalnych okazji cenowych, promocji gastronomicznych, zniżek
studenckich oraz wyprzedaży w najbliższym otoczeniu użytkownika.

Aplikacja opiera się na **modelu społecznościowym inspirowanym mechaniką
aplikacji Yanosik**:

- Użytkownicy w terenie zgłaszają znalezione okazje cenowe.
- Pozostali członkowie społeczności potwierdzają lub negują ich aktualność
  jednym kliknięciem („Potwierdź” / „Nie ma”).
- Aktywność w aplikacji nagradzana jest punktami lojalnościowymi (**„Łappsy”**).
- Obok okazji społecznościowych aplikacja integruje katalog kuponów zniżkowych
  marek partnerskich (kody alfanumeryczne oraz kody QR do zeskanowania przy
  kasie).

### 1.2. Rozwiązywane problemy

1. **Rosnące koszty życia i budżet studencki:** Ułatwia studentom oraz
   mieszkańcom miast codzienne oszczędzanie na jedzeniu, kawie, usługach czy
   rozrywce bez konieczności przeglądania dziesiątek portali.
2. **Problem nieaktualnych ofert:** Tradycyjne gazetki promocyjne i posty w
   mediach społecznościowych często szybko stają się nieaktualne (wyprzedany
   asortyment, koniec promocji). Weryfikacja społecznościowa w czasie
   rzeczywistym gwarantuje bieżącą wiedzę o dostępności okazji.
3. **Marnowanie żywności i nadwyżek towarowych:** Umożliwia lokalom
   gastronomicznym i sklepom informowanie o szybkich przecenach (np. happy
   hours, wyprzedaże pod koniec dnia).
4. **Rozproszenie promocji i kuponów:** Agregacja ofert lokalnych na mapie
   geolokalizacyjnej oraz ogólnopolskich kuponów partnerskich w jednej,
   przejrzystej aplikacji.

### 1.3. Charakter projektu i ramy czasowe

Projekt realizowany jest jako **projekt studencki** w ramach przedmiotu
_„Projekt biznesowy”_ (semestr 5) przez zespół **Deadline Hunters**. Docelowym
kamieniem milowym jest wdrożenie funkcjonalnego **MVP do dnia 30.11.2026**.

---

## 2. Funkcjonalności

### 2.1. Zestawienie statusu implementacji

Poniższa tabela przedstawia rzetelny stan prac w repozytorium na podstawie
analizy kodu źródłowego:

| Funkcjonalność                                | Status                      | Uwagi implementacyjne                                                                                                                                                      |
| --------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Interaktywna mapa okazji**                  | ✅ Zaimplementowana         | MapLibre GL JS + OpenFreeMap w komponencie DOM (`"use dom"`), działa w Expo Go.                                                                                            |
| **Geolokalizacja użytkownika**                | ✅ Zaimplementowana         | `expo-location`, automatyczne centrowanie kamery, fallback do centrum Krakowa.                                                                                             |
| **Wyszukiwarka i filtry na mapie**            | ✅ Zaimplementowana         | Wyszukiwanie tekstowe bez polskich znaków diakrytycznych, horyzontalne chipy, modalny `FilterSheet`.                                                                       |
| **Podgląd okazji na mapie**                   | ✅ Zaimplementowana         | `DealPreviewCard` z kalkulacją dystansu, ceną, rabatem i czasem dodania.                                                                                                   |
| **Lista okazji (katalog)**                    | ✅ Zaimplementowana         | Przewijalna lista `DealCard`, baner lokalizacyjny, pull-to-refresh, empty state.                                                                                           |
| **Sortowanie listy okazji**                   | ✅ Zaimplementowana         | Sortowanie po odległości GPS (`closest`), dacie (`newest`), rabacie (`biggest_discount`) i zapisanych (`bookmarked`).                                                      |
| **Wyszukiwarka ofert na liście**              | ✅ Zaimplementowana         | Wyszukiwanie pełnotekstowe (wielowyrazowe) z normalizacją tekstu.                                                                                                          |
| **Katalog kuponów rabatowych**                | ✅ Zaimplementowana         | Przeglądanie kuponów partnerskich, filtrowanie (Wszystkie, Kończące się, Kod, QR).                                                                                         |
| **Kopiowanie kodu kuponu**                    | ✅ Zaimplementowana         | `expo-clipboard` z powiadomieniem `Toast`.                                                                                                                                 |
| **Wyświetlanie kodu QR kuponu**               | ✅ Zaimplementowana         | Generowanie kodu QR (`react-native-qrcode-svg`) w dedykowanym modalu `CouponQrModal`.                                                                                      |
| **Profil użytkownika i statystyki**           | ✅ Zaimplementowana         | Karta profilowa, saldo punktów Łappsy, liczba zgłoszeń i potwierdzeń.                                                                                                      |
| **Historia zgłoszeń użytkownika**             | ✅ Zaimplementowana         | Lista `MySubmissionsList` z odznakami statusu (`active`, `expired`).                                                                                                       |
| **Biblioteka komponentów (Design System)**    | ✅ Zaimplementowana         | Spójny zestaw ponad 15 komponentów UI i tokenów motywu (`@/theme`).                                                                                                        |
| **Głosowanie na okazje (Potwierdź / Nie ma)** | 🟡 Częściowa (Mock)         | Działa w UI, ale stan przechowywany jest wyłącznie w lokalnej pamięci komponentu (`useState`), brak synchronizacji z bazą.                                                 |
| **Zapisywanie okazji (Ulubione / Zapisane)**  | 🟡 Częściowa (Mock)         | Przełącznik zakładki działa w UI, zapis w pamięci `useState` bieżącej sesji aplikacji.                                                                                     |
| **Autentykacja i autoryzacja (UI)**           | 🟡 Częściowa (Mock)         | Formularze logowania i rejestracji, przyciski społecznościowe (Google/Apple) i `[DEV] SKIP`. Wysłanie formularza loguje dane do konsoli, brak połączenia z bazą.           |
| **Filtry zaawansowane (Okazje i Kupony)**     | 🟡 Częściowa (Placeholder)  | Przycisk „Filtry” w wyszukiwarce na tych ekranach wywołuje komunikat `Alert.alert` o pracach w toku.                                                                       |
| **Szczegóły okazji / kuponu**                 | 🟡 Częściowa (Placeholder)  | Kliknięcie w kafelek wyświetla systemowy alert informacyjny zamiast dedykowanego ekranu.                                                                                   |
| **Ustawienia radaru okazji**                  | 🟡 Częściowa (Placeholder)  | Zakładka w profilu prezentuje makietę planowanych opcji (`RadarSettingsPlaceholder`).                                                                                      |
| **Trwały backend danych (Supabase)**          | 🟡 Częściowa (Przygotowany) | Schemat bazy, migracje SQL (tabele, RLS, Storage `deal-images`, RPC `submit_deal`, `locations_near`), obsługa lokalna w Docker.                                            |
| **Formularz zgłaszania/dodawania okazji**     | ✅ Zaimplementowana         | 3-krokowy formularz (szczegóły, mapa i wybór sklepów, publikacja), integracja ze Storage `deal-images`, RPC `submit_deal`, lokalny filtr wulgaryzmów dla języka polskiego. |
| **Powiadomienia push i geofencing**           | ❌ Niezaimplementowana      | Celowo brak powiadomień w obecnej wersji MVP (usunięto ikonę dzwonka).                                                                                                     |
| **Program wymiany punktów Łappsy**            | ❌ Niezaimplementowana      | Zliczanie salda działa na makiecie, brak modułu nagród i wymiany punktów.                                                                                                  |

### 2.2. Opis poszczególnych modułów

#### Mapa (`src/features/map`)

Główny ekran aplikacji prezentujący mapę wektorową dostarczaną przez OpenFreeMap
i silnik MapLibre GL JS osadzony w WebView (`"use dom"`). Rozwiązanie to pozwala
na uruchamianie map wektorowych w środowisku Expo Go bez konieczności posiadania
kluczy API Mapbox/Google.

- Wykrywa położenie użytkownika za pośrednictwem `expo-location`.
- Automatycznie dopasowuje widok mapy (metody `flyTo` i `fitTo`) do wyników
  wyszukiwania.
- Wyświetla klikalne pinezki z emoji odpowiadającym kategorii okazji oraz
  etykietą rabatu.
- Kliknięcie pinezki wysuwa u dołu kartę podglądu `DealPreviewCard` z
  przyciskami weryfikacji społecznościowej (Yanosik-style).
- Szanuje politykę OpenStreetMap – pasek atrybucji praw autorskich pozostaje
  zawsze widoczny.

#### Okazje (`src/features/deals`)

Widok listy ofert umożliwiający szybkie przeglądanie okazji w formie
przewijalnych kafelków (`DealCard`).

- Wyszukiwanie pełnotekstowe (wielowyrazowe, ignorujące wielkość liter i polskie
  znaki diakrytyczne).
- Sortowanie według czterech kryteriów: odległość od aktualnej pozycji GPS
  użytkownika, data dodania, wysokość rabatu procentowego oraz oferty zapisane w
  bieżącej sesji.
- Baner lokalizacyjny informujący o liczbie ofert w promieniu najbliższych 500
  metrów.
- Obsługa pustych wyników wyszukiwania (`EmptyState`) oraz odświeżania listy
  (pull-to-refresh).
- Przycisk akcji (FAB) umożliwiający szybkie przejście do formularza dodawania
  okazji (`/add-deal`).

#### Formularz dodawania okazji (`src/features/deals/form`)

Trzykrokowy kreator umożliwiający zgłaszanie nowych okazji cenowych przez
zalogowanych użytkowników.

- **Krok 1 (Szczegóły):** Dodawanie zdjęcia okazji z aparatu lub galerii
  urządzenia (`expo-image-picker`), podgląd miniatury z możliwością zmiany lub
  usunięcia, wprowadzenie tytułu (3–120 znaków), wybór kategorii oraz opcjonalna
  cena.
- **Krok 2 (Lokalizacja):** Interaktywna mapa MapLibre (`DealsMap`) z
  możliwością ręcznego przesunięcia pinezki lub dotknięcia punktu na mapie,
  pobieranie lokalizacji GPS (`expo-location`), oraz lista pobliskich sklepów
  wraz z odległością i adresem (funkcja RPC `locations_near` z fallbackiem do
  danych lokalnych).
- **Krok 3 (Publikacja):** Wybór terminu ważności (Dzisiaj, Jutro, własna data),
  opcjonalna wskazówka (do 1000 znaków), podsumowanie wprowadzonych danych oraz
  publikacja.
- **Walidacja i moderacja:** Walidacja pól obowiązkowych, daty w przyszłości,
  oraz lokalny statyczny filtr wulgaryzmów dla języka polskiego ze słownikiem
  odmian, obsługą leetspeak i ochroną przed false positives.
- **Backend i Storage:** Bezpieczne przesyłanie zdjęć do Supabase Storage
  (bucket `deal-images`), wywołanie procedury `submit_deal` z kontrolą RLS oraz
  automatyczne czyszczenie osieroconych plików w przypadku błędu bazy.

#### Kupony (`src/features/coupons`)

Katalog ofert afiliacyjnych i promocji sieci handlowych.

- Prezentacja kafelków z logo marki, wysokością rabatu, warunkami promocji oraz
  datą ważności.
- Filtrowanie według typów kuponu: wszystkie, kończące się wkrótce, kody
  alfanumeryczne, kody QR.
- Jednoklikowe kopiowanie kodu promocyjnego do schowka systemowego za pomocą
  `expo-clipboard` z powiadomieniem `Toast`.
- Generowanie skanowalnego kodu QR w modalu przy użyciu
  `react-native-qrcode-svg`.
- Mechanizm odświeżania danych przy powrocie aplikacji z tła (`AppState`), jeśli
  minęło ponad 5 minut.

#### Profil (`src/features/profile`)

Panel zarządzania kontem i historią aktywności użytkownika.

- Wyświetlanie danych użytkownika (imię, nazwisko, nazwa użytkownika, data
  dołączenia, odznaka weryfikacji). Zgodnie z założeniami projektowymi profil
  nie jest profilem społecznościowym – nie zawiera awatarów ani zdjęć.
- Prezentacja liczników zaangażowania: liczba zgłoszonych okazji, liczba
  potwierdzonych okazji oraz saldo punktów „Łappsy”.
- Przełącznik zakładek (`SegmentedControl`):
  - **Moje zgłoszenia:** lista dodanych przez użytkownika ofert wraz z ich
    statusem (`active` / `expired`) i liczbą potwierdzeń od innych łowców.
  - **Ustawienia radaru:** makieta zapowiadająca funkcjonalność powiadomień
    geolokalizacyjnych.
- Przycisk bezpiecznego wylogowania z potwierdzeniem dialogowym (`Alert.alert`).

#### Autoryzacja (`src/features/auth`)

Widok logowania i rejestracji (`AuthScreen`).

- Przełącznik trybu logowanie / rejestracja oparty o `SegmentedControl`.
- Formularze z walidacją wizualną, polami ukrywania hasła oraz zapamiętaniem
  logowania.
- Przyciski logowania przez dostawców zewnętrznych (Google, Apple).
- **Przycisk deweloperski `[DEV] SKIP`:** dostępny wyłącznie w buildach
  deweloperskich (`__DEV__`), umożliwia testowanie wszystkich zakładek aplikacji
  bez konieczności uruchamiania bazy danych Supabase.

---

## 3. Technologie

W projekcie wykorzystywane są wyłącznie sprawdzone, nowoczesne technologie ze
środowiska React Native i Expo:

### Frontend mobilny

- **React Native (0.88.1):** framework bazowy do budowy wieloplatformowej
  aplikacji mobilnej.
- **Expo SDK (58.0.21):** platforma deweloperska. Aplikacja jest zoptymalizowana
  pod kątem działania w **Expo Go** (Android / iOS).
- **React (19.3.0) & React DOM (19.3.0):** biblioteka interfejsu użytkownika.
- **Expo Router (58.0.29):** routing oparty na strukturze plików w katalogu
  `src/app/`, ze ścisłą kontrolą typów tras (`typedRoutes`).
- **TypeScript (~6.0.3):** statyczne typowanie w trybie `strict`.

### Moduły natywne i biblioteki Expo

- **`expo-location` (~58.0.20):** obsługa geolokalizacji urządzenia (pozwolenia
  czasu użycia, współrzędne GPS).
- **`expo-image-picker` (~58.0.10):** obsługa wyboru zdjęć z galerii oraz
  wykonywania zdjęć aparatem w formularzu okazji (kompatybilne z Expo Go).
- **`expo-clipboard` (~58.0.4):** dostęp do schowka systemowego (kopiowanie
  kodów rabatowych).
- **`expo-secure-store` (^58.0.2):** bezpieczne szyfrowane przechowywanie danych
  uwierzytelniających.
- **`@react-native-async-storage/async-storage` (2.2.0):** persystencja sesji i
  lokalna pamięć podręczna.
- **`react-native-qrcode-svg` (^6.3.54) & `react-native-svg` (15.16.0):**
  generowanie grafiki wektorowej kodów QR.
- **`@expo/vector-icons` (^15.0.2):** zestaw ikon systemowych (Ionicons).
- **`react-native-safe-area-context` (~5.10.1):** poprawna obsługa wcięć
  ekranowych (Safe Area insets).
- **`react-native-screens` (~4.30.1):** natywne zarządzanie pamięcią ekranów
  nawigacyjnych.

### Kartografia i geodane

- **MapLibre GL JS (5.24.0):** silnik renderujący mapy wektorowe WebGL,
  uruchamiany w komponencie Expo DOM (`"use dom"`), co pozwala ominąć brak
  natywnego wsparcia dla otwartych kafelków w czystym Expo Go.
- **OpenFreeMap:** darmowe wektorowe kafelki mapowe bazujące na danych
  OpenStreetMap (styl „liberty”, polskie nazewnictwo ulic i miast).

### Backend (lokalny)

- **Supabase (CLI ^2.122.0):** lokalna instancja backendu uruchamiana w
  kontenerach Docker (PostgreSQL 17, PostgREST, GoTrue Auth).
- **`@supabase/supabase-js` (^2.118.0):** oficjalny klient JavaScript/TypeScript
  do komunikacji z bazą i autoryzacją.

### Narzędzia i jakość kodu

- **npm workspaces:** zarządzanie monorepo (`apps/*`, `packages/*`).
- **Prettier (^3.9.10):** formatowanie kodu.
- **Husky (^9.1.7) & lint-staged (^16.4.0):** automatyczne sprawdzanie
  formatowania i typowania przed zatwierdzeniem commita.
- **GitHub Actions:** ciągła integracja (CI) weryfikująca formatowanie i typy
  przy każdym Pull Requeście.

---

## 4. Architektura i struktura projektu

### 4.1. Struktura katalogów

Repozytorium zorganizowane jest jako monorepo w architekturze **Feature-Based**:

```text
lappka-okazji/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Pipeline CI (format:check, typecheck)
│       └── branch-protection.yml      # Weryfikacja przepływu gałęzi w PR
├── .husky/
│   └── pre-commit                     # Hook gita (lint-staged, git diff, typecheck)
├── supabase/
│   └── config.toml                    # Konfiguracja lokalnego środowiska Supabase
├── apps/
│   └── mobile/                        # Aplikacja mobilna (Expo / React Native)
│       ├── assets/                    # Ikony aplikacji, splash screen, favicon
│       ├── src/
│       │   ├── app/                   # Expo Router (cienkie re-eksporty widoków)
│       │   │   ├── _layout.tsx        # Główny layout (sesja Supabase, Stack)
│       │   │   ├── auth.tsx           # Trasa ekranu logowania i rejestracji
│       │   │   └── (tabs)/            # Nawigacja dolnymi zakładkami
│       │   │       ├── _layout.tsx    # Wspólny nagłówek (AppHeader) i konfiguracja zakładek
│       │   │       ├── index.tsx      # Zakładka 1: Mapa (re-eksport MapScreen)
│       │   │       ├── deals.tsx      # Zakładka 2: Okazje (re-eksport DealsScreen)
│       │   │       ├── coupons.tsx    # Zakładka 3: Kupony (re-eksport CouponsScreen)
│       │   │       └── profile.tsx    # Zakładka 4: Profil (re-eksport ProfileScreen)
│       │   ├── components/            # Współdzielone komponenty UI (Design System)
│       │   │   ├── AppHeader.tsx      # Nagłówek zakładek z tytułem
│       │   │   ├── ScreenHeader.tsx   # Nagłówek ekranów podrzędnych ze slotami
│       │   │   ├── SearchBar.tsx      # Wyszukiwarka z przyciskiem filtrów
│       │   │   ├── FilterChips.tsx    # Pasek horyzontalnych filtrów chipowych
│       │   │   ├── FilterSheet.tsx    # Wysuwany od dołu arkusz wyboru filtrów
│       │   │   ├── Button.tsx         # Uniwersalny przycisk (warianty, stany)
│       │   │   ├── IconButton.tsx     # Przycisk z samą ikoną (wymaga accessibilityLabel)
│       │   │   ├── Card.tsx           # Karta kontenerowa (elevation, bordered)
│       │   │   ├── Badge.tsx          # Etykieta wyróżniająca / odznaka
│       │   │   ├── PriceTag.tsx       # Wyświetlanie ceny, starej ceny i „Gratis”
│       │   │   ├── TextField.tsx      # Pole tekstowe z ikoną i obsługą haseł
│       │   │   ├── Checkbox.tsx       # Pole wyboru typu checkbox
│       │   │   ├── EmptyState.tsx     # Ekran pustego wyniku lub błędu
│       │   │   ├── LoadingState.tsx   # Stan ładowania danych
│       │   │   ├── SegmentedControl.tsx # Przełącznik zakładek/trybów
│       │   │   └── Toast.tsx          # Komunikat toast (np. potwierdzenie skopiowania)
│       │   ├── features/              # Moduły domenowe (Feature-based)
│       │   │   ├── auth/              # Logowanie, rejestracja, bypass DEV
│       │   │   ├── coupons/           # Kupony rabatowe, kody QR, mocki kuponów
│       │   │   ├── deals/             # Oferty, sortowanie, kategorie, mocki ofert
│       │   │   ├── map/               # Komponent DOM mapy, markery, geolokalizacja
│       │   │   └── profile/           # Profil, statystyki, zgłoszenia, makieta radaru
│       │   ├── lib/                   # Moduły pomocnicze i serwisy
│       │   │   ├── auth-session.tsx   # Kontekst stanu sesji użytkownika
│       │   │   ├── format.ts          # Formatowanie cen, czasu relatywnego i odległości
│       │   │   ├── geo.ts             # Obliczenia dystansu (haversine) i domyślne centrum
│       │   │   ├── search.ts          # Normalizacja tekstu i wyszukiwanie wielosłowne
│       │   │   └── supabase.ts        # Klient Supabase z konfiguracją AsyncStorage
│       │   └── theme/                 # Centralne tokeny wizualne (kolory, radius, spacing)
│       │       └── index.ts
│       ├── .env.example               # Wzorzec zmiennych środowiskowych
│       ├── app.json                   # Konfiguracja Expo (uprawnienia, ikony, schemat)
│       ├── package.json               # Zależności aplikacji mobilnej
│       └── tsconfig.json              # Konfiguracja TypeScript dla aplikacji mobilnej
├── package.json                       # Konfiguracja główna monorepo
├── tsconfig.json                      # Bazowa konfiguracja TypeScript
├── .prettierrc                        # Reguły formatowania kodu
├── CLAUDE.md                          # Import wytycznych dla agentów
└── AGENTS.md                          # Szczegółowe zasady i konwencje dla agentów AI
```

### 4.2. Zasady architektoniczne i przepływ danych

1. **Feature-based architecture:** Cały kod związany z daną domeną biznesową
   (ekrany, komponenty prywatne, definicje typów, dane testowe i serwisy) jest
   zamknięty w katalogu `src/features/<feature>/`.
2. **Cienkie trasy (Thin route files):** Pliki wewnątrz `src/app/` służą
   wyłącznie jako rejestracja tras nawigatora Expo Router. Nie zawierają własnej
   logiki biznesowej, a jedynie re-eksportują komponenty z odpowiednich
   katalogów `features/`.
3. **Pojedyncze źródło prawdy stylów (`@/theme`):** Kolory, zaokrąglenia rogów,
   odstępy i cienie są definiowane wyłącznie w `@/theme`. Zabronione jest
   wprowadzanie wartości heksadecymalnych bez uzasadnienia.
4. **Separacja danych i serwisów:** Dostęp do danych abstrahowany jest przez
   warstwę serwisową (np. `ProfileService`), co umożliwia bezproblemową podmianę
   obecnych danych testowych (mocków) na rzeczywiste zapytania sieciowe Supabase
   w przyszłości.

---

## 5. Wymagania środowiskowe

Przed przystąpieniem do uruchomienia projektu upewnij się, że Twoje środowisko
spełnia poniższe wymagania:

- **Node.js:** wersja **>= 24.0.0** (sprawdź: `node -v`).
- **npm:** wersja **>= 10.0.0** (sprawdź: `npm -v`).
- **Urządzenie mobilne do testów:**
  - Smartfon z systemem **Android** (rekomendowany) z zainstalowaną aplikacją
    **Expo Go** ze sklepu Google Play.
  - Opcjonalnie: smartfon z systemem **iOS** (aplikacja Expo Go) lub
    przeglądarka internetowa (wersja web).
- **Docker Desktop:** wymagany **wyłącznie**, jeśli chcesz uruchomić lokalny
  backend Supabase (PostgreSQL). Do samego testowania interfejsu aplikacji
  mobilnej Docker nie jest konieczny (dzięki danym mockowym i przyciskowi
  `[DEV] SKIP`).
- **Git:** zainstalowany i skonfigurowany system kontroli wersji.

---

## 6. Instalacja i uruchomienie

### 6.1. Instrukcja krok po kroku

#### Krok 1: Klonowanie repozytorium

```bash
git clone https://github.com/Deadline-Hunters/lappka-okazji.git
cd lappka-okazji
```

#### Krok 2: Instalacja zależności

Zainstaluj zależności dla całego monorepo (narzędzie zainstaluje pakiety w
katalogu głównym oraz w workspace `apps/mobile`, a także skonfiguruje hooki
Husky):

```bash
npm install
```

#### Krok 3: Konfiguracja zmiennych środowiskowych

W katalogu `apps/mobile/` utwórz plik `.env` na podstawie dostarczonego wzorca
`.env.example`:

- **W systemie Windows (PowerShell):**
  ```powershell
  Copy-Item apps/mobile/.env.example apps/mobile/.env
  ```
- **W systemach Linux / macOS (Bash):**
  ```bash
  cp apps/mobile/.env.example apps/mobile/.env
  ```

_Wartości domyślne w pliku `.env.example` są wystarczające do uruchomienia
aplikacji w trybie deweloperskim._

#### Krok 4: Uruchomienie lokalnego Supabase (opcjonalnie)

Jeżeli posiadasz uruchomiony program Docker Desktop i chcesz wystartować lokalne
środowisko bazodanowe:

```bash
npm run supabase:start
```

Po uruchomieniu w konsoli zostaną wyświetlone adresy URL oraz klucze API
(`anon key`). Skopiuj wygenerowany klucz do pliku `apps/mobile/.env`.

#### Krok 5: Uruchomienie aplikacji mobilnej

Uruchom serwer deweloperski Expo Metro:

```bash
npm run mobile
```

W terminalu wyświetli się kod QR:

1. Upewnij się, że Twój telefon i komputer są połączone z **tą samą siecią
   Wi-Fi**.
2. Otwórz aplikację **Expo Go** na telefonie (na systemie Android wybierz opcję
   _„Scan QR code”_, na iOS zeskanuj kod domyślnym aparatem).
3. Jeśli logowanie w sieci lokalnej zawiedzie lub korzystasz z VPN, uruchom
   tunel:
   ```bash
   cd apps/mobile && npx expo start --tunnel
   ```

#### Krok 6: Uruchomienie w przeglądarce (Web)

Do szybkiej weryfikacji układu graficznego w oknie przeglądarki:

```bash
npm run mobile:web
```

### 6.2. Dostępne skrypty npm

Wszystkie polecenia należy uruchamiać z głównego katalogu repozytorium:

| Polecenie                 | Opis działania                                                      |
| ------------------------- | ------------------------------------------------------------------- |
| `npm run mobile`          | Uruchamia serwer Expo Metro dla aplikacji mobilnej (`apps/mobile`). |
| `npm run mobile:web`      | Uruchamia aplikację mobilną w trybie Web w przeglądarce.            |
| `npm run mobile:android`  | Uruchamia aplikację na podłączonym urządzeniu/emulatorze Android.   |
| `npm run mobile:ios`      | Uruchamia aplikację na symulatorze iOS (wymaga środowiska macOS).   |
| `npm run format:check`    | Sprawdza poprawność formatowania kodu za pomocą Prettier.           |
| `npm run format`          | Automatycznie formatuje wszystkie pliki w repozytorium.             |
| `npm run typecheck`       | Wykonuje statyczną kontrolę typów TypeScript (`tsc --noEmit`).      |
| `npm run supabase:start`  | Uruchamia lokalne kontenery Supabase (wymaga Dockera).              |
| `npm run supabase:stop`   | Zatrzymuje kontenery lokalnego Supabase.                            |
| `npm run supabase:status` | Wyświetla status lokalnych usług Supabase oraz klucze API.          |
| `npm run supabase:reset`  | Resetuje stan lokalnej bazy danych.                                 |

---

## 7. Konfiguracja

### 7.1. Plik środowiskowy `.env`

Aplikacja mobilna odczytuje konfigurację środowiskową wyłącznie z pliku
`apps/mobile/.env`. Plik ten znajduje się na liście `.gitignore` i **nigdy nie
może być zatwierdzany w systemie kontroli wersji**.

### 7.2. Zmienne środowiskowe

| Zmienna                         | Wymagana | Opis                                                        | Wartość domyślna (lokalna) |
| ------------------------------- | -------- | ----------------------------------------------------------- | -------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Tak      | Adres URL instancji API Supabase.                           | `http://127.0.0.1:54321`   |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Tak      | Publiczny klucz anonimowy (anon key) do zapytań klienckich. | Wartość z `supabase start` |

> [!IMPORTANT] Zmienne z prefiksem `EXPO_PUBLIC_` są wbudowywane w kod aplikacji
> klienckiej podczas kompilacji. Nigdy nie umieszczaj w nich kluczy serwisowych
> (`service_role key`), prywatnych tokenów ani haseł.

### 7.3. Tryb deweloperski bez bazy danych

Projekt jest przystosowany do pracy w trybie offline / mock-first:

- Jeśli nie masz zainstalowanego Dockera lub nie uruchomiłeś Supabase, możesz
  pozostawić w `.env` dowolny ciąg znaków w kluczu
  `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Na ekranie logowania kliknij czerwony przycisk **`[DEV] SKIP`** w lewym górnym
  rogu nagłówka – spowoduje to przejście bezpośrednio do widoków głównych
  aplikacji z wykorzystaniem danych demonstracyjnych.

---

## 8. Dalszy rozwój i standardy jakości

### 8.1. Konwencje językowe

- **Kod źródłowy:** Całość w języku angielskim (nazwy plików, komponentów,
  funkcji, zmiennych, komentarze techniczne, typy TypeScript).
- **Interfejs użytkownika (UI):** Całość w języku polskim (tytuły ekranów,
  etykiety, teksty komunikatów, opisy dostępności `accessibilityLabel`, dane
  demonstracyjne).
- _Wyjątek historyczny:_ Klucze unii kategorii okazji (`DealCategory`:
  `jedzenie`, `kawa`, `moda`, `elektronika`, `rozrywka`, `uslugi`, `inne`)
  pozostają w języku polskim.

### 8.2. Wzorce projektowe (Feature-based)

- Każda nowa funkcjonalność musi być implementowana w dedykowanym podkatalogu
  `apps/mobile/src/features/<nazwa_funkcjonalnosci>/`.
- Nowo dodany ekran powinien zawierać:
  - Główny komponent ekranu (np. `DealsScreen.tsx`),
  - Podkatalog `components/` na komponenty prywatne danego widoku,
  - Plik `types.ts` z definicjami typów i interfejsów,
  - Ewentualne dane testowe `mock*.ts` lub warstwę serwisową `services/`.
- Pliki w `apps/mobile/src/app/` powinny zawierać jedynie cienkie re-eksporty
  gotowych ekranów.

### 8.3. Spójność UI i Design System

- Zawsze sprawdzaj katalog `apps/mobile/src/components/` przed utworzeniem
  nowego elementu UI. Nowy komponent współdzielony tworzymy tylko wtedy, gdy
  będzie używany w co najmniej dwóch niezależnych modułach.
- Wszystkie style komponentów definiujemy za pomocą `StyleSheet.create`.
- Kolory, odstępy, cienie i promienie zaokrągleń pobieramy wyłącznie z
  `@/theme`. **Nigdy nie modyfikuj istniejących wartości tokenów w motywie**,
  ponieważ może to zepsuć wygląd innych ekranów tworzonych przez resztę zespołu.
- Dbaj o ergonomię mobilną: minimalny obszar dotykowy przycisków wynosi 44x44 px
  (dla małych ikon używaj właściwości `hitSlop` w `IconButton`).

### 8.4. Ograniczenia środowiska Expo Go

- Zespół testuje aplikację wyłącznie przy użyciu **Expo Go na systemie
  Android**.
- **Nie instaluj bibliotek zawierających natywny kod C++/Java/Obj-C**, które nie
  są wbudowane w Expo Go (wymusiłoby to konieczność generowania custom
  development buildów u wszystkich programistów).
- Nowe pakiety instaluj zawsze za pomocą polecenia:
  ```bash
  cd apps/mobile && npx expo install <nazwa-pakietu>
  ```
  a zgodność wersji sprawdzaj poleceniem:
  ```bash
  cd apps/mobile && npx expo install --check
  ```

### 8.5. Kontrola jakości kodu

- **Formatowanie kodu (Prettier):** Przed commitem uruchom `npm run format`.
- **Weryfikacja typów:** Przed zakończeniem pracy uruchom `npm run typecheck`.
- **Uwaga na zakończenia linii na systemie Windows:** Jeśli pracujesz na
  systemie Windows z opcją `core.autocrlf=true`, upewnij się, że Prettier nie
  zgłasza błędów zakończeń linii CRLF/LF. W razie wątpliwości uruchom
  `npx prettier --check --end-of-line auto .`.

---

## 9. Zespół i zarządzanie projektem

### 9.1. Zespół projektowy

Projekt realizowany jest przez zespół **Deadline Hunters**:

- Repozytorium GitHub:
  [Deadline-Hunters/lappka-okazji](https://github.com/Deadline-Hunters/lappka-okazji)
- Przedmiot: _Projekt biznesowy_ (Semestr 5)

### 9.2. Zarządzanie zadaniami (Jira)

Prace projektowe, planowanie sprintów i podział zadań koordynowane są w systemie
**Jira**.

- Klucz projektu: **`KAN`**
- Każde zadanie posiada unikalny identyfikator (np. `KAN-14`, `KAN-32`), który
  musi być powiązany z nazwą gałęzi w gicie oraz tytułem commitów i Pull
  Requestów.

### 9.3. Model pracy z gałęziami (Git Flow)

W projekcie przyjęto ustrukturyzowany model gałęzi z automatyczną ochroną
weryfikowaną przez GitHub Actions:

- **Gałęzie długożyjące:**
  - `main` – gałąź produkcyjna, zawierająca wyłącznie stabilne, przetestowane
    wydania.
  - `test` – gałąź środowiska testowego/stagingowego.
  - `develop` – główna gałąź integracyjna dla bieżącego rozwoju.
- **Gałęzie funkcjonalne (Feature branches):**
  - Tworzone z gałęzi `develop`.
  - Konwencja nazewnictwa: `feature/KAN-<numer>-<krótki-opis>` (np.
    `feature/KAN-14-deal-form`).
- **Zasady przepływu zmian (Branch Promotion Flow):**
  1. Pull Requesty z gałęzi funkcjonalnych kierowane są do `develop`.
  2. Zmiany z `develop` promowane są do gałęzi `test` osobnym PR.
  3. Zmiany z `test` trafiają do gałęzi `main` w ramach wydania produkcyjnego.
     _Workflow `branch-protection.yml` blokuje bezpośrednie łączenie gałęzi z
     pominięciem kolejności (chyba że PR posiada etykietę `hotfix`)._

### 9.4. Konwencja commitów

Wszystkie commity muszą być tworzone zgodnie ze standardem **Conventional
Commits** w języku angielskim, ze wskazaniem numeru zadania Jira jako zakresu
(_scope_):

```text
<typ>(KAN-<numer>): <opis w języku angielskim>
```

Przykłady poprawnych commitów:

- `feat(KAN-32): map header, search and deal voting`
- `fix(KAN-12): resolve deals list distance calculation sorting`
- `chore: update dependencies and prettier configuration`
- `docs: update README with environment requirements`

### 9.5. Wymagania dla Pull Requestów

Przed scaleniem Pull Requesta do gałęzi `develop` wymagane jest:

1. Pomyślne przejście automatycznych testów GitHub Actions (`CI`):
   - Weryfikacja formatowania Prettier (`npm run format:check`),
   - Weryfikacja statycznego typowania TypeScript (`npm run typecheck`).
2. Zawarcie identyfikatora zadania Jira w tytule PR (np.
   `feat(KAN-14): submit deal form`).
3. Wyraźne wyszczególnienie w opisie PR zmian dotykających plików
   współdzielonych (`apps/mobile/src/theme/index.ts`,
   `apps/mobile/src/app/(tabs)/_layout.tsx`, `package.json`, `app.json`, typy
   współdzielone).
