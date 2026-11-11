import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

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

  const badgeText = deal.badgeText ?? (discount ? `-${discount}%` : undefined);

  // Wariant B: Karta usługowa / kuponowa (brak zdjęcia)
  if (!deal.imageUrl) {
    return (
      <Pressable
        style={styles.card}
        onPress={onPress}
        accessibilityRole="button"
      >
        <View style={styles.couponContainer}>
          <View style={styles.couponHeader}>
            <View
              style={[
                styles.couponIconCircle,
                { backgroundColor: colors.accentSoft },
              ]}
            >
              <Text style={styles.couponEmoji}>{category.emoji}</Text>
            </View>
            <View style={styles.couponHeaderText}>
              <View style={styles.couponTitleRow}>
                <Text style={styles.storeNameText} numberOfLines={1}>
                  {deal.storeName}
                </Text>
                <View style={styles.tagRow}>
                  {deal.tag ? (
                    <View style={styles.studentBadge}>
                      <Text style={styles.studentBadgeText}>{deal.tag}</Text>
                    </View>
                  ) : null}
                  {badgeText ? (
                    <View style={styles.discountBadgeSmall}>
                      <Text style={styles.discountBadgeText}>{badgeText}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Text style={styles.couponSubText} numberOfLines={1}>
                {deal.address}
                {distance ? ` • ${distance}` : ""}
                {" • "}Ważne do piątku
              </Text>
            </View>
          </View>

          <Text style={styles.titleText}>{deal.title}</Text>

          {deal.description ? (
            <Text style={styles.descriptionText} numberOfLines={3}>
              {deal.description}
            </Text>
          ) : null}

          <View style={styles.couponFooter}>
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
            <Pressable
              style={styles.actionButton}
              onPress={() => onActionPress?.(deal)}
              accessibilityRole="button"
            >
              <Text style={styles.actionButtonText}>
                {deal.actionLabel ?? "Odbierz rabat"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  // Wariant A: Karta ze zdjęciem (produkt / oferta w lokalu)
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      {/* Zdjęcie z nakładkami */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: deal.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Górne odznaki na zdjęciu */}
        <View style={styles.imageTopOverlay}>
          <View style={styles.badgesRow}>
            {badgeText ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{badgeText}</Text>
              </View>
            ) : null}

            {deal.activeFromLabel ? (
              <View style={styles.timeBadge}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={colors.text}
                  style={styles.timeIcon}
                />
                <Text style={styles.timeBadgeText}>{deal.activeFromLabel}</Text>
              </View>
            ) : (
              <View style={styles.timeBadge}>
                <View style={styles.timeDot} />
                <Text style={styles.timeBadgeText}>
                  {formatTimeAgo(deal.createdAt)}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={handleBookmarkPress}
            style={styles.bookmarkButton}
            hitSlop={8}
            accessibilityLabel={
              bookmarked ? "Usuń z obserwowanych" : "Dodaj do obserwowanych"
            }
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={bookmarked ? colors.primary : colors.text}
            />
          </Pressable>
        </View>

        {/* Dolny pasek z ciemnym tłem na zdjęciu */}
        <View style={styles.imageBottomOverlay}>
          <View style={styles.storeInfoRow}>
            <Text style={styles.storeEmoji}>{category.emoji}</Text>
            <Text style={styles.storeOnImageText} numberOfLines={1}>
              {deal.storeName} • {deal.address}
            </Text>
          </View>
          {distance ? (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}>{distance}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Ciało karty */}
      <View style={styles.cardBody}>
        <Text style={styles.titleText}>{deal.title}</Text>

        {/* Rząd cen */}
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
            {deal.price > 0 ? formatPrice(deal.price) : "Gratis"}
          </Text>
          {deal.oldPrice ? (
            <Text style={styles.oldPrice}>{formatPrice(deal.oldPrice)}</Text>
          ) : null}
          {deal.priceDetail ? (
            <Text style={styles.priceDetail} numberOfLines={1}>
              {deal.priceDetail}
            </Text>
          ) : null}
        </View>

        {/* Weryfikacja społeczna */}
        <View style={styles.confirmationsRow}>
          <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          <Text style={styles.confirmationsText}>
            Potwierdzone przez {deal.confirmations} łowców
          </Text>
        </View>

        {deal.subscribersCount ? (
          <Text style={styles.subscribersText}>
            Powiadomienie włączone dla {deal.subscribersCount} sąsiadów
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Style dla wariantu ze zdjęciem
  imageContainer: {
    height: 165,
    width: "100%",
    position: "relative",
    backgroundColor: "#E2DFE8",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageTopOverlay: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexShrink: 1,
  },
  discountBadge: {
    backgroundColor: colors.badgeDiscountBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.badgeDiscountText,
  },
  timeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
  },
  timeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  timeIcon: {
    marginRight: 4,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  bookmarkButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageBottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(22, 17, 12, 0.68)",
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.sm,
  },
  storeEmoji: {
    fontSize: 13,
  },
  storeOnImageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  distanceBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  distanceBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  // Style dla zawartości karty
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs,
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
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: 2,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.priceHighlight,
  },
  oldPrice: {
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  priceDetail: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
  confirmationsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  confirmationsText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  subscribersText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Style dla wariantu B (Kupon / Usługi)
  couponContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  couponHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  couponIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  couponEmoji: {
    fontSize: 22,
  },
  couponHeaderText: {
    flex: 1,
  },
  couponTitleRow: {
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
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexShrink: 0,
  },
  studentBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  studentBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
  },
  discountBadgeSmall: {
    backgroundColor: colors.badgeDiscountBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  couponSubText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  couponFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xs,
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
