import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { PriceTag } from "@/components/PriceTag";
import { CATEGORIES, type Deal, type DealVote } from "@/features/deals/types";
import { formatHunters, formatTimeAgo } from "@/lib/format";
import { distanceInMeters, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

type Props = {
  deal: Deal;
  userLocation: LatLng | null;
  userVote?: DealVote | null;
  isBookmarked?: boolean;
  onBookmarkToggle?: (dealId: string) => void;
  onPress: (deal: Deal) => void;
};

export function DealCard({
  deal,
  userLocation,
  userVote = null,
  isBookmarked = false,
  onBookmarkToggle,
  onPress,
}: Props) {
  const category = CATEGORIES[deal.category] ?? CATEGORIES.inne;
  const confirmations = deal.confirmations + (userVote === "up" ? 1 : 0);
  const distance = userLocation
    ? formatDistance(distanceInMeters(userLocation, deal.location))
    : null;

  const handleCardPress = () => {
    onPress(deal);
  };

  return (
    <Pressable onPress={handleCardPress} accessibilityRole="button">
      <Card style={styles.card}>
        {/* Nagłówek: ikona kategorii + sklep/adres + dystans + czas dodania + tagi/rabat */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.storeNameText} numberOfLines={1}>
                {deal.storeName}
              </Text>
              <View style={styles.badgesWrapper}>
                <Badge label={category.label} tone="accent" />
                {deal.badgeText ? <Badge label={deal.badgeText} /> : null}
                <IconButton
                  icon={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size="sm"
                  color={isBookmarked ? colors.primary : colors.textMuted}
                  onPress={() => onBookmarkToggle?.(deal.id)}
                  accessibilityLabel={
                    isBookmarked
                      ? "Usuń z obserwowanych"
                      : "Dodaj do obserwowanych"
                  }
                  accessibilityState={{ selected: isBookmarked }}
                />
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

        {/* Aktualna i przekreślona stara cena */}
        <PriceTag price={deal.price} oldPrice={deal.oldPrice} size="md" />

        {/* Stopka: potwierdzenia społeczne + przycisk akcji */}
        <View style={styles.footer}>
          <View style={styles.confirmationsRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.confirmationsText}>
              Potwierdzone przez {formatHunters(confirmations)}
            </Text>
          </View>

          <Button
            label="Przejdź do okazji"
            variant="tonal"
            size="sm"
            onPress={handleCardPress}
          />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
    backgroundColor: colors.accentSoft,
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
});
