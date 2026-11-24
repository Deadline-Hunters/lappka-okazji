import {
  collapseDuplicatesTransformer,
  DataSet,
  parseRawPattern,
  RegExpMatcher,
  resolveConfusablesTransformer,
  resolveLeetSpeakTransformer,
  skipNonAlphabeticTransformer,
  toAsciiLowerCaseTransformer,
} from "obscenity";

import { normalizeText } from "../../../lib/search";

// Roots and common leetspeak variations of Polish profanities
const POLISH_PROFANITY_PATTERNS = [
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
  "szm@t",
  "pedal",
];

// Terms that might accidentally match root fragments but are completely valid Polish words
const WHITELISTED_TERMS = [
  "sukienka",
  "sukienki",
  "sukience",
  "sukienek",
  "kuchnia",
  "kucharz",
  "kuchenka",
  "kuchenny",
  "rachunek",
  "rachunki",
  "recepta",
  "recepty",
  "przeboj",
  "przebojowy",
  "szacunek",
  "poradnik",
  "ciepły",
  "ciepla",
  "cieplo",
  "ciepłe",
  "kawa",
  "obiad",
  "paczek",
  "pączek",
];

let cachedMatcher: RegExpMatcher | null = null;

function getMatcher(): RegExpMatcher {
  if (cachedMatcher) {
    return cachedMatcher;
  }

  const dataset = new DataSet();

  for (const patternString of POLISH_PROFANITY_PATTERNS) {
    dataset.addPhrase((phrase) =>
      phrase.addPattern(parseRawPattern(patternString)),
    );
  }

  for (const whitelisted of WHITELISTED_TERMS) {
    dataset.addPhrase((phrase) => phrase.addWhitelistedTerm(whitelisted));
  }

  cachedMatcher = new RegExpMatcher({
    blacklistMatcherTransformers: [
      resolveConfusablesTransformer(),
      resolveLeetSpeakTransformer(),
      toAsciiLowerCaseTransformer(),
      skipNonAlphabeticTransformer(),
      collapseDuplicatesTransformer(),
    ],
    ...dataset.build(),
  });

  return cachedMatcher;
}

/**
 * Checks whether the supplied text contains Polish vulgarisms or offensive language.
 * Handles diacritics, leetspeak (e.g. 0->o, 1->i), spaced letters (k.u.r.w.a),
 * and avoids common false positives (e.g. "sukienka", "kuchnia").
 */
export function hasProfanity(text: string | null | undefined): boolean {
  if (!text) {
    return false;
  }

  const trimmed = text.trim();
  if (trimmed === "") {
    return false;
  }

  const matcher = getMatcher();

  // Test against original string as well as normalized (without Polish diacritics)
  const normalized = normalizeText(trimmed);

  return matcher.hasMatch(trimmed) || matcher.hasMatch(normalized);
}

export const PROFANITY_ERROR_MESSAGE =
  "Treść zawiera niedozwolone słowa. Zmień ją przed opublikowaniem okazji.";
