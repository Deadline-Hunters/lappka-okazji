import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { FilterChips } from "@/components/FilterChips";
import { SearchBar } from "@/components/SearchBar";
import { Toast } from "@/components/Toast";
import { matchesQuery } from "@/lib/search";
import { colors, spacing } from "@/theme";

import { CouponCard } from "./components/CouponCard";
import { CouponQrModal } from "./components/CouponQrModal";
import { fetchCoupons } from "./mockCoupons";
import {
  COUPON_FILTERS,
  isEndingSoon,
  type Coupon,
  type CouponFilter,
} from "./types";

const BACKGROUND_REFRESH_DELAY_MS = 5 * 60 * 1000;

type ToastState = {
  id: number;
  message: string;
};

export function CouponsScreen() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<CouponFilter>("all");
  const [qrCoupon, setQrCoupon] = useState<Coupon | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const toastId = useRef(0);
  const backgroundedAt = useRef<number | null>(null);

  const loadCoupons = useCallback(async () => {
    const nextCoupons = await fetchCoupons();
    setCoupons(nextCoupons);
  }, []);

  useEffect(() => {
    loadCoupons().finally(() => setIsLoading(false));
  }, [loadCoupons]);

  // Refresh stale data when the app has been in the background for a while.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") {
        backgroundedAt.current ??= Date.now();
        return;
      }

      const leftAt = backgroundedAt.current;
      backgroundedAt.current = null;

      if (
        leftAt !== null &&
        Date.now() - leftAt >= BACKGROUND_REFRESH_DELAY_MS
      ) {
        loadCoupons();
      }
    });

    return () => subscription.remove();
  }, [loadCoupons]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadCoupons();
    } finally {
      setRefreshing(false);
    }
  }, [loadCoupons]);

  const showToast = useCallback((message: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, message });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const filteredCoupons = useMemo(
    () =>
      coupons.filter((coupon) => {
        const matchesSearch = matchesQuery(
          [
            coupon.brandName,
            coupon.title,
            coupon.description,
            coupon.categoryLabel,
            coupon.discountLabel,
            coupon.code,
            coupon.qrCode,
          ],
          searchQuery,
        );
        if (!matchesSearch) {
          return false;
        }

        switch (filter) {
          case "ending_soon":
            return isEndingSoon(coupon);
          case "code":
            return Boolean(coupon.code);
          case "qr":
            return Boolean(coupon.qrCode);
          default:
            return true;
        }
      }),
    [coupons, searchQuery, filter],
  );

  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    showToast(`Skopiowano kod ${code}`);
  };

  const handleShowQr = (coupon: Coupon) => {
    setQrCoupon(coupon);
    setQrVisible(true);
  };

  const handleDetailsPress = (coupon: Coupon) => {
    Alert.alert(
      coupon.brandName,
      `${coupon.title}\n\n${coupon.description ?? coupon.categoryLabel}`,
      [{ text: "OK" }],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Szukaj kuponów (np. kawa, kino, KFC)"
        />

        <FilterChips
          options={COUPON_FILTERS}
          selected={filter}
          onSelect={setFilter}
          contentContainerStyle={styles.chips}
        />
      </View>

      <FlatList
        data={filteredCoupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CouponCard
            coupon={item}
            onCopyCode={handleCopyCode}
            onShowQr={handleShowQr}
            onDetailsPress={handleDetailsPress}
          />
        )}
        ListEmptyComponent={
          isLoading ? undefined : (
            <EmptyState
              icon="ticket-outline"
              title="Brak kuponów"
              message="Nie znaleziono kuponów dla wybranej frazy lub filtra. Spróbuj zmienić wyszukiwanie albo wybrać „Wszystkie”."
            />
          )
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />

      <Toast
        key={toast?.id ?? "toast"}
        message={toast?.message ?? null}
        onHide={hideToast}
      />

      {qrCoupon ? (
        <CouponQrModal
          coupon={qrCoupon}
          visible={qrVisible}
          onClose={() => setQrVisible(false)}
        />
      ) : null}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  chips: {
    paddingRight: spacing.lg,
  },
});
