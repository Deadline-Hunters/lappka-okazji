import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { IconName } from "./icons";

export type ChipOption<T extends string> = {
  id: T;
  label: string;
  icon?: IconName;
  // Shown before the label instead of an icon, e.g. category emoji "🍔 Jedzenie".
  emoji?: string;
};

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  emoji?: string;
  style?: StyleProp<ViewStyle>;
};

// Single selectable pill. Use it directly for wrapping layouts (e.g. a category picker in a form).
export function Chip({
  label,
  selected,
  onPress,
  icon,
  emoji,
  style,
}: ChipProps) {
  const foreground = selected ? colors.textInverse : colors.inactiveFilterText;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed ? styles.pressed : null,
        style,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      {icon && !emoji ? (
        <Ionicons name={icon} size={16} color={foreground} />
      ) : null}
      <Text style={[styles.label, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

type Props<T extends string> = {
  options: readonly ChipOption<T>[];
  selected: T;
  onSelect: (id: T) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

// Horizontally scrolling single-select row of chips (sorting, filters).
export function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
  contentContainerStyle,
}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.row, contentContainerStyle]}
      accessibilityRole="radiogroup"
    >
      {options.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          icon={option.icon}
          emoji={option.emoji}
          selected={option.id === selected}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  chipSelected: {
    backgroundColor: colors.neutralDark,
  },
  chipIdle: {
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.8,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});
