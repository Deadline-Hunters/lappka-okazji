import type { ChipOption } from "@/components/FilterChips";

import { CATEGORIES, type Deal, type DealCategory } from "./types";

export type CategoryFilter = "all" | DealCategory;

// How many categories get a chip under the search bar; the rest are in the filter sheet.
const QUICK_CATEGORY_COUNT = 4;

// Object.keys loses the key type, but CATEGORIES is a Record<DealCategory, ...>.
const CATEGORY_IDS = Object.keys(CATEGORIES) as DealCategory[];

const ALL_OPTION: ChipOption<CategoryFilter> = {
  id: "all",
  label: "Wszystkie",
};

function categoryOption(id: DealCategory): ChipOption<CategoryFilter> {
  return { id, label: CATEGORIES[id].label, emoji: CATEGORIES[id].emoji };
}

// "Wszystkie" plus every category, for the filter sheet.
export const CATEGORY_FILTER_OPTIONS: ChipOption<CategoryFilter>[] = [
  ALL_OPTION,
  ...CATEGORY_IDS.map(categoryOption),
];

// "Wszystkie" plus the categories with the most deals. A category picked in the
// filter sheet gets a chip too, so the active filter is always visible.
export function quickCategoryOptions(
  deals: readonly Deal[],
  selected: CategoryFilter,
): ChipOption<CategoryFilter>[] {
  const counts = new Map<DealCategory, number>();
  for (const deal of deals) {
    counts.set(deal.category, (counts.get(deal.category) ?? 0) + 1);
  }

  // Sorting is stable, so ties keep the CATEGORIES order.
  const common = CATEGORY_IDS.filter((id) => counts.has(id))
    .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
    .slice(0, QUICK_CATEGORY_COUNT);

  if (selected !== "all" && !common.includes(selected)) {
    common.unshift(selected);
  }

  return [ALL_OPTION, ...common.map(categoryOption)];
}

export function matchesCategory(deal: Deal, filter: CategoryFilter) {
  return filter === "all" || deal.category === filter;
}
