import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { MOCK_DEALS } from "@/features/deals/mockDeals";
import { CATEGORIES, discountPercent, isFresh } from "@/features/deals/types";
import { DEFAULT_CENTER, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import { DealPreviewCard } from "./DealPreviewCard";
import DealsMap from "./DealsMap";
import type { CameraTarget, MapMarker } from "./types";
import { useUserLocation } from "./useUserLocation";

const USER_ZOOM = 16;

export function MapScreen() {
  const [camera, setCamera] = useState<CameraTarget | null>(null);
  const flyTo = useCallback((location: LatLng, zoom?: number) => {
    setCamera((previous) => ({
      ...location,
      zoom,
      id: (previous?.id ?? 0) + 1,
    }));
  }, []);
  const { location, status, refresh } = useUserLocation();
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const hasCenteredOnUser = useRef(false);

  const deals = MOCK_DEALS;
  const selectedDeal = deals.find((deal) => deal.id === selectedDealId) ?? null;

  const markers = useMemo<MapMarker[]>(
    () =>
      deals.map((deal) => {
        const category = CATEGORIES[deal.category];
        const discount = discountPercent(deal);
        return {
          id: deal.id,
          latitude: deal.location.latitude,
          longitude: deal.location.longitude,
          emoji: category.emoji,
          color: category.color,
          label: discount ? `-${discount}%` : undefined,
          fresh: isFresh(deal),
        };
      }),
    [deals],
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
      setSelectedDealId(id);
      const deal = deals.find((item) => item.id === id);
      if (deal) flyTo(deal.location);
    },
    [deals, flyTo],
  );

  const handleMapPress = useCallback(async () => setSelectedDealId(null), []);

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

  return (
    <View style={styles.container}>
      <DealsMap
        initialCenter={DEFAULT_CENTER}
        markers={markers}
        userLocation={location}
        selectedMarkerId={selectedDealId}
        camera={camera}
        onMarkerPress={handleMarkerPress}
        onMapPress={handleMapPress}
        onOpenUrl={handleOpenUrl}
        dom={{ style: styles.map, scrollEnabled: false }}
      />

      {status === "denied" || status === "unavailable" ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {status === "denied"
              ? "Brak zgody na lokalizację - pokazujemy centrum Krakowa."
              : "Nie udało się ustalić lokalizacji - pokazujemy centrum Krakowa."}
          </Text>
        </View>
      ) : null}

      <View style={styles.controls}>
        <Pressable
          style={styles.controlButton}
          onPress={handleRecenter}
          accessibilityRole="button"
          accessibilityLabel="Wycentruj na mojej pozycji"
        >
          <Ionicons name="locate" size={22} color={colors.accent} />
        </Pressable>
      </View>

      {selectedDeal ? (
        <View style={styles.preview}>
          <DealPreviewCard
            deal={selectedDeal}
            userLocation={location}
            onClose={handleMapPress}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  banner: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    right: 72,
    pointerEvents: "none",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  bannerText: {
    fontSize: 13,
    color: colors.text,
  },
  controls: {
    position: "absolute",
    top: spacing.md,
    right: spacing.lg,
    gap: spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  preview: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    // Above the OSM attribution bar - the tile policy forbids covering it.
    bottom: spacing.lg + 20,
  },
});
