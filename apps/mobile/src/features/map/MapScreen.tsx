import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Linking, StyleSheet, Text, View } from "react-native";

import { useRequireAccount } from "@/lib/auth-session";
import { FilterChips } from "@/components/FilterChips";
import { FilterSheet } from "@/components/FilterSheet";
import { IconButton } from "@/components/IconButton";
import { SearchBar } from "@/components/SearchBar";
import {
  categoryFilterOptions,
  categoryFilterSuffix,
  matchesCategory,
  quickCategoryOptions,
  type CategoryFilter,
} from "@/features/deals/categories";
import { MOCK_DEALS } from "@/features/deals/mockDeals";
import { matchesDealSearch } from "@/features/deals/search";
import { useCategoryFilter } from "@/features/deals/useCategoryFilter";
import { CATEGORIES, discountPercent, isFresh } from "@/features/deals/types";
import { DEFAULT_CENTER, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import { DealPreviewCard } from "./DealPreviewCard";
import DealsMap from "./DealsMap";
import type { CameraTarget, MapMarker, Vote } from "./types";
import { useUserLocation } from "./useUserLocation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const USER_ZOOM = 16;
// Wait until the user stops typing before moving the camera to the search results.
const SEARCH_CAMERA_DELAY_MS = 500;

function emptyResultsMessage(query: string, category: CategoryFilter) {
  const inCategory = categoryFilterSuffix(category);
  return query
    ? `Brak okazji pasujących do „${query}”${inCategory}.`
    : `Brak okazji${inCategory}.`;
}

export function MapScreen() {
  const [camera, setCamera] = useState<CameraTarget | null>(null);
  const flyTo = useCallback((location: LatLng, zoom?: number) => {
    setCamera((previous) => ({
      ...location,
      zoom,
      id: (previous?.id ?? 0) + 1,
    }));
  }, []);
  const fitTo = useCallback((points: LatLng[]) => {
    const latitudes = points.map((point) => point.latitude);
    const longitudes = points.map((point) => point.longitude);
    const southWest = {
      latitude: Math.min(...latitudes),
      longitude: Math.min(...longitudes),
    };
    const northEast = {
      latitude: Math.max(...latitudes),
      longitude: Math.max(...longitudes),
    };
    setCamera((previous) => ({
      latitude: (southWest.latitude + northEast.latitude) / 2,
      longitude: (southWest.longitude + northEast.longitude) / 2,
      bounds: { southWest, northEast },
      id: (previous?.id ?? 0) + 1,
    }));
  }, []);
  const { location, status, refresh } = useUserLocation();
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { category, setCategory, isDefault, favorites, hasFavorites } =
    useCategoryFilter();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const requireAccount = useRequireAccount();
  const hasCenteredOnUser = useRef(false);

  const deals = MOCK_DEALS;
  const visibleDeals = useMemo(
    () =>
      deals.filter(
        (deal) =>
          matchesCategory(deal, category, favorites) &&
          matchesDealSearch(deal, query),
      ),
    [deals, query, category, favorites],
  );
  const categoryOptions = useMemo(
    () => quickCategoryOptions(deals, category, hasFavorites),
    [deals, category, hasFavorites],
  );
  // A deal hidden by the search or the category filter also closes its card.
  const selectedDeal =
    visibleDeals.find((deal) => deal.id === selectedDealId) ?? null;
  const trimmedQuery = query.trim();
  const isFiltering = trimmedQuery !== "" || category !== "all";
  // The default "Ulubione" filter doesn't move the camera; the map still starts on the user.
  const shouldFitResults =
    trimmedQuery !== "" || (category !== "all" && !isDefault);

  // Bring the results into view - they can be outside the visible part of the map.
  useEffect(() => {
    if (!shouldFitResults || visibleDeals.length === 0) return;

    const timer = setTimeout(() => {
      if (visibleDeals.length === 1) {
        flyTo(visibleDeals[0].location, USER_ZOOM);
      } else {
        fitTo(visibleDeals.map((deal) => deal.location));
      }
    }, SEARCH_CAMERA_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shouldFitResults, visibleDeals, flyTo, fitTo]);

  const markers = useMemo<MapMarker[]>(
    () =>
      visibleDeals.map((deal) => {
        const category = CATEGORIES[deal.category];
        const discount = discountPercent(deal);
        return {
          id: deal.id,
          latitude: deal.location.latitude,
          longitude: deal.location.longitude,
          emoji: category.emoji,
          color: category.color,
          label:
            deal.price === 0
              ? "Gratis"
              : discount
                ? `-${discount}%`
                : undefined,
          fresh: isFresh(deal),
        };
      }),
    [visibleDeals],
  );

  // Center the map on the user once their position is first known.
  useEffect(() => {
    if (location && !hasCenteredOnUser.current) {
      hasCenteredOnUser.current = true;
      flyTo(location, USER_ZOOM);
    }
  }, [location, flyTo]);

  // Callbacks passed to a DOM component must be async.
  const handleMarkerPress = useCallback(
    async (id: string) => {
      Keyboard.dismiss();
      setSelectedDealId(id);
      const deal = deals.find((item) => item.id === id);
      if (deal) flyTo(deal.location);
    },
    [deals, flyTo],
  );

  const handleMapPress = useCallback(async () => {
    Keyboard.dismiss();
    setSelectedDealId(null);
  }, []);

  const handleCategorySelect = useCallback(
    (next: CategoryFilter) => {
      Keyboard.dismiss();
      setCategory(next);
    },
    [setCategory],
  );

  const handleFiltersOpen = useCallback(() => {
    Keyboard.dismiss();
    setFiltersVisible(true);
  }, []);

  const handleOpenUrl = useCallback(async (url: string) => {
    await Linking.openURL(url);
  }, []);

  const handleRecenter = useCallback(async () => {
    // Jump to the known position right away, then refine when a fresh one arrives.
    flyTo(location ?? DEFAULT_CENTER, USER_ZOOM);
    const fresh = await refresh();
    if (fresh) {
      flyTo(fresh, USER_ZOOM);
    }
  }, [refresh, location, flyTo]);

  // One vote per deal: tapping the same button again takes the vote back.
  const handleVote = useCallback(
    (dealId: string, vote: Vote) => {
      if (!requireAccount()) {
        return;
      }
      setVotes((previous) => {
        const next = { ...previous };
        if (previous[dealId] === vote) {
          delete next[dealId];
        } else {
          next[dealId] = vote;
        }
        return next;
      });
    },
    [requireAccount],
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <DealsMap
          initialCenter={DEFAULT_CENTER}
          markers={markers}
          userLocation={location}
          selectedMarkerId={selectedDeal?.id ?? null}
          camera={camera}
          onMarkerPress={handleMarkerPress}
          onMapPress={handleMapPress}
          onOpenUrl={handleOpenUrl}
          dom={{ style: styles.map, scrollEnabled: false }}
        />

        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Szukaj okazji w okolicy (np. kawa)"
            accessibilityLabel="Szukaj okazji"
            onFilterPress={handleFiltersOpen}
            elevated
          />

          <FilterChips
            options={categoryOptions}
            selected={category}
            onSelect={handleCategorySelect}
            elevated
            style={styles.chips}
            contentContainerStyle={styles.chipsContent}
          />

          <View style={styles.overlayRow}>
            <View style={styles.notices}>
              {isFiltering && visibleDeals.length === 0 ? (
                <View style={styles.notice}>
                  <Text style={styles.noticeText}>
                    {emptyResultsMessage(trimmedQuery, category)}
                  </Text>
                </View>
              ) : null}
              {status === "denied" || status === "unavailable" ? (
                <View style={styles.notice}>
                  <Text style={styles.noticeText}>
                    {status === "denied"
                      ? "Brak zgody na lokalizację - pokazujemy centrum Krakowa."
                      : "Nie udało się ustalić lokalizacji - pokazujemy centrum Krakowa."}
                  </Text>
                </View>
              ) : null}
            </View>

            <IconButton
              icon="locate"
              variant="surface"
              size="lg"
              color={colors.accent}
              onPress={handleRecenter}
              accessibilityLabel="Wycentruj na mojej pozycji"
            />
          </View>
        </View>

        {selectedDeal ? (
          <View style={styles.preview}>
            <DealPreviewCard
              deal={selectedDeal}
              userLocation={location}
              vote={votes[selectedDeal.id] ?? null}
              onVote={(vote) => handleVote(selectedDeal.id, vote)}
              onClose={handleMapPress}
            />
          </View>
        ) : null}
      </View>
      <FilterSheet
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        title="Kategorie"
        options={categoryFilterOptions(hasFavorites)}
        selected={category}
        onSelect={handleCategorySelect}
      />
    </View>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapArea: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  // Lets touches through to the map everywhere except the search bar, notices and buttons.
  overlay: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
    pointerEvents: "box-none",
  },
  // Chips scroll edge to edge, past the overlay's side padding.
  chips: {
    flexGrow: 0,
    marginHorizontal: -spacing.lg,
  },
  chipsContent: {
    paddingHorizontal: spacing.lg,
  },
  overlayRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    pointerEvents: "box-none",
  },
  notices: {
    flex: 1,
    gap: spacing.sm,
    pointerEvents: "none",
  },
  notice: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    elevation: 3,
    ...shadow,
  },
  noticeText: {
    fontSize: 13,
    color: colors.text,
  },
  preview: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    // Above the OSM attribution bar - the tile policy forbids covering it.
    bottom: spacing.lg + 20,
  },
});
