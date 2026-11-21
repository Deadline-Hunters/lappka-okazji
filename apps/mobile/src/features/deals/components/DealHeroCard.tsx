import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { PriceTag } from "@/components/PriceTag";
import {
  CATEGORIES,
  discountPercent,
  isFresh,
  type Deal,
} from "@/features/deals/types";
import { formatTimeAgo } from "@/lib/format";
import { colors, radius, spacing } from "@/theme";

type Props = {
  deal: Deal;
  onCopyCode?: (code: string) => void;
};

function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatValidUntil(isoDate: string) {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const time = `${target.getHours()}:${String(target.getMinutes()).padStart(2, "0")}`;
  const today = new Date();

  if (isSameCalendarDay(target, today)) {
    return `Ważne do dzisiaj, ${time}`;
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameCalendarDay(target, tomorrow)) {
    return `Ważne do jutra, ${time}`;
  }

  const day = String(target.getDate()).padStart(2, "0");
  const month = String(target.getMonth() + 1).padStart(2, "0");
  return `Ważne do ${day}.${month}, ${time}`;
}

export function DealHeroCard({ deal, onCopyCode }: Props) {
  const category = CATEGORIES[deal.category] ?? CATEGORIES.inne;
  const discount = discountPercent(deal);
  const discountLabel = discount ? `-${discount}%` : (deal.badgeText ?? null);
  const fresh = isFresh(deal);
  const validityLabel = formatValidUntil(deal.validUntil);

  return (
    <View style={styles.section}>
      {/* Category header and freshness badge (replaces the photo area from the mockup) */}
      <View style={styles.topRow}>
        <View style={styles.categoryGroup}>
          <View style={styles.iconCircle}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          </View>
          <View style={styles.storeMeta}>
            <Text style={styles.storeName} numberOfLines={1}>
              {deal.storeName}
            </Text>
            <View style={styles.metaLine}>
              <Badge label={category.label} tone="accent" size="sm" />
              <Text style={styles.timeText} numberOfLines={1}>
                {formatTimeAgo(deal.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {fresh ? <Badge label="Świeża" tone="primary" size="md" dot /> : null}
      </View>

      <PriceTag
        price={deal.price}
        oldPrice={deal.oldPrice}
        discountLabel={discountLabel}
        size="lg"
        tone="primary"
      />

      <Text style={styles.title}>{deal.title}</Text>

      {deal.description ? (
        <Text style={styles.description}>{deal.description}</Text>
      ) : null}

      {deal.couponCode ? (
        <View style={styles.codeRow}>
          <View style={styles.codeValue}>
            <Ionicons name="barcode-outline" size={19} color={colors.text} />
            <Text style={styles.codeText} numberOfLines={1}>
              {deal.couponCode}
            </Text>
          </View>
          <Button
            label="Kopiuj"
            icon="copy-outline"
            size="sm"
            onPress={() => onCopyCode?.(deal.couponCode!)}
            accessibilityLabel={`Kopiuj kod ${deal.couponCode}`}
          />
        </View>
      ) : null}

      {validityLabel ? (
        <View style={styles.validityBanner}>
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.highlightText}
          />
          <Text style={styles.validityText}>{validityLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  categoryGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: {
    fontSize: 22,
  },
  storeMeta: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  storeName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  timeText: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  codeRow: {
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    paddingLeft: spacing.md,
    paddingRight: 5,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  codeValue: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  codeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: colors.text,
  },
  validityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.highlight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  validityText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.highlightText,
  },
});
