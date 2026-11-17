import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { IconName } from "./icons";

export type SegmentOption<T extends string> = {
  id: T;
  label: string;
  icon?: IconName;
};

type Props<T extends string> = {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (id: T) => void;
  // surface - white segment on a muted track (profile tabs),
  // primary - orange pill segment (login / register switch).
  tone?: "surface" | "primary";
  style?: StyleProp<ViewStyle>;
};

// Equal-width segments, one selected at a time.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  tone = "surface",
  style,
}: Props<T>) {
  const isPrimary = tone === "primary";

  return (
    <View
      style={[styles.track, isPrimary ? styles.trackPrimary : null, style]}
      accessibilityRole="tablist"
    >
      {options.map((option) => {
        const selected = option.id === value;
        const foreground = selected
          ? isPrimary
            ? colors.textInverse
            : colors.text
          : colors.textMuted;

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[
              styles.segment,
              isPrimary ? styles.segmentPrimary : null,
              selected
                ? isPrimary
                  ? styles.selectedPrimary
                  : styles.selectedSurface
                : null,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
          >
            {option.icon ? (
              <Ionicons name={option.icon} size={18} color={foreground} />
            ) : null}
            <Text
              style={[
                styles.label,
                selected ? styles.labelSelected : null,
                { color: foreground },
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: spacing.xs,
    borderRadius: radius.md + 4,
    backgroundColor: colors.surfaceMuted,
  },
  trackPrimary: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceContainerLow,
  },
  segment: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  segmentPrimary: {
    borderRadius: radius.pill,
  },
  selectedSurface: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedPrimary: {
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  labelSelected: {
    fontWeight: "700",
  },
});
