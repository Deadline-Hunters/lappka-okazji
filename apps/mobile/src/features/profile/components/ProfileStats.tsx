import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";

import type { ProfileStatsDto } from "../types";
import { ProfileStatItem } from "./ProfileStatItem";

interface Props {
  stats: ProfileStatsDto;
}

export function ProfileStats({ stats }: Props) {
  const lappsyDisplay =
    stats.lappsyBalance != null ? `${stats.lappsyBalance}` : "--";

  return (
    <View style={styles.container}>
      <ProfileStatItem
        iconName="add-circle-outline"
        iconColor="#E05326"
        value={stats.submissionsCount}
        label="Zgłoszenia"
      />
      <ProfileStatItem
        iconName="thumbs-up"
        iconColor="#2F6FDE"
        value={stats.confirmationsCount}
        label="Potwierdzeń"
      />
      <ProfileStatItem
        iconName="paw"
        iconColor="#D2733A"
        value={lappsyDisplay}
        label="ŁAPPsy"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    width: "100%",
  },
});
