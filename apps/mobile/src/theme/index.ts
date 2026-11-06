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
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;
