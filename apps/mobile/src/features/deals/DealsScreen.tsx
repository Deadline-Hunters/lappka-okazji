import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { FilterChips } from "@/components/FilterChips";
import { SearchBar } from "@/components/SearchBar";
import { useUserLocation } from "@/features/map/useUserLocation";
import { DEFAULT_CENTER, distanceInMeters } from "@/lib/geo";
import { colors, spacing } from "@/theme";

import { DealCard } from "./components/DealCard";
import { DealsLocationBanner } from "./components/DealsLocationBanner";
import { MOCK_DEALS } from "./mockDeals";
import { matchesDealSearch } from "./search";
import { DEAL_SORT_OPTIONS, type Deal, type DealSortOption } from "./types";
import { useRequireAccount } from "@/lib/auth-session";

export function DealsScreen() {
  const requireAccount = useRequireAccount();
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
    // 1. Filtrowanie po tekście
    const result = deals.filter((deal) => matchesDealSearch(deal, searchQuery));

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
    if (!requireAccount()) {
      return;
    }
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

  return (
    <View style={styles.container}>
      {/* Wyszukiwarka i sortowanie na stałe u góry (pasek górny renderuje layout zakładek) */}
      <View style={styles.headerContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Szukaj okazji w okolicy (np. kawa, obiad, sł...)"
          onFilterPress={() => {
            Alert.alert(
              "Filtry",
              "Filtrowanie zaawansowane (kategorie, widełki cenowe) w przygotowaniu.",
            );
          }}
        />
        <FilterChips
          options={DEAL_SORT_OPTIONS}
          selected={sortBy}
          onSelect={setSortBy}
        />
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
              onPress={handleActionPress}
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
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Brak okazji"
            message={`Nie znaleziono ofert pasujących do „${searchQuery}”. Spróbuj użyć innych słów kluczowych lub zmienić filtry.`}
          />
        }
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <Button
          variant="primary"
          size="md"
          icon="add"
          label="Dodaj okazję"
          onPress={() => router.push("/add-deal")}
          style={styles.fabButton}
        />
      </View>
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
  fabContainer: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  fabButton: {
    borderRadius: 24,
  },
});
