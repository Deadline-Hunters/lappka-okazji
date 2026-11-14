import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

type IconName = ComponentProps<typeof Ionicons>["name"];

export interface CategoryMeta {
  iconName: IconName;
  backgroundColor: string;
  iconColor: string;
}

/**
 * Zwraca konfigurację ikony i kolorów dla kategorii lub tytułu zgłoszenia.
 */
export function getCategoryMeta(
  category: string,
  title?: string,
): CategoryMeta {
  const lowerCat = category.toLowerCase();
  const lowerTitle = (title ?? "").toLowerCase();

  if (
    lowerCat === "kawa" ||
    lowerTitle.includes("kawa") ||
    lowerTitle.includes("coffee")
  ) {
    return {
      iconName: "cafe-outline",
      backgroundColor: "#FBEFEA",
      iconColor: "#A34E24",
    };
  }

  if (lowerTitle.includes("pizza") || lowerCat === "pizza") {
    return {
      iconName: "pizza-outline",
      backgroundColor: "#F2F8DE",
      iconColor: "#5B8A1E",
    };
  }

  if (
    lowerTitle.includes("lody") ||
    lowerTitle.includes("deser") ||
    lowerCat === "deser"
  ) {
    return {
      iconName: "ice-cream-outline",
      backgroundColor: "#FDF2EA",
      iconColor: "#D97706",
    };
  }

  if (
    lowerCat === "jedzenie" ||
    lowerTitle.includes("burger") ||
    lowerTitle.includes("obiad")
  ) {
    return {
      iconName: "restaurant-outline",
      backgroundColor: "#FBEFEA",
      iconColor: "#D2733A",
    };
  }

  if (lowerCat === "moda") {
    return {
      iconName: "shirt-outline",
      backgroundColor: "#F3EEFA",
      iconColor: "#7C4DDB",
    };
  }

  if (lowerCat === "elektronika") {
    return {
      iconName: "headset-outline",
      backgroundColor: "#EEF3FC",
      iconColor: "#2F6FDE",
    };
  }

  if (lowerCat === "rozrywka") {
    return {
      iconName: "ticket-outline",
      backgroundColor: "#FEF2E8",
      iconColor: "#E07B1A",
    };
  }

  return {
    iconName: "pricetag-outline",
    backgroundColor: "#F3F1F7",
    iconColor: "#6B6573",
  };
}

/**
 * Formatuje datę do czytelnej formy relatywnej w języku polskim:
 * - "Dziś, 14:20"
 * - "Wczoraj"
 * - "X dni temu"
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today.getTime() - itemDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (diffDays <= 0) {
    return `Dziś, ${hours}:${minutes}`;
  }

  if (diffDays === 1) {
    return "Wczoraj";
  }

  if (diffDays >= 2 && diffDays <= 4) {
    return `${diffDays} dni temu`;
  }

  if (diffDays > 4 && diffDays <= 30) {
    return `${diffDays} dni temu`;
  }

  const dayStr = String(date.getDate()).padStart(2, "0");
  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
  return `${dayStr}.${monthStr}.${date.getFullYear()}`;
}

/**
 * Wylicza procent rabatu z ceny i starej ceny.
 */
export function calculateDiscountPercent(
  price: number,
  oldPrice?: number | null,
): number | null {
  if (!oldPrice || oldPrice <= price) {
    return null;
  }
  return Math.round((1 - price / oldPrice) * 100);
}
