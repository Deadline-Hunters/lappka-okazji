import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing } from "@/theme";

import type { SubmissionStatus } from "../types";

interface Props {
  status: SubmissionStatus;
  confirmationsCount: number;
}

export function SubmissionStatusBadge({ status, confirmationsCount }: Props) {
  const isActive = status === "active";

  return (
    <View
      style={[
        styles.badge,
        isActive ? styles.badgeActive : styles.badgeExpired,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${isActive ? "Aktywna" : "Wygasła"}, ${confirmationsCount} potwierdzeń`}
    >
      {isActive ? (
        <View style={styles.dotActive} />
      ) : (
        <Ionicons
          name="refresh-outline"
          size={13}
          color="#72658A"
          style={styles.iconExpired}
        />
      )}
      <Text
        style={[styles.text, isActive ? styles.textActive : styles.textExpired]}
      >
        {isActive ? "Aktywna" : "Wygasła"} (+{confirmationsCount} 👍)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: spacing.xs + 2,
  },
  badgeActive: {
    backgroundColor: "#FFF1EB",
  },
  badgeExpired: {
    backgroundColor: "#F0EEF8",
  },
  dotActive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#E05326",
  },
  iconExpired: {
    marginRight: -1,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  textActive: {
    color: "#A0471D",
  },
  textExpired: {
    color: "#72658A",
  },
});
