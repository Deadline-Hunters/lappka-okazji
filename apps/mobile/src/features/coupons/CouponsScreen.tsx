import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTopBar } from "@/components/AppTopBar";
import { colors, radius, spacing } from "@/theme";

import { CouponCard } from "./components/CouponCard";
import { CouponQrModal } from "./components/CouponQrModal";
import { CouponsFilterPills } from "./components/CouponsFilterPills";
import { CouponsSearchBar } from "./components/CouponsSearchBar";
import { MOCK_COUPONS } from "./mockCoupons";
import { isEndingSoon, type Coupon, type CouponFilter } from "./types";

const TOAST_DURATION_MS = 1800;

export function CouponsScreen() {
  const insets = useSafeAreaInsets();
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<CouponFilter>("all");
  const [qrCoupon, setQrCoupon] = useState<Coupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string) => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }

      setToastMessage(message);
      toastOpacity.stopAnimation();
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      toastTimer.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setToastMessage(null);
        });
      }, TOAST_DURATION_MS);
    },
    [toastOpacity],
  );

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const filteredCoupons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = coupons;

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
      case "activated":
        return result.filter((coupon) => coupon.isActivated);
      case "ending_soon":
        return result.filter((coupon) => isEndingSoon(coupon));
      case "code":
        return result.filter((coupon) => Boolean(coupon.code));
      case "qr":
        return result.filter((coupon) => Boolean(coupon.qrCode));
      default:
        return result;
    }
  }, [coupons, searchQuery, filter]);

  const handleCopyCode = async (coupon: Coupon) => {
    if (!coupon.code) return;

    await Clipboard.setStringAsync(coupon.code, {
      android: { isSensitive: true },
    });
    showToast(`Skopiowano kod ${coupon.code}`);
  };

  const handleActivate = (coupon: Coupon) => {
    setCoupons((current) =>
      current.map((item) =>
        item.id === coupon.id
          ? { ...item, isActivated: true, action: undefined }
          : item,
      ),
    );
    Alert.alert(
      coupon.brandName,
      "Zniżka została aktywowana. Pokaż ten ekran lub ważną legitymację studencką przy kasie.",
      [{ text: "OK" }],
    );
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
            onActivate={handleActivate}
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

      {toastMessage ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.toast, { opacity: toastOpacity }]}
        >
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={colors.textInverse}
          />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

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
    paddingBottom: spacing.xxl * 2,
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
    paddingVertical: spacing.xxl * 2,
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
  toast: {
    position: "absolute",
    bottom: spacing.xl,
    alignSelf: "center",
    maxWidth: "90%",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.neutralDark,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textInverse,
  },
});
