import { normalizeText } from "../../../lib/search";

// Roots and common leetspeak/phonetic patterns of Polish profanities
const POLISH_PROFANITY_ROOTS = [
  "kurw",
  "k0rw",
  "korw",
  "chuj",
  "choj",
  "ch0j",
  "chvj",
  "huj",
  "hoj",
  "h0j",
  "hvj",
  "pierdol",
  "p1erdol",
  "pierdal",
  "spierdal",
  "sp1erdal",
  "jeb",
  "j3b",
  "pizd",
  "p1zd",
  "cip",
  "c1p",
  "gown",
  "g0wn",
  "kutas",
  "szmat",
  "pedal",
  "cwel",
];

// Polish words that contain root fragments but are completely benign
const WHITELISTED_WORDS = [
  "sukienka",
  "sukienki",
  "sukience",
  "sukienek",
  "sukienkowy",
  "kuchnia",
  "kuchnie",
  "kuchni",
  "kucharz",
  "kuchenka",
  "kuchenny",
  "rachunek",
  "rachunki",
  "rachunkowy",
  "recepta",
  "recepty",
  "przeboj",
  "przebojowy",
  "przebojem",
  "szacunek",
  "szacunku",
  "poradnik",
  "ciepły",
  "ciepla",
  "cieplo",
  "ciepłe",
  "cieplutki",
  "kawa",
  "obiad",
  "paczek",
  "pączek",
  "pączki",
];

/**
 * Normalizes text for profanity detection:
 * - strips Polish diacritics (normalizeText)
 * - maps common leetspeak substitutions to standard Latin characters
 * - collapses repeated consecutive letters (e.g. "kkuuurrrwwaa" -> "kurwa")
 */
function normalizeForProfanity(input: string): string {
  // 1. Strip Polish accents and lowercase
  let s = normalizeText(input).toLowerCase();

  // 2. Leetspeak substitutions
  s = s
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/v/g, "u")
    .replace(/[\s._\-–—,*+!?/\\#~=^()]+/g, ""); // strip spacing / punctuation between letters

  // 3. Collapse duplicate consecutive characters (e.g. "kuuurrwwa" -> "kurwa")
  s = s.replace(/(.)\1+/g, "$1");

  return s;
}

/**
 * Checks whether the supplied text contains Polish vulgarisms or offensive language.
 * Handles diacritics, leetspeak, spaced letters (k.u.r.w.a), and avoids common false positives.
 * Fully compatible with React Native (iOS, Android) and Web (no bundling/ESM interop issues).
 */
export function hasProfanity(text: string | null | undefined): boolean {
  if (!text) {
    return false;
  }

  const raw = text.trim();
  if (raw === "") {
    return false;
  }

  // Check if the text matches a whitelisted term exactly or word-by-word
  const normalizedWords = normalizeText(raw).toLowerCase().split(/\s+/);
  const normalizedRaw = normalizeForProfanity(raw);

  // If entire input is whitelisted, approve
  for (const whitelisted of WHITELISTED_WORDS) {
    const normWhite = normalizeForProfanity(whitelisted);
    if (normalizedRaw === normWhite) {
      return false;
    }
  }

  // Check whitelisted words in sentence context
  const filteredWords = normalizedWords.filter((w) => {
    const cleanWord = normalizeForProfanity(w);
    return !WHITELISTED_WORDS.some(
      (white) => normalizeForProfanity(white) === cleanWord,
    );
  });

  const textToCheck =
    filteredWords.length > 0 ? filteredWords.join("") : normalizedRaw;
  const processed = normalizeForProfanity(textToCheck);

  for (const root of POLISH_PROFANITY_ROOTS) {
    const normalizedRoot = normalizeForProfanity(root);
    if (processed.includes(normalizedRoot)) {
      return true;
    }
  }

  return false;
}

export const PROFANITY_ERROR_MESSAGE =
  "Treść zawiera niedozwolone słowa. Zmień ją przed opublikowaniem okazji.";
