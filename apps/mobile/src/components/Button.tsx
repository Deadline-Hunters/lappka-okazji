import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ComponentProps<typeof Ionicons>["name"];
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  style,
  accessibilityLabel,
}: Props) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.sm : styles.md,
        isPrimary ? styles.primary : styles.secondary,
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={size === "sm" ? 15 : 17}
          color={isPrimary ? colors.textInverse : colors.text}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          size === "sm" ? styles.labelSm : styles.labelMd,
          isPrimary ? styles.labelPrimary : styles.labelSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  sm: {
    minHeight: 34,
  },
  md: {
    minHeight: 46,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginRight: 7,
  },
  label: {
    fontWeight: "800",
  },
  labelSm: {
    fontSize: 13,
  },
  labelMd: {
    fontSize: 14,
  },
  labelPrimary: {
    color: colors.textInverse,
  },
  labelSecondary: {
    color: colors.text,
  },
});
