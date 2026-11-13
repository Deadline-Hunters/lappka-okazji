import * as Clipboard from "expo-clipboard";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTopBar } from "@/components/AppTopBar";
import { Toast } from "@/components/Toast";
import { colors, spacing } from "@/theme";

import { CouponCard } from "./components/CouponCard";
import { CouponQrModal } from "./components/CouponQrModal";
import { CouponsFilterPills } from "./components/CouponsFilterPills";
import { CouponsSearchBar } from "./components/CouponsSearchBar";
import { MOCK_COUPONS } from "./mockCoupons";
import { isEndingSoon, type Coupon, type CouponFilter } from "./types";

type ToastState = {
  id: number;
  message: string;
};

export function CouponsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<CouponFilter>("all");
  const [qrCoupon, setQrCoupon] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const toastId = useRef(0);

  const showToast = useCallback((message: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, message });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const filteredCoupons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = MOCK_COUPONS;

    if (query) {
      result = result.filter((coupon) =>
        [
          coupon.brandName,
          coupon.title,
          coupon.description,
          coupon.categoryLabel,
          coupon.offerLabel,
          coupon.code,
          coupon.qrCode,
        ].some((value) => value?.toLowerCase().includes(query)),
      );
    }

    switch (filter) {
      case "ending_soon":
        return result.filter((coupon) => isEndingSoon(coupon));
      case "code":
        return result.filter((coupon) => Boolean(coupon.code));
      case "qr":
        return result.filter((coupon) => Boolean(coupon.qrCode));
      default:
        return result;
    }
  }, [searchQuery, filter]);

  const handleCopyCode = async (coupon: Coupon) => {
    if (!coupon.code) return;

    await Clipboard.setStringAsync(coupon.code, {
      android: { isSensitive: true },
    });
    showToast(`Skopiowano kod ${coupon.code}`);
  };

  const handleDetailsPress = (coupon: Coupon) => {
    Alert.alert(
      coupon.brandName,
      `${coupon.title}\n\n${coupon.description ?? coupon.categoryLabel}`,
      [{ text: "OK" }],
    );
  };

  const listHeader = (
    <View style={styles.header}>
      <AppTopBar
        subtitle="Kupony"
        onNotificationPress={() =>
          Alert.alert("Powiadomienia", "Brak nowych powiadomień.")
        }
        onProfilePress={() =>
          Alert.alert("Profil", "Przejdź do zakładki Profil na pasku dolnym.")
        }
      />

      <Text style={styles.sectionTitle}>Kupony Partnerskie</Text>

      <CouponsSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <CouponsFilterPills selected={filter} onSelect={setFilter} />
    </View>
  );

  const listEmpty = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Brak kuponów</Text>
      <Text style={styles.emptySubtitle}>
        Nie znaleziono kuponów dla wybranej frazy lub filtra. Spróbuj zmienić
        wyszukiwanie albo wybrać „Wszystkie”.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredCoupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CouponCard
            coupon={item}
            onCopyCode={handleCopyCode}
            onShowQr={setQrCoupon}
            onDetailsPress={handleDetailsPress}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />

      <Toast
        key={toast?.id ?? "toast"}
        message={toast?.message ?? null}
        onHide={hideToast}
      />

      <CouponQrModal coupon={qrCoupon} onClose={() => setQrCoupon(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    color: colors.text,
  },
  emptyContainer: {
    paddingVertical: spacing.xl * 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
});
