import { matchesQuery } from "@/lib/search";

import { CATEGORIES, type Deal } from "./types";

// Shared by the deals list and the map: every word of the query has to appear in the
// title, description, store, address or category (diacritics are ignored).
export function matchesDealSearch(deal: Deal, query: string) {
  return matchesQuery(
    [
      deal.title,
      deal.description,
      deal.storeName,
      deal.address,
      CATEGORIES[deal.category].label,
    ],
    query,
  );
}
