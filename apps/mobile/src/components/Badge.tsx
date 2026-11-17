import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { IconName } from "./icons";

// highlight - discounts ("-30%", "2 za 1"), accent - categories, primary - active status,
// muted - secondary info such as validity or an expired status.
export type BadgeTone = "highlight" | "accent" | "primary" | "muted";

type Props = {
  label: string;
  tone?: BadgeTone;
  size?: "sm" | "md";
  icon?: IconName;
  // Colored dot before the label, e.g. "● Aktywna".
  dot?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const TONES: Record<BadgeTone, { background: string; foreground: string }> = {
  highlight: { background: colors.highlight, foreground: colors.highlightText },
  accent: { background: colors.accentSoft, foreground: colors.accent },
  primary: { background: colors.primarySoft, foreground: colors.primaryDark },
  muted: { background: colors.surfaceMuted, foreground: colors.textMuted },
};

export function Badge({
  label,
  tone = "highlight",
  size = "sm",
  icon,
  dot = false,
  accessibilityLabel,
  style,
}: Props) {
  const palette = TONES[tone];
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.small : styles.medium,
        { backgroundColor: palette.background },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
    >
      {dot ? <View style={styles.dot} /> : null}
      {icon ? (
        <Ionicons
          name={icon}
          size={isSmall ? 12 : 13}
          color={palette.foreground}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          isSmall ? styles.labelSmall : styles.labelMedium,
          { color: palette.foreground },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderRadius: radius.pill,
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  label: {
    fontWeight: "800",
  },
  labelSmall: {
    fontSize: 11,
  },
  labelMedium: {
    fontSize: 12,
  },
});
