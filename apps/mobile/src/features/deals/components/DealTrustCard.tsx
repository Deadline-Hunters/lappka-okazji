import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import type { Deal, DealVote } from "@/features/deals/types";
import { formatHunters } from "@/lib/format";
import { colors, radius, spacing } from "@/theme";

import { DealVoteButtons } from "./DealVoteButtons";

type Props = {
  deal: Deal;
  vote: DealVote | null;
  onVote: (vote: DealVote) => void;
};

function formatDenials(count: number) {
  if (count === 1) return "1 zgłoszenie braku";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} zgłoszenia braku`;
  }
  return `${count} zgłoszeń braku`;
}

function getTrustSummary(confirmations: number, denials: number) {
  const total = confirmations + denials;
  if (total === 0) {
    return {
      percentLabel: "--",
      headline: "Brak głosów",
      tone: "muted" as const,
      subline: "Nikt jeszcze nie potwierdził tej okazji",
    };
  }

  const percent = Math.round((confirmations / total) * 100);
  const headline =
    percent >= 80
      ? "Bardzo pewna"
      : percent >= 50
        ? "Raczej aktualna"
        : "Możliwe, że brakło";
  const tone = percent >= 50 ? ("primary" as const) : ("danger" as const);
  const confirmationsText =
    confirmations > 0
      ? `Potwierdzone przez ${formatHunters(confirmations)}`
      : "Brak potwierdzeń";
  const denialsText = denials > 0 ? ` • ${formatDenials(denials)}` : "";

  return {
    percentLabel: `${percent}%`,
    headline,
    tone,
    subline: `${confirmationsText}${denialsText}`,
  };
}

export function DealTrustCard({ deal, vote, onVote }: Props) {
  const confirmations = deal.confirmations + (vote === "up" ? 1 : 0);
  const denials = deal.denials + (vote === "down" ? 1 : 0);
  const summary = getTrustSummary(confirmations, denials);

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Ionicons
          name="shield-checkmark-outline"
          size={18}
          color={colors.primaryDark}
        />
        <Text style={styles.title}>Wiarygodność okazji</Text>
      </View>

      <View
        style={[
          styles.summaryBox,
          summary.tone === "muted" && styles.summaryBoxMuted,
        ]}
      >
        <View
          style={[
            styles.percentRing,
            summary.tone === "danger" && styles.percentRingDanger,
            summary.tone === "muted" && styles.percentRingMuted,
          ]}
        >
          <Text
            style={[
              styles.percentText,
              summary.tone === "danger" && styles.percentTextDanger,
              summary.tone === "muted" && styles.percentTextMuted,
            ]}
          >
            {summary.percentLabel}
          </Text>
        </View>

        <View style={styles.summaryText}>
          <Text
            style={[
              styles.headline,
              summary.tone === "danger" && styles.headlineDanger,
              summary.tone === "muted" && styles.headlineMuted,
            ]}
          >
            {summary.headline}
          </Text>
          <Text style={styles.subline}>{summary.subline}</Text>
        </View>

        <Ionicons
          name={
            summary.tone === "danger"
              ? "alert-circle-outline"
              : "thumbs-up-outline"
          }
          size={20}
          color={
            summary.tone === "danger"
              ? colors.danger
              : summary.tone === "muted"
                ? colors.textMuted
                : colors.primaryDark
          }
        />
      </View>

      <DealVoteButtons
        confirmations={confirmations}
        denials={denials}
        vote={vote}
        onVote={onVote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  summaryBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  summaryBoxMuted: {
    backgroundColor: colors.surfaceMuted,
  },
  percentRing: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  percentRingDanger: {
    borderColor: colors.danger,
  },
  percentRingMuted: {
    borderColor: colors.border,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  percentTextDanger: {
    color: colors.danger,
  },
  percentTextMuted: {
    color: colors.textMuted,
  },
  summaryText: {
    flex: 1,
    gap: 2,
  },
  headline: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  headlineDanger: {
    color: colors.danger,
  },
  headlineMuted: {
    color: colors.text,
  },
  subline: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
