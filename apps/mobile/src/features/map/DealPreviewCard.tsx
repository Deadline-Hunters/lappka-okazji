import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  CATEGORIES,
  discountPercent,
  formatPrice,
  type Deal,
} from "@/features/deals/types";
import { distanceInMeters, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import { formatHunters, formatTimeAgo } from "./format";
import type { Vote } from "./types";

// Soft red for the "Już brakło" button - not a theme token yet.
const DANGER_SOFT = "#FBE4E1";

type Props = {
  deal: Deal;
  userLocation: LatLng | null;
  vote: Vote | null;
  onVote: (vote: Vote) => void;
  onClose: () => void;
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
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[styles.categoryIcon, { backgroundColor: category.color }]}
        >
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.store} numberOfLines={1}>
            {deal.storeName} · <Text style={styles.muted}>{deal.address}</Text>
          </Text>
          <Text style={styles.muted}>
            {distance ? `${distance} od Ciebie · ` : ""}Ważne do{" "}
            {formatTime(deal.validUntil)}
          </Text>
        </View>
        <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Zamknij">
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      <Text style={styles.title}>{deal.title}</Text>
      {deal.description ? (
        <Text style={styles.muted}>{deal.description}</Text>
      ) : null}

      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {deal.price > 0 ? formatPrice(deal.price) : "Gratis"}
        </Text>
        {deal.oldPrice ? (
          <Text style={styles.oldPrice}>{formatPrice(deal.oldPrice)}</Text>
        ) : null}
        {discount ? (
          <View style={styles.discount}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.trustRow}>
        <View style={styles.trustDot} />
        <Text style={styles.trustText}>
          {confirmations > 0
            ? `Potwierdzone przez ${formatHunters(confirmations)}`
            : "Nikt jeszcze nie potwierdził"}
        </Text>
        <Text style={styles.muted}>{formatTimeAgo(deal.createdAt)}</Text>
      </View>

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
    </View>
  );
}

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

function VoteButton({
  kind,
  label,
  count,
  active,
  onPress,
}: {
  kind: Vote;
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
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
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  oldPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  discount: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDark,
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
