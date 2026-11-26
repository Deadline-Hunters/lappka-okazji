import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Toast } from "@/components/Toast";
import { useUserLocation } from "@/features/map/useUserLocation";
import { useRequireAccount } from "@/lib/auth-session";
import { formatPrice } from "@/lib/format";
import { colors, spacing } from "@/theme";

import { DealHeroCard } from "./components/DealHeroCard";
import { DealLocationCard } from "./components/DealLocationCard";
import { DealTrustCard } from "./components/DealTrustCard";
import { useDealsInteraction } from "./deals-interaction";
import { MOCK_DEALS } from "./mockDeals";
import type { DealVote } from "./types";

type ToastState = {
  id: number;
  message: string;
};

export function DealDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const dealId = Array.isArray(id) ? id[0] : id;

  const deal = useMemo(
    () => MOCK_DEALS.find((item) => item.id === dealId) ?? null,
    [dealId],
  );

  const { location: userLocation } = useUserLocation();
  const requireAccount = useRequireAccount();
  const {
    votes,
    isBookmarked: checkBookmarked,
    toggleBookmark,
    toggleVote,
  } = useDealsInteraction();

  const isBookmarked = deal ? checkBookmarked(deal.id) : false;
  const vote = deal ? (votes[deal.id] ?? null) : null;
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastId = useRef(0);

  const showToast = useCallback((message: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, message });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/deals");
    }
  }, []);

  const handleBookmarkToggle = useCallback(() => {
    if (!deal || !requireAccount()) return;

    const nextBookmarked = !isBookmarked;
    toggleBookmark(deal.id);
    showToast(nextBookmarked ? "Zapisano okazję" : "Usunięto z zapisanych");
  }, [deal, isBookmarked, requireAccount, toggleBookmark, showToast]);

  const handleShare = useCallback(async () => {
    if (!deal) return;

    const priceText = deal.price > 0 ? formatPrice(deal.price) : "Gratis";
    try {
      await Share.share({
        message: `${deal.title} (${priceText}) w ${deal.storeName}, ${deal.address} – znalezione w Łappce Okazji!`,
      });
    } catch {
      // User dismissed or sharing is unavailable on this device.
    }
  }, [deal]);

  const handleCopyCode = useCallback(
    async (code: string) => {
      await Clipboard.setStringAsync(code);
      showToast(`Skopiowano kod ${code}`);
    },
    [showToast],
  );

  const handleVote = useCallback(
    (nextVote: DealVote) => {
      if (!deal || !requireAccount()) return;

      const isClearing = vote === nextVote;
      toggleVote(deal.id, nextVote);
      if (!isClearing) {
        showToast(
          nextVote === "up"
            ? "Dziękujemy za potwierdzenie!"
            : "Zgłoszono brak okazji",
        );
      }
    },
    [deal, vote, requireAccount, toggleVote, showToast],
  );

  const handleShowOnMap = useCallback(() => {
    if (!deal) return;

    router.navigate({
      pathname: "/(tabs)",
      params: {
        dealId: deal.id,
        focusNonce: String(Date.now()),
      },
    });
  }, [deal]);

  const handleNavigate = useCallback(async () => {
    if (!deal) return;

    const { latitude, longitude } = deal.location;
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Nie udało się otworzyć map",
        "Sprawdź, czy masz zainstalowaną aplikację z mapami lub przeglądarkę.",
      );
    }
  }, [deal]);

  const handleReport = useCallback(() => {
    Alert.alert(
      "Zgłoś ofertę",
      "Zgłaszanie nieprawidłowych lub wygasłych ofert będzie dostępne po podłączeniu bazy danych.",
      [{ text: "OK" }],
    );
  }, []);

  if (!deal) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScreenHeader
          title="Szczegóły okazji"
          onBack={handleBack}
          style={styles.header}
        />
        <EmptyState
          icon="alert-circle-outline"
          tone="danger"
          title="Nie znaleziono okazji"
          message="Ta okazja mogła wygasnąć lub zostać usunięta."
          action={{ label: "Wróć do okazji", onPress: handleBack }}
          fill
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader
        title="Szczegóły okazji"
        onBack={handleBack}
        right={
          <View style={styles.headerActions}>
            <IconButton
              icon={isBookmarked ? "bookmark" : "bookmark-outline"}
              color={isBookmarked ? colors.primary : colors.text}
              onPress={handleBookmarkToggle}
              accessibilityLabel={
                isBookmarked ? "Usuń z zapisanych" : "Zapisz okazję"
              }
              accessibilityState={{ selected: isBookmarked }}
            />
            <IconButton
              icon="share-outline"
              onPress={handleShare}
              accessibilityLabel="Udostępnij okazję"
            />
          </View>
        }
        style={styles.header}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card elevation="md" style={styles.mainCard}>
          <DealHeroCard deal={deal} onCopyCode={handleCopyCode} />

          <View style={styles.divider} />

          <DealTrustCard deal={deal} vote={vote} onVote={handleVote} />

          <View style={styles.divider} />

          <DealLocationCard
            deal={deal}
            userLocation={userLocation}
            onShowOnMap={handleShowOnMap}
            onNavigate={handleNavigate}
          />
        </Card>

        <Pressable
          onPress={handleReport}
          style={({ pressed }) => [
            styles.reportButton,
            pressed && styles.reportPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Zgłoś ofertę"
        >
          <Ionicons name="flag-outline" size={16} color={colors.textMuted} />
          <Text style={styles.reportText}>Zgłoś ofertę</Text>
        </Pressable>
      </ScrollView>

      <Toast
        key={toast?.id ?? "toast"}
        message={toast?.message ?? null}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  mainCard: {
    gap: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  reportButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs + 2,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
  },
  reportPressed: {
    opacity: 0.7,
  },
  reportText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
