import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  CATEGORIES,
  discountPercent,
  formatPrice,
  formatTimeAgo,
  type Deal,
} from "@/features/deals/types";
import { distanceInMeters, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

type Props = {
  deal: Deal;
  userLocation: LatLng | null;
  onPress?: () => void;
  onBookmarkToggle?: (dealId: string) => void;
  onActionPress?: (deal: Deal) => void;
};

export function DealCard({
  deal,
  userLocation,
  onPress,
  onBookmarkToggle,
  onActionPress,
}: Props) {
  const [bookmarked, setBookmarked] = useState(deal.isBookmarked ?? false);
  const category = CATEGORIES[deal.category] ?? CATEGORIES.inne;
  const discount = discountPercent(deal);
  const distance = userLocation
    ? formatDistance(distanceInMeters(userLocation, deal.location))
    : null;

  const handleBookmarkPress = () => {
    setBookmarked((prev) => !prev);
    onBookmarkToggle?.(deal.id);
  };

  const handleCardPress = () => {
    if (onActionPress) {
      onActionPress(deal);
    } else if (onPress) {
      onPress();
    }
  };

  const badgeText = deal.badgeText ?? (discount ? `-${discount}%` : undefined);
  const buttonText = deal.actionLabel ?? "Przejdź do okazji";

  return (
    <Pressable
      style={styles.card}
      onPress={handleCardPress}
      accessibilityRole="button"
    >
      <View style={styles.cardContainer}>
        {/* Nagłówek: ikona kategorii + sklep/adres + dystans + czas dodania + tagi/rabat */}
        <View style={styles.header}>
          <View
            style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.storeNameText} numberOfLines={1}>
                {deal.storeName}
              </Text>
              <View style={styles.badgesWrapper}>
                {deal.tag ? (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{deal.tag}</Text>
                  </View>
                ) : null}
                {badgeText ? (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{badgeText}</Text>
                  </View>
                ) : null}
                <Pressable
                  onPress={handleBookmarkPress}
                  hitSlop={8}
                  style={styles.bookmarkButton}
                  accessibilityLabel={
                    bookmarked
                      ? "Usuń z obserwowanych"
                      : "Dodaj do obserwowanych"
                  }
                >
                  <Ionicons
                    name={bookmarked ? "bookmark" : "bookmark-outline"}
                    size={18}
                    color={bookmarked ? colors.primary : colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            <Text style={styles.metaSubText} numberOfLines={1}>
              {deal.address}
              {distance ? ` • ${distance}` : ""}
              {` • ${formatTimeAgo(deal.createdAt)}`}
            </Text>
          </View>
        </View>

        {/* Tylko tytuł okazji */}
        <Text style={styles.titleText}>{deal.title}</Text>

        {/* Tylko aktualna i przekreślona stara cena (bez nawiasów i dopisków) */}
        {deal.price > 0 ? (
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(deal.price)}</Text>
            {deal.oldPrice ? (
              <Text style={styles.oldPrice}>{formatPrice(deal.oldPrice)}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Stopka: potwierdzenia społeczne + przycisk akcji */}
        <View style={styles.footer}>
          <View style={styles.confirmationsRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.confirmationsText}>
              Potwierdzone przez {deal.confirmations} łowców
            </Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{buttonText}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  storeNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    flexShrink: 1,
  },
  badgesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexShrink: 0,
  },
  tagBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
  },
  discountBadge: {
    backgroundColor: colors.badgeDiscountBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  discountBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.badgeDiscountText,
  },
  bookmarkButton: {
    paddingLeft: 2,
  },
  metaSubText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.sm,
    marginTop: 2,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.priceHighlight,
  },
  oldPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  confirmationsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  confirmationsText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  actionButton: {
    backgroundColor: colors.actionButtonBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.actionButtonText,
  },
});
