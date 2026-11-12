import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type CouponBadgeVariant = "official" | "validity" | "fresh";

export type CouponBadge = {
  label: string;
  variant: CouponBadgeVariant;
  icon?: IoniconName;
};

export type CouponAction = {
  label: string;
  icon?: IoniconName;
};

export type Coupon = {
  id: string;
  brandName: string;
  brandLogoUrl?: string;
  brandLogoBackground?: string;
  categoryLabel: string;

  // Badge shown next to the brand name, e.g. "Oficjalny Partner".
  partnerBadge?: CouponBadge;
  // Badge anchored to the top-right corner, e.g. validity or weekly offer.
  topBadge?: CouponBadge;

  discountLabel?: string;
  offerLabel?: string;
  price?: number;
  oldPrice?: number;

  title: string;
  description?: string;

  isActivated?: boolean;
  validUntil?: string;

  // Text code shown on the card and a separate payload for the QR popup.
  code?: string;
  qrCode?: string;

  action?: CouponAction;
};

export type CouponFilter = "all" | "activated" | "ending_soon" | "code" | "qr";

export const COUPON_FILTERS: { id: CouponFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "activated", label: "Aktywowane" },
  { id: "ending_soon", label: "Kończą się wkrótce" },
  { id: "code", label: "Z kodem" },
  { id: "qr", label: "Z kodem QR" },
];

const ENDING_SOON_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} zł`;
}

export function isEndingSoon(coupon: Coupon, now = Date.now()) {
  if (!coupon.validUntil) return false;

  const timeLeft = new Date(coupon.validUntil).getTime() - now;
  return timeLeft >= 0 && timeLeft <= ENDING_SOON_DAYS * DAY_MS;
}
