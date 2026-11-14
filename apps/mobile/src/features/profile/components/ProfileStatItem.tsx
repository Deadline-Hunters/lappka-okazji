import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface Props {
  iconName: IconName;
  iconColor: string;
  value: string | number;
  label: string;
}

export function ProfileStatItem({ iconName, iconColor, value, label }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Ionicons name={iconName} size={18} color={iconColor} />
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0F8",
    borderRadius: radius.md + 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
  },
});
