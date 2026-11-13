/** Affiliate coupon displayed in the Coupons tab. */
export type Coupon = {
  /** Stable identifier of the coupon coming from the backend. */
  id: string;
  /** Display name of the partner or brand. */
  brandName: string;
  /** Optional URL of the brand logo image. */
  brandLogoUrl?: string;
  /** Optional background color shown behind the logo while it loads. */
  brandLogoBackground?: string;
  /** Human-readable category or context line, e.g. "Kawiarnie stacjonarne". */
  categoryLabel: string;

  /** Short marketing title of the offer. */
  title: string;
  /** Optional longer description of what the offer includes. */
  description?: string;

  /** Optional offer type label, e.g. "2 za 1". */
  offerLabel?: string;
  /** Optional current price in PLN. */
  price?: number;
  /** Optional regular price in PLN, displayed struck through. */
  oldPrice?: number;
  /** Optional discount label, e.g. "-30%". */
  discountLabel?: string;

  /** ISO date after which the coupon can no longer be used. */
  validUntil?: string;

  /** Optional text code the user can show or type at checkout. */
  code?: string;
  /** Optional payload encoded into the QR code popup. */
  qrCode?: string;
};

export type CouponFilter = "all" | "ending_soon" | "code" | "qr";

export const COUPON_FILTERS: { id: CouponFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
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
