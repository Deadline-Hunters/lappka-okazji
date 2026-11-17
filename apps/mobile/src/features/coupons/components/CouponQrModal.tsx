import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { colors, radius, spacing } from "@/theme";

import type { Coupon } from "../types";
import { CouponQrCode } from "./CouponQrCode";

type Props = {
  coupon: Coupon;
  visible: boolean;
  onClose: () => void;
};

export function CouponQrModal({ coupon, visible, onClose }: Props) {
  const qrCode = coupon.qrCode;

  if (!qrCode) {
    throw new Error("CouponQrModal requires a coupon with a QR code");
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Zamknij kod QR"
        />

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.brandName}>{coupon.brandName}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {coupon.title}
              </Text>
            </View>
            <IconButton
              icon="close"
              variant="muted"
              size="sm"
              color={colors.textMuted}
              onPress={onClose}
              accessibilityLabel="Zamknij"
            />
          </View>

          <View style={styles.qrWrapper}>
            <CouponQrCode value={qrCode} size={224} />
          </View>

          <Text style={styles.caption}>Pokaż ten kod przy kasie</Text>

          <Button label="Gotowe" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textMuted,
  },
  qrWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  caption: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
});
