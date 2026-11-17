import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import type { AccessibilityState, StyleProp, ViewStyle } from "react-native";

import { colors, radius, shadows } from "@/theme";

import type { IconName } from "./icons";

// plain - icon only (header bell, bookmark), muted - soft grey circle (modal close),
// surface - white floating circle (map controls).
export type IconButtonVariant = "plain" | "muted" | "surface";

type Props = {
  icon: IconName;
  // Required: an icon has no visible text, so screen readers need a label.
  accessibilityLabel: string;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: "sm" | "md" | "lg";
  color?: string;
  // Small dot in the corner, e.g. unread notifications.
  showDot?: boolean;
  disabled?: boolean;
  accessibilityState?: AccessibilityState;
  style?: StyleProp<ViewStyle>;
};

const SIZES = {
  sm: { box: 32, icon: 20 },
  md: { box: 36, icon: 22 },
  lg: { box: 44, icon: 22 },
} as const;

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = "plain",
  size = "md",
  color = colors.text,
  showDot = false,
  disabled = false,
  accessibilityState,
  style,
}: Props) {
  const metrics = SIZES[size];
  // Keeps the touch target at least 44 px even for the smaller sizes.
  const hitSlop = Math.max(0, Math.ceil((44 - metrics.box) / 2));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, ...accessibilityState }}
      style={({ pressed }) => [
        styles.base,
        { width: metrics.box, height: metrics.box },
        variant === "muted" ? styles.muted : null,
        variant === "surface" ? styles.surface : null,
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Ionicons name={icon} size={metrics.icon} color={color} />
      {showDot ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  surface: {
    backgroundColor: colors.surface,
    ...shadows.lg,
    shadowOpacity: 0.12,
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.highlight,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
