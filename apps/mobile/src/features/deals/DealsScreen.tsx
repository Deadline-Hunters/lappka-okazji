import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useUserLocation } from "@/features/map/useUserLocation";
import { DEFAULT_CENTER, distanceInMeters } from "@/lib/geo";
import { colors, spacing } from "@/theme";

import { DealCard } from "./components/DealCard";
import { DealsLocationBanner } from "./components/DealsLocationBanner";
import { DealsSearchBar } from "./components/DealsSearchBar";
import { DealsSortPills } from "./components/DealsSortPills";
import { DealsTopBar } from "./components/DealsTopBar";
import { MOCK_DEALS } from "./mockDeals";
import type { Deal, DealSortOption } from "./types";

const normalizeString = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z");
};

export function DealsScreen() {
  const insets = useSafeAreaInsets();
  const { location, refresh } = useUserLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<DealSortOption>("closest");
  const [refreshing, setRefreshing] = useState(false);
  const [deals] = useState<Deal[]>(MOCK_DEALS);
  const [bookmarkedDealIds, setBookmarkedDealIds] = useState<Set<string>>(
    new Set(),
  );

  const referenceLocation = location ?? DEFAULT_CENTER;

  // Filtrowanie i sortowanie ofert
  const filteredAndSortedDeals = useMemo(() => {
    let result = deals;

    // 1. Filtrowanie po tekście
    if (searchQuery.trim()) {
      const q = normalizeString(searchQuery.trim());
      result = result.filter(
        (deal) =>
          normalizeString(deal.title).includes(q) ||
          normalizeString(deal.storeName).includes(q) ||
          normalizeString(deal.address).includes(q) ||
          normalizeString(deal.description || "").includes(q) ||
          normalizeString(deal.category).includes(q),
      );
    }

    // 2. Sortowanie
    return [...result].sort((a, b) => {
      if (sortBy === "closest") {
        const distA = distanceInMeters(referenceLocation, a.location);
        const distB = distanceInMeters(referenceLocation, b.location);
        return distA - distB;
      }

      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (sortBy === "biggest_discount") {
        const getDiscount = (deal: Deal) => {
          if (deal.oldPrice && deal.oldPrice > deal.price) {
            return (deal.oldPrice - deal.price) / deal.oldPrice;
          }
          return 0;
        };

        return getDiscount(b) - getDiscount(a);
      }

      if (sortBy === "bookmarked") {
        const isA = bookmarkedDealIds.has(a.id) ? 1 : 0;
        const isB = bookmarkedDealIds.has(b.id) ? 1 : 0;
        return isB - isA;
      }

      return 0;
    });
  }, [deals, searchQuery, sortBy, referenceLocation, bookmarkedDealIds]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleBookmarkToggle = (dealId: string) => {
    setBookmarkedDealIds((prev) => {
      const next = new Set(prev);
      if (next.has(dealId)) {
        next.delete(dealId);
      } else {
        next.add(dealId);
      }
      return next;
    });
  };

  const handleActionPress = (deal: Deal) => {
    if (deal.couponCode) {
      Alert.alert(
        "Kod rabatowy",
        `Twój kod rabatowy do ${deal.storeName}:\n\n${deal.couponCode}\n\nOkaż go sprzedawcy przy płatności.`,
        [{ text: "Super, dzięki!" }],
      );
    } else {
      Alert.alert("Okazja", `Otwarto szczegóły oferty: ${deal.title}`);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Brak okazji</Text>
      <Text style={styles.emptySubtitle}>
        Nie znaleziono ofert pasujących do „{searchQuery}”. Spróbuj użyć innych
        słów kluczowych lub zmienić filtry.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Pasek górny, wyszukiwarka i filtry na stałe u góry */}
      <View style={styles.headerContainer}>
        <DealsTopBar
          onNotificationPress={() =>
            Alert.alert("Powiadomienia", "Brak nowych powiadomień.")
          }
          onProfilePress={() =>
            Alert.alert("Profil", "Przejdź do zakładki Profil na pasku dolnym.")
          }
        />
        <DealsSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => {
            Alert.alert(
              "Filtry",
              "Filtrowanie zaawansowane (kategorie, widełki cenowe) w przygotowaniu.",
            );
          }}
        />
        <DealsSortPills selected={sortBy} onSelect={setSortBy} />
      </View>

      {/* Przewijalna lista kafelków */}
      <FlatList
        data={filteredAndSortedDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <DealCard
              deal={item}
              userLocation={location}
              isBookmarked={bookmarkedDealIds.has(item.id)}
              onBookmarkToggle={handleBookmarkToggle}
              onActionPress={handleActionPress}
              onPress={() => handleActionPress(item)}
            />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.bannerWrapper}>
            <DealsLocationBanner
              city=""
              radiusMeters={500}
              dealsCount={filteredAndSortedDeals.length}
            />
          </View>
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  bannerWrapper: {
    paddingBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  cardWrapper: {
    marginBottom: spacing.xs,
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
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
