import { CATEGORIES, type Deal } from "@/features/deals/types";

const POLISH_LETTERS: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
};

// Lowercase without Polish diacritics, so "zabka" finds "Żabka" and "lodz" finds "Łódź".
export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (letter) => POLISH_LETTERS[letter] ?? letter);
}

// Every word of the query has to appear somewhere in the deal (title, description, store, address, category).
export function matchesSearch(deal: Deal, query: string) {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return true;
  }

  const text = normalizeText(
    [
      deal.title,
      deal.description ?? "",
      deal.storeName,
      deal.address,
      CATEGORIES[deal.category].label,
    ].join(" "),
  );

  return words.every((word) => text.includes(word));
}
