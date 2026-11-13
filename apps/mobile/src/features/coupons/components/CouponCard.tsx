import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { colors, radius, spacing } from "@/theme";

import { formatPrice, type Coupon } from "../types";

type Props = {
  coupon: Coupon;
  onCopyCode?: (coupon: Coupon) => void;
  onShowQr?: (coupon: Coupon) => void;
  onActivate?: (coupon: Coupon) => void;
  onDetailsPress?: (coupon: Coupon) => void;
};

function formatValidity(validUntil?: string) {
  if (!validUntil) return null;

  const date = new Date(validUntil);
  if (Number.isNaN(date.getTime())) return null;

  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `Ważne do ${day}.${month}`;
}

export function CouponCard({
  coupon,
  onCopyCode,
  onShowQr,
  onActivate,
  onDetailsPress,
}: Props) {
  const validityLabel = formatValidity(coupon.validUntil);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.logo,
            { backgroundColor: coupon.brandLogoBackground ?? colors.border },
          ]}
        >
          {coupon.brandLogoUrl ? (
            <Image
              source={{ uri: coupon.brandLogoUrl }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.logoLetter}>{coupon.brandName.charAt(0)}</Text>
          )}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.brandTopRow}>
            <Text style={styles.brandName}>{coupon.brandName}</Text>
            {validityLabel ? (
              <View style={styles.validityPill}>
                <Text style={styles.validityPillText}>{validityLabel}</Text>
              </View>
            ) : null}
          </View>

          {coupon.isActivated ? (
            <View style={styles.activatedPill}>
              <Text style={styles.activatedPillText}>Aktywowany</Text>
              <Ionicons
                name="checkmark-circle"
                size={11}
                color={colors.successText}
                style={styles.badgeIcon}
              />
            </View>
          ) : null}

          <Text style={styles.categoryLabel}>{coupon.categoryLabel}</Text>
        </View>
      </View>

      <Text style={styles.title}>{coupon.title}</Text>

      {coupon.offerLabel ||
      coupon.price != null ||
      coupon.oldPrice != null ||
      coupon.discountLabel ? (
        <View style={styles.priceRow}>
          {coupon.offerLabel ? (
            <View style={styles.offerPill}>
              <Text style={styles.offerPillText}>{coupon.offerLabel}</Text>
            </View>
          ) : null}
          {coupon.price != null ? (
            <Text style={styles.currentPrice}>{formatPrice(coupon.price)}</Text>
          ) : null}
          {coupon.oldPrice != null ? (
            <Text style={styles.oldPrice}>{formatPrice(coupon.oldPrice)}</Text>
          ) : null}
          {coupon.discountLabel ? (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>
                {coupon.discountLabel}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {coupon.description ? (
        <Text style={styles.description}>{coupon.description}</Text>
      ) : null}

      {coupon.code ? (
        <View style={styles.codeRow}>
          <View style={styles.codeValue}>
            <Ionicons name="barcode-outline" size={19} color={colors.text} />
            <Text style={styles.codeText} numberOfLines={1}>
              {coupon.code}
            </Text>
          </View>
          <Button
            label="Kopiuj"
            icon="copy-outline"
            size="sm"
            onPress={() => onCopyCode?.(coupon)}
            accessibilityLabel="Kopiuj kod"
          />
        </View>
      ) : null}

      {coupon.qrCode ? (
        <Button
          label="Pokaż kod QR"
          icon="qr-code-outline"
          variant="secondary"
          onPress={() => onShowQr?.(coupon)}
          style={styles.cardButton}
        />
      ) : null}

      {coupon.action && !coupon.isActivated ? (
        <Button
          label={coupon.action.label}
          icon={coupon.action.icon}
          onPress={() => onActivate?.(coupon)}
          style={styles.cardButton}
        />
      ) : null}

      <Button
        label="Szczegóły oferty"
        icon="information-circle-outline"
        variant="secondary"
        onPress={() => onDetailsPress?.(coupon)}
        style={styles.cardButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  logoLetter: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textMuted,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  brandTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
  },
  brandName: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.2,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
    lineHeight: 16,
  },
  validityPill: {
    maxWidth: 165,
    flexShrink: 0,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  validityPillText: {
    fontSize: 10.5,
    fontWeight: "700",
    lineHeight: 13,
    color: colors.textMuted,
  },
  activatedPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  activatedPillText: {
    fontSize: 10.5,
    fontWeight: "700",
    lineHeight: 13,
    color: colors.successText,
  },
  badgeIcon: {
    marginLeft: 3,
  },
  title: {
    marginTop: spacing.md,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  offerPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  offerPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.price,
  },
  oldPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  discountPill: {
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  discountPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.highlightText,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  codeRow: {
    marginTop: spacing.lg,
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
  cardButton: {
    marginTop: spacing.md,
  },
});
