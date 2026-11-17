import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { formatPrice } from "@/lib/format";
import { colors, spacing } from "@/theme";

import { Badge } from "./Badge";

type Props = {
  // A price of 0 is shown as "Gratis". Leave it out when the offer has no price (e.g. a "-30%" coupon).
  price?: number | null;
  // Regular price, shown struck through.
  oldPrice?: number | null;
  // Discount badge such as "-30%" or "2 za 1".
  discountLabel?: string | null;
  size?: "sm" | "md" | "lg";
  // Color of the current price: highlight (lists), primary (map preview), default (plain text).
  tone?: "highlight" | "primary" | "default";
  style?: StyleProp<ViewStyle>;
};

const PRICE_SIZES = { sm: 16, md: 20, lg: 22 } as const;
const OLD_PRICE_SIZES = { sm: 13, md: 14, lg: 14 } as const;
const PRICE_COLORS = {
  highlight: colors.price,
  primary: colors.primary,
  default: colors.text,
} as const;

// Price stack: current price, old price and a discount badge in one row.
export function PriceTag({
  price,
  oldPrice,
  discountLabel,
  size = "md",
  tone = "highlight",
  style,
}: Props) {
  const hasPrice = price != null;
  const hasOldPrice = oldPrice != null && oldPrice > 0;

  if (!hasPrice && !hasOldPrice && !discountLabel) {
    return null;
  }

  return (
    <View style={[styles.row, style]}>
      {hasPrice ? (
        <Text
          style={[
            styles.price,
            { fontSize: PRICE_SIZES[size], color: PRICE_COLORS[tone] },
          ]}
        >
          {price > 0 ? formatPrice(price) : "Gratis"}
        </Text>
      ) : null}
      {hasOldPrice ? (
        <Text style={[styles.oldPrice, { fontSize: OLD_PRICE_SIZES[size] }]}>
          {formatPrice(oldPrice)}
        </Text>
      ) : null}
      {discountLabel ? (
        <Badge label={discountLabel} tone="highlight" size="md" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    flexShrink: 1,
  },
  price: {
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  oldPrice: {
    fontWeight: "600",
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
});
