import type { LatLng } from "@/lib/geo";

export type DealCategory =
  | "jedzenie"
  | "kawa"
  | "moda"
  | "elektronika"
  | "rozrywka"
  | "inne";

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
  inne: { label: "Inne", emoji: "🛍️", color: "#8E8A96" },
};
// wstępnie dałem godzine, można to obgadać
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

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} zł`;
}
