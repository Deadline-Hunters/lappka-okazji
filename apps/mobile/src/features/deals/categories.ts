import type { ChipOption } from "@/components/FilterChips";

import { CATEGORIES, type Deal, type DealCategory } from "./types";

// "favorites" = the categories picked in Preferencje (KAN-34).
export type CategoryFilter = "all" | "favorites" | DealCategory;

// How many categories get a chip under the search bar; the rest are in the filter sheet.
const QUICK_CATEGORY_COUNT = 4;

// Object.keys loses the key type, but CATEGORIES is a Record<DealCategory, ...>.
const CATEGORY_IDS = Object.keys(CATEGORIES) as DealCategory[];

const ALL_OPTION: ChipOption<CategoryFilter> = {
  id: "all",
  label: "Wszystkie",
};

const FAVORITES_OPTION: ChipOption<CategoryFilter> = {
  id: "favorites",
  label: "Ulubione",
  icon: "heart",
};

function categoryOption(id: DealCategory): ChipOption<CategoryFilter> {
  return { id, label: CATEGORIES[id].label, emoji: CATEGORIES[id].emoji };
}

// Leading options: "Wszystkie", plus "Ulubione" once the user has favorites.
function baseOptions(hasFavorites: boolean): ChipOption<CategoryFilter>[] {
  return hasFavorites ? [ALL_OPTION, FAVORITES_OPTION] : [ALL_OPTION];
}

// Every option, for the filter sheet.
export function categoryFilterOptions(
  hasFavorites: boolean,
): ChipOption<CategoryFilter>[] {
  return [...baseOptions(hasFavorites), ...CATEGORY_IDS.map(categoryOption)];
}

// Leading options plus the categories with the most deals. A category picked in the
// filter sheet gets a chip too, so the active filter is always visible.
export function quickCategoryOptions(
  deals: readonly Deal[],
  selected: CategoryFilter,
  hasFavorites: boolean,
): ChipOption<CategoryFilter>[] {
  const counts = new Map<DealCategory, number>();
  for (const deal of deals) {
    counts.set(deal.category, (counts.get(deal.category) ?? 0) + 1);
  }

  // Sorting is stable, so ties keep the CATEGORIES order.
  const common = CATEGORY_IDS.filter((id) => counts.has(id))
    .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
    .slice(0, QUICK_CATEGORY_COUNT);

  if (
    selected !== "all" &&
    selected !== "favorites" &&
    !common.includes(selected)
  ) {
    common.unshift(selected);
  }

  return [...baseOptions(hasFavorites), ...common.map(categoryOption)];
}

export function matchesCategory(
  deal: Deal,
  filter: CategoryFilter,
  favorites: readonly DealCategory[] = [],
) {
  if (filter === "all") return true;
  if (filter === "favorites") return favorites.includes(deal.category);
  return deal.category === filter;
}

// " w kategorii „Jedzenie”" for empty-result messages; empty for "all".
export function categoryFilterSuffix(filter: CategoryFilter) {
  if (filter === "all") return "";
  if (filter === "favorites") return " w ulubionych kategoriach";
  return ` w kategorii „${CATEGORIES[filter].label}”`;
}
