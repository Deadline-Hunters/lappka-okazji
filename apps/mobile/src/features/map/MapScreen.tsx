import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_DEALS } from "@/features/deals/mockDeals";
import { CATEGORIES, discountPercent, isFresh } from "@/features/deals/types";
import { DEFAULT_CENTER, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import { DealPreviewCard } from "./DealPreviewCard";
import DealsMap from "./DealsMap";
import { MapHeader } from "./MapHeader";
import { MapSearchBar } from "./MapSearchBar";
import { matchesSearch } from "./search";
import type { CameraTarget, MapMarker, Vote } from "./types";
import { useUserLocation } from "./useUserLocation";

const USER_ZOOM = 16;
// Wait until the user stops typing before moving the camera to the search results.
const SEARCH_CAMERA_DELAY_MS = 500;

export function MapScreen() {
  const insets = useSafeAreaInsets();
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
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const hasCenteredOnUser = useRef(false);

  const deals = MOCK_DEALS;
  const visibleDeals = useMemo(
    () => deals.filter((deal) => matchesSearch(deal, query)),
    [deals, query],
  );
  // A deal hidden by the search also closes its card.
  const selectedDeal =
    visibleDeals.find((deal) => deal.id === selectedDealId) ?? null;
  const trimmedQuery = query.trim();

  // Bring the search results into view - they can be outside the visible part of the map.
  useEffect(() => {
    if (!trimmedQuery || visibleDeals.length === 0) return;

    const timer = setTimeout(() => {
      if (visibleDeals.length === 1) {
        flyTo(visibleDeals[0].location, USER_ZOOM);
      } else {
        fitTo(visibleDeals.map((deal) => deal.location));
      }
    }, SEARCH_CAMERA_DELAY_MS);
    return () => clearTimeout(timer);
  }, [trimmedQuery, visibleDeals, flyTo, fitTo]);

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
  const handleVote = useCallback((dealId: string, vote: Vote) => {
    setVotes((previous) => {
      const next = { ...previous };
      if (previous[dealId] === vote) {
        delete next[dealId];
      } else {
        next[dealId] = vote;
      }
      return next;
    });
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapHeader />

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

        <View style={styles.overlay}>
          <MapSearchBar value={query} onChangeText={setQuery} />

          <View style={styles.overlayRow}>
            <View style={styles.notices}>
              {trimmedQuery && visibleDeals.length === 0 ? (
                <View style={styles.notice}>
                  <Text style={styles.noticeText}>
                    Brak okazji pasujących do „{trimmedQuery}”.
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

            <Pressable
              style={styles.controlButton}
              onPress={handleRecenter}
              accessibilityRole="button"
              accessibilityLabel="Wycentruj na mojej pozycji"
            >
              <Ionicons name="locate" size={22} color={colors.accent} />
            </Pressable>
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
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    ...shadow,
  },
  preview: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    // Above the OSM attribution bar - the tile policy forbids covering it.
    bottom: spacing.lg + 20,
  },
});
