// Basic tokens based on the Figma mockups. To be extended in KAN-11.
export const colors = {
  background: "#F7F5FB",
  surface: "#FFFFFF",
  text: "#1E1B24",
  textMuted: "#6B6573",
  border: "#E7E3EE",
  primary: "#D2733A",
  primaryDark: "#8A4B1E",
  primarySoft: "#FDEBDD",
  accent: "#2F6FDE",
  success: "#3C9A5F",
  danger: "#C0392B",

  // Figma tokens for Coupons (KAN-15):
  badgeDiscountBg: "#E4F26B",
  badgeDiscountText: "#384705",
  priceHighlight: "#99AA18",
  couponBadgeOfficialBg: "#FBE7D8",
  couponBadgeOfficialText: "#8B4A21",
  couponBadgeValidityBg: "#E8E4F2",
  couponBadgeValidityText: "#3B3550",
  couponBadgeFreshBg: "#DFF2C8",
  couponBadgeFreshText: "#3F681C",
  couponSurfaceMuted: "#F3F0F9",
  couponCodeBg: "#E5E1F5",
  couponCodeText: "#2B2350",
  couponQrSurface: "#F1EEF8",
  couponQrTile: "#FFFFFF",
  couponQrModule: "#161B2E",
  activeFilterBg: "#161B2E",
  activeFilterText: "#FFFFFF",
  inactiveFilterBg: "#ECE8F5",
  inactiveFilterText: "#423E4D",
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 24,
} as const;
