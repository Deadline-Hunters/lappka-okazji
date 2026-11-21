import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { PriceTag } from "@/components/PriceTag";
import { DealVoteButtons } from "@/features/deals/components/DealVoteButtons";
import { CATEGORIES, discountPercent, type Deal } from "@/features/deals/types";
import { formatHunters, formatTimeAgo } from "@/lib/format";
import { distanceInMeters, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import type { Vote } from "./types";

type Props = {
  deal: Deal;
  userLocation: LatLng | null;
  vote: Vote | null;
  onVote: (vote: Vote) => void;
  onClose: () => void;
  onPress: () => void;
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// Deal preview shown after tapping a marker. Full bottom sheet - KAN-18, saving votes - KAN-17.
export function DealPreviewCard({
  deal,
  userLocation,
  vote,
  onVote,
  onClose,
  onPress,
}: Props) {
  const category = CATEGORIES[deal.category];
  const discount = discountPercent(deal);
  const distance = userLocation
    ? formatDistance(distanceInMeters(userLocation, deal.location))
    : null;
  // The user's own vote is added on top of the counts from the data.
  const confirmations = deal.confirmations + (vote === "up" ? 1 : 0);
  const denials = deal.denials + (vote === "down" ? 1 : 0);

  return (
    <Card elevation="lg" bordered={false} style={styles.card}>
      <View style={styles.header}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.headerPressable,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Zobacz szczegóły okazji: ${deal.title}`}
        >
          <View
            style={[styles.categoryIcon, { backgroundColor: category.color }]}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.store} numberOfLines={1}>
              {deal.storeName} ·{" "}
              <Text style={styles.muted}>{deal.address}</Text>
            </Text>
            <Text style={styles.muted}>
              {distance ? `${distance} od Ciebie · ` : ""}Ważne do{" "}
              {formatTime(deal.validUntil)}
            </Text>
          </View>
        </Pressable>
        <IconButton
          icon="close"
          size="sm"
          color={colors.textMuted}
          onPress={onClose}
          accessibilityLabel="Zamknij"
        />
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.bodyPressable,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Zobacz szczegóły okazji: ${deal.title}`}
      >
        <Text style={styles.title}>{deal.title}</Text>
        {deal.description ? (
          <Text style={styles.muted}>{deal.description}</Text>
        ) : null}

        <PriceTag
          price={deal.price}
          oldPrice={deal.oldPrice}
          discountLabel={discount ? `-${discount}%` : null}
          size="lg"
          tone="primary"
        />

        <View style={styles.trustRow}>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>
            {confirmations > 0
              ? `Potwierdzone przez ${formatHunters(confirmations)}`
              : "Nikt jeszcze nie potwierdził"}
          </Text>
          <Text style={styles.muted}>{formatTimeAgo(deal.createdAt)}</Text>
        </View>
      </Pressable>

      <DealVoteButtons
        confirmations={confirmations}
        denials={denials}
        vote={vote}
        onVote={onVote}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  bodyPressable: {
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  headerText: {
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: {
    fontSize: 20,
  },
  store: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  muted: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  trustDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  trustText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
});
