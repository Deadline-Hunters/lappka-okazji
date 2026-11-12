import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { COUPON_FILTERS, type CouponFilter } from "../types";

type Props = {
  selected: CouponFilter;
  onSelect: (filter: CouponFilter) => void;
};

export function CouponsFilterPills({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {COUPON_FILTERS.map((item) => {
        const isActive = selected === item.id;

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={isActive ? "radio-button-on" : "radio-button-off"}
              size={15}
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
    paddingRight: spacing.lg,
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
    marginRight: 5,
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
