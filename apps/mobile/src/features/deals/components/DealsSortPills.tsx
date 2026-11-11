import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { DealSortOption } from "@/features/deals/types";
import { colors, radius, spacing } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

type SortItem = {
  id: DealSortOption;
  label: string;
  icon: IconName;
};

const SORT_OPTIONS: SortItem[] = [
  { id: "closest", label: "Najbliżej", icon: "navigate" },
  { id: "newest", label: "Najnowsze", icon: "flash" },
  { id: "biggest_discount", label: "Największe rabaty", icon: "flame" },
];

type Props = {
  selected: DealSortOption;
  onSelect: (option: DealSortOption) => void;
};

export function DealsSortPills({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SORT_OPTIONS.map((item) => {
        const isActive = selected === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={item.icon}
              size={16}
              color={
                isActive ? colors.activeFilterText : colors.inactiveFilterText
              }
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  pillActive: {
    backgroundColor: colors.activeFilterBg,
  },
  pillInactive: {
    backgroundColor: colors.inactiveFilterBg,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  labelActive: {
    color: colors.activeFilterText,
  },
  labelInactive: {
    color: colors.inactiveFilterText,
  },
});
