import type { ChipOption } from "@/components/FilterChips";
import type { LatLng } from "@/lib/geo";

export type DealCategory =
  "jedzenie" | "kawa" | "moda" | "elektronika" | "rozrywka" | "uslugi" | "inne";

export type DealVote = "up" | "down";

export type DealSortOption =
  "closest" | "newest" | "biggest_discount" | "bookmarked";

export const DEAL_SORT_OPTIONS: ChipOption<DealSortOption>[] = [
  { id: "closest", label: "Najbliżej", icon: "navigate" },
  { id: "newest", label: "Najnowsze", icon: "flash" },
  { id: "biggest_discount", label: "Największe rabaty", icon: "flame" },
  { id: "bookmarked", label: "Zapisane", icon: "bookmark" },
];

export type Deal = {
  id: string;
  title: string;
  description?: string;
  storeName: string;
  address: string;
  category: DealCategory;
  location: LatLng;
  price: number;
  oldPrice?: number;
  validUntil: string;
  createdAt: string;
  confirmations: number;
  denials: number;

  // Additional fields for rich presentation (from Figma KAN-12)
  badgeText?: string;
  couponCode?: string;
};

export const CATEGORIES: Record<
  DealCategory,
  { label: string; emoji: string; color: string }
> = {
  jedzenie: { label: "Jedzenie", emoji: "🍔", color: "#E0A030" },
  kawa: { label: "Kawa", emoji: "☕", color: "#8A6A3B" },
  moda: { label: "Moda", emoji: "👕", color: "#7C4DDB" },
  elektronika: { label: "Elektronika", emoji: "🎧", color: "#2F6FDE" },
  rozrywka: { label: "Rozrywka", emoji: "🎟️", color: "#E07B1A" },
  uslugi: { label: "Usługi", emoji: "🖨️", color: "#2F6FDE" },
  inne: { label: "Inne", emoji: "🛍️", color: "#8E8A96" },
};

// Set to one hour for now, open for discussion.
const FRESH_THRESHOLD_MS = 60 * 60 * 1000;

export function isFresh(deal: Deal, now = Date.now()) {
  return now - new Date(deal.createdAt).getTime() < FRESH_THRESHOLD_MS;
}

export function discountPercent(deal: Deal) {
  if (!deal.oldPrice || deal.oldPrice <= deal.price) {
    return null;
  }

  return Math.round((1 - deal.price / deal.oldPrice) * 100);
}
