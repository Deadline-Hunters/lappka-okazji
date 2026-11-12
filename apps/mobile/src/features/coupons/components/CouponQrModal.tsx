import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { Coupon } from "../types";
import { CouponQrCode } from "./CouponQrCode";

type Props = {
  coupon: Coupon | null;
  onClose: () => void;
};

export function CouponQrModal({ coupon, onClose }: Props) {
  return (
    <Modal
      visible={coupon !== null}
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

        {coupon ? (
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.brandName}>{coupon.brandName}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {coupon.title}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                style={styles.closeIcon}
                accessibilityRole="button"
                accessibilityLabel="Zamknij"
              >
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.qrWrapper}>
              <CouponQrCode value={coupon.qrCode ?? coupon.id} size={224} />
            </View>

            <Text style={styles.caption}>Pokaż ten kod przy kasie</Text>

            <Pressable
              onPress={onClose}
              style={styles.doneButton}
              accessibilityRole="button"
            >
              <Text style={styles.doneButtonText}>Gotowe</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(22, 17, 28, 0.55)",
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
  closeIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.couponSurfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  qrWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.couponQrSurface,
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
  doneButton: {
    minHeight: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
