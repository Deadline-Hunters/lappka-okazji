// Design tokens based on the Figma mockups. Shared UI components live in `@/components`.

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
  accentSoft: "#E8F0FE",
  success: "#3C9A5F",
  danger: "#C0392B",
  // Attention-grabbing background for highlight badges such as discounts.
  highlight: "#E4F26B",
  // Text shown on the highlight background.
  highlightText: "#384705",
  // Emphasis color for the current price.
  price: "#99AA18",
  // High-contrast dark used for selected chips, toasts, and QR modules.
  neutralDark: "#161B2E",
  // Translucent layer behind modals.
  backdrop: "rgba(22, 17, 28, 0.55)",
  secondaryContainer: "#E1E684",
  secondaryText: "#474A00",
  surfaceContainer: "#EAEDFF",
  surfaceContainerLow: "#F2F3FF",
  inverseSurface: "#283044",
  outline: "#8C7164",

  // Text of an unselected filter chip.
  inactiveFilterText: "#423E4D",
  locationBannerBg: "#FDF0E6",
  locationBannerBorder: "#F9DEC9",
  // Soft orange "tonal" button, e.g. "Przejdź do okazji".
  actionButtonBg: "#FEDBC7",
  actionButtonText: "#7A3511",
} as const;

export const radius = {
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
} as const;

// Elevation presets: `sm` for inputs and chips, `md` for list cards, `lg` for cards floating over the map.
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
} as const;
