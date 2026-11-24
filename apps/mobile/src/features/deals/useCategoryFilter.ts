import { useState } from "react";

import { usePreferences } from "@/features/preferences/PreferencesProvider";

import type { CategoryFilter } from "./categories";
import type { DealCategory } from "./types";

const NO_FAVORITES: readonly DealCategory[] = [];

/**
 * Category filter for deal lists and the map. Until the user picks one, it defaults to
 * "Ulubione" when favorite categories are set in Preferencje, otherwise "Wszystkie".
 */
export function useCategoryFilter() {
  const { preferences } = usePreferences();
  const favorites = preferences?.favoriteCategories ?? NO_FAVORITES;
  const hasFavorites = favorites.length > 0;
  const [picked, setPicked] = useState<CategoryFilter | null>(null);

  const isDefault =
    picked === null || (picked === "favorites" && !hasFavorites);
  const category: CategoryFilter = isDefault
    ? hasFavorites
      ? "favorites"
      : "all"
    : picked;

  return {
    category,
    setCategory: setPicked,
    // True while the filter comes from Preferencje, not from a tap.
    isDefault,
    favorites,
    hasFavorites,
  };
}
