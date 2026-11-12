import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import {
  formatPrice,
  type Coupon,
  type CouponBadge,
  type CouponBadgeVariant,
} from "../types";

type Props = {
  coupon: Coupon;
  onCopyCode?: (coupon: Coupon) => void;
  onShowQr?: (coupon: Coupon) => void;
  onActivate?: (coupon: Coupon) => void;
  onDetailsPress?: (coupon: Coupon) => void;
};

const BADGE_COLORS: Record<
  CouponBadgeVariant,
  { background: string; text: string }
> = {
  official: {
    background: colors.couponBadgeOfficialBg,
    text: colors.couponBadgeOfficialText,
  },
  validity: {
    background: colors.couponBadgeValidityBg,
    text: colors.couponBadgeValidityText,
  },
  fresh: {
    background: colors.couponBadgeFreshBg,
    text: colors.couponBadgeFreshText,
  },
};

const ACTIVATED_BADGE: CouponBadge = {
  label: "Aktywowany",
  variant: "fresh",
  icon: "checkmark-circle",
};

function CouponBadgePill({ badge }: { badge: CouponBadge }) {
  const palette = BADGE_COLORS[badge.variant];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text style={[styles.badgeText, { color: palette.text }]}>
        {badge.label}
      </Text>
      {badge.icon ? (
        <Ionicons
          name={badge.icon}
          size={11}
          color={palette.text}
          style={styles.badgeIcon}
        />
      ) : null}
    </View>
  );
}

export function CouponCard({
  coupon,
  onCopyCode,
  onShowQr,
  onActivate,
  onDetailsPress,
}: Props) {
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
            {coupon.topBadge ? (
              <View style={styles.topBadge}>
                <CouponBadgePill badge={coupon.topBadge} />
              </View>
            ) : null}
          </View>

          {coupon.partnerBadge || coupon.isActivated ? (
            <View style={styles.badgesRow}>
              {coupon.partnerBadge ? (
                <CouponBadgePill badge={coupon.partnerBadge} />
              ) : null}
              {coupon.isActivated ? (
                <CouponBadgePill badge={ACTIVATED_BADGE} />
              ) : null}
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
            <Ionicons
              name="barcode-outline"
              size={19}
              color={colors.couponCodeText}
            />
            <Text style={styles.codeText} numberOfLines={1}>
              {coupon.code}
            </Text>
          </View>
          <Pressable
            onPress={() => onCopyCode?.(coupon)}
            style={styles.copyButton}
            accessibilityRole="button"
            accessibilityLabel="Kopiuj kod"
          >
            <Ionicons name="copy-outline" size={15} color="#FFFFFF" />
            <Text style={styles.copyButtonText}>Kopiuj</Text>
          </Pressable>
        </View>
      ) : null}

      {coupon.qrCode ? (
        <Pressable
          onPress={() => onShowQr?.(coupon)}
          style={styles.qrButton}
          accessibilityRole="button"
        >
          <Ionicons
            name="qr-code-outline"
            size={18}
            color={colors.couponCodeText}
            style={styles.buttonIcon}
          />
          <Text style={styles.qrButtonText}>Pokaż kod QR</Text>
        </Pressable>
      ) : null}

      {coupon.action && !coupon.isActivated ? (
        <Pressable
          onPress={() => onActivate?.(coupon)}
          style={styles.actionButton}
          accessibilityRole="button"
        >
          {coupon.action.icon ? (
            <Ionicons
              name={coupon.action.icon}
              size={17}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          ) : null}
          <Text style={styles.actionButtonText}>{coupon.action.label}</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={() => onDetailsPress?.(coupon)}
        style={styles.detailsButton}
        accessibilityRole="button"
        hitSlop={6}
      >
        <Ionicons
          name="information-circle-outline"
          size={15}
          color={colors.textMuted}
        />
        <Text style={styles.detailsButtonText}>Szczegóły oferty</Text>
      </Pressable>
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
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
  topBadge: {
    maxWidth: 165,
    flexShrink: 0,
    alignItems: "flex-end",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: "700",
    lineHeight: 13,
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
    color: colors.priceHighlight,
  },
  oldPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  discountPill: {
    backgroundColor: colors.badgeDiscountBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  discountPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.badgeDiscountText,
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
    backgroundColor: colors.couponCodeBg,
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
    color: colors.couponCodeText,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  qrButton: {
    marginTop: spacing.md,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.couponCodeBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  qrButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.couponCodeText,
  },
  actionButton: {
    marginTop: spacing.md,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  buttonIcon: {
    marginRight: 7,
  },
  detailsButton: {
    marginTop: spacing.md,
    minHeight: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.couponSurfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
});
