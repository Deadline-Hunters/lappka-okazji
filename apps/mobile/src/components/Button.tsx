import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { IconName } from "./icons";

export type ButtonVariant =
  "primary" | "secondary" | "tonal" | "surface" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  // "end" puts the icon after the label, e.g. the arrow in "Zaloguj się →".
  iconPosition?: "start" | "end";
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const VARIANTS: Record<
  ButtonVariant,
  { background: string; foreground: string; border?: string }
> = {
  primary: { background: colors.primary, foreground: colors.textInverse },
  secondary: { background: colors.surfaceMuted, foreground: colors.text },
  tonal: {
    background: colors.actionButtonBg,
    foreground: colors.actionButtonText,
  },
  surface: {
    background: colors.surface,
    foreground: colors.text,
    border: colors.border,
  },
  dark: { background: colors.inverseSurface, foreground: colors.textInverse },
};

const SIZES = {
  sm: { minHeight: 34, paddingHorizontal: spacing.md, fontSize: 13, icon: 15 },
  md: { minHeight: 46, paddingHorizontal: spacing.lg, fontSize: 14, icon: 17 },
  lg: { minHeight: 52, paddingHorizontal: spacing.xl, fontSize: 17, icon: 20 },
} as const;

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: Props) {
  const palette = VARIANTS[variant];
  const metrics = SIZES[size];
  const isDisabled = disabled || loading;

  const iconElement = icon ? (
    <Ionicons name={icon} size={metrics.icon} color={palette.foreground} />
  ) : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: metrics.minHeight,
          paddingHorizontal: metrics.paddingHorizontal,
          backgroundColor: palette.background,
        },
        palette.border ? { borderWidth: 1, borderColor: palette.border } : null,
        pressed && !isDisabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.foreground} />
      ) : (
        <>
          {iconPosition === "start" ? iconElement : null}
          <Text
            style={[
              styles.label,
              { fontSize: metrics.fontSize, color: palette.foreground },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {iconPosition === "end" ? iconElement : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.pill,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: "800",
  },
});
