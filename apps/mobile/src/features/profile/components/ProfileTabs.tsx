import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { ProfileTab } from "../types";

interface Props {
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
  submissionsCount?: number;
}

export function ProfileTabs({
  activeTab,
  onChangeTab,
  submissionsCount,
}: Props) {
  const submissionsLabel =
    submissionsCount != null
      ? `Moje zgłoszenia (${submissionsCount})`
      : "Moje zgłoszenia";

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.tab, activeTab === "submissions" && styles.tabActive]}
        onPress={() => onChangeTab("submissions")}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === "submissions" }}
        accessibilityLabel={submissionsLabel}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "submissions"
              ? styles.tabTextActive
              : styles.tabTextInactive,
          ]}
          numberOfLines={1}
        >
          {submissionsLabel}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.tab, activeTab === "radar" && styles.tabActive]}
        onPress={() => onChangeTab("radar")}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === "radar" }}
        accessibilityLabel="Ustawienia radaru"
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "radar"
              ? styles.tabTextActive
              : styles.tabTextInactive,
          ]}
          numberOfLines={1}
        >
          Ustawienia radaru
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ECEAF3",
    borderRadius: radius.md + 4,
    padding: 4,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  tabActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  tabTextInactive: {
    color: colors.textMuted,
    fontWeight: "600",
  },
});
