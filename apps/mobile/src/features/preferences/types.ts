import { CATEGORIES, type DealCategory } from "@/features/deals/types";

/**
 * User preferences DTO, shaped like a future Supabase `preferences` row (one per user,
 * owner-only RLS, KAN-35).
 */
export interface UserPreferencesDto {
  favoriteCategories: DealCategory[];
}

export const DEFAULT_PREFERENCES: UserPreferencesDto = {
  favoriteCategories: [],
};

// Object.keys loses the key type, but CATEGORIES is a Record<DealCategory, ...>.
export const PREFERENCE_CATEGORY_IDS = Object.keys(
  CATEGORIES,
) as DealCategory[];
