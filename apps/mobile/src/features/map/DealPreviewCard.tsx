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

type Props = {
  deal: Deal;
  userLocation: LatLng | null;
  onClose: () => void;
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// Podgląd okazji po kliknięciu markera. Pełny bottom sheet z głosowaniem - KAN-18 / KAN-17.
export function DealPreviewCard({ deal, userLocation, onClose }: Props) {
  const category = CATEGORIES[deal.category];
  const discount = discountPercent(deal);
  const distance = userLocation
    ? formatDistance(distanceInMeters(userLocation, deal.location))
    : null;

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

      <Text style={styles.muted}>
        👍 {deal.confirmations} · 👎 {deal.denials}
      </Text>
    </View>
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
});
