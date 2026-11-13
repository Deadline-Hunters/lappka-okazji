// Basic tokens based on the Figma mockups. To be extended in KAN-11.
export const colors = {
  background: "#F7F5FB",
  surface: "#FFFFFF",
  surfaceMuted: "#ECE8F5",
  text: "#1E1B24",
  textMuted: "#6B6573",
  textInverse: "#FFFFFF",
  border: "#E7E3EE",
  primary: "#D2733A",
  primaryDark: "#8A4B1E",
  primarySoft: "#FDEBDD",
  accent: "#2F6FDE",
  success: "#3C9A5F",
  // Soft green background for positive status badges.
  successSoft: "#DFF2C8",
  // Green text and icons shown on successSoft.
  successText: "#3F681C",
  danger: "#C0392B",
  // Attention-grabbing background for highlight badges such as discounts.
  highlight: "#E4F26B",
  // Text shown on the highlight background.
  highlightText: "#384705",
  // Emphasis color for the current price.
  price: "#99AA18",
  // High-contrast dark used for selected pills, toasts, and QR modules.
  neutralDark: "#161B2E",
  // Translucent layer behind modals.
  backdrop: "rgba(22, 17, 28, 0.55)",
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
