import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { DealVote } from "@/features/deals/types";
import { colors, radius, spacing } from "@/theme";

// Soft red for the "Już brakło" button - matches DealPreviewCard until a theme token exists.
const DANGER_SOFT = "#FBE4E1";

const VOTE_STYLES = {
  up: {
    icon: "thumbs-up",
    background: colors.primarySoft,
    activeBackground: colors.primary,
    color: colors.primaryDark,
  },
  down: {
    icon: "thumbs-down",
    background: DANGER_SOFT,
    activeBackground: colors.danger,
    color: colors.danger,
  },
} as const;

type Props = {
  confirmations: number;
  denials: number;
  vote: DealVote | null;
  onVote: (vote: DealVote) => void;
};

export function DealVoteButtons({
  confirmations,
  denials,
  vote,
  onVote,
}: Props) {
  return (
    <View style={styles.voteRow}>
      <VoteButton
        kind="up"
        label="Nadal jest!"
        count={confirmations}
        active={vote === "up"}
        onPress={() => onVote("up")}
      />
      <VoteButton
        kind="down"
        label="Już brakło"
        count={denials}
        active={vote === "down"}
        onPress={() => onVote("down")}
      />
    </View>
  );
}

function VoteButton({
  kind,
  label,
  count,
  active,
  onPress,
}: {
  kind: DealVote;
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  const variant = VOTE_STYLES[kind];
  const color = active ? colors.surface : variant.color;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.voteButton,
        {
          backgroundColor: active
            ? variant.activeBackground
            : variant.background,
        },
        pressed && styles.votePressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label} (${count})`}
    >
      <Ionicons
        name={active ? variant.icon : `${variant.icon}-outline`}
        size={18}
        color={color}
      />
      <Text style={[styles.voteLabel, { color }]}>{label}</Text>
      <View
        style={[
          styles.voteCount,
          active && { backgroundColor: "rgba(255, 255, 255, 0.25)" },
        ]}
      >
        <Text style={[styles.voteCountText, { color }]}>{count}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  voteRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  voteButton: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.pill,
  },
  votePressed: {
    opacity: 0.8,
  },
  voteLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  voteCount: {
    minWidth: 22,
    marginLeft: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    alignItems: "center",
  },
  voteCountText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
