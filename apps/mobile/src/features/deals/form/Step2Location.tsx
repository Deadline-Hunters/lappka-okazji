import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { TextField } from "@/components/TextField";
import DealsMap from "@/features/map/DealsMap";
import type { CameraTarget, MapMarker } from "@/features/map/types";
import { useUserLocation } from "@/features/map/useUserLocation";
import { DEFAULT_CENTER, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import {
  getNearbyStores,
  type StoreLocation,
} from "../services/storeLocationsService";
import type {
  DealFormData,
  DealFormErrors,
} from "../validation/dealFormValidation";

type Props = {
  data: DealFormData;
  errors: DealFormErrors;
  onChange: (updates: Partial<DealFormData>) => void;
};

export function Step2Location({ data, errors, onChange }: Props) {
  const {
    location: userLocation,
    status: gpsStatus,
    refresh: refreshGps,
  } = useUserLocation();

  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [storeFetchError, setStoreFetchError] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraTarget | null>(null);

  const selectedPoint = data.location ?? userLocation ?? DEFAULT_CENTER;

  const moveCameraTo = useCallback((coords: LatLng) => {
    setCamera({
      latitude: coords.latitude,
      longitude: coords.longitude,
      zoom: 16,
      id: Date.now(),
    });
  }, []);

  // Load nearby stores around the selected location
  const loadStores = useCallback(async (centerPoint: LatLng) => {
    try {
      setIsLoadingStores(true);
      setStoreFetchError(null);
      const list = await getNearbyStores(centerPoint, 5000);
      setStores(list);
    } catch {
      setStoreFetchError(
        "Nie udało się pobrać listy pobliskich sklepów. Możesz wskazać punkt ręcznie.",
      );
    } finally {
      setIsLoadingStores(false);
    }
  }, []);

  // Initialize location on mount if not already set
  useEffect(() => {
    if (!data.location) {
      const initialPoint = userLocation ?? DEFAULT_CENTER;
      onChange({ location: initialPoint });
      void loadStores(initialPoint);
    } else {
      void loadStores(data.location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle manual map pin move or tap
  const handleLocationChange = async (newPoint: LatLng) => {
    onChange({
      location: newPoint,
      // If manually picking point, clear store ID but preserve or provide a clear location name
      selectedStoreId: null,
      storeName:
        data.storeName.trim() !== ""
          ? data.storeName
          : "Wybrany punkt na mapie",
    });
    moveCameraTo(newPoint);
    void loadStores(newPoint);
  };

  // Handle store selection from map or list
  const handleSelectStore = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;

    const coords = { latitude: store.latitude, longitude: store.longitude };
    onChange({
      location: coords,
      selectedStoreId: store.id,
      storeName: store.name,
      storeAddress: store.address ?? "",
    });
    moveCameraTo(coords);
  };

  // Recenter on user's current GPS position
  const handleUseGps = async () => {
    const pos = await refreshGps();
    if (pos) {
      onChange({
        location: pos,
        selectedStoreId: null,
        storeName: "Moja aktualna lokalizacja",
        storeAddress: "",
      });
      moveCameraTo(pos);
      void loadStores(pos);
    }
  };

  // Map stores to standard MapMarker items for DealsMap
  const storeMarkers = useMemo<MapMarker[]>(
    () =>
      stores.map((store) => ({
        id: store.id,
        latitude: store.latitude,
        longitude: store.longitude,
        emoji: "🏪",
        color:
          store.id === data.selectedStoreId
            ? colors.primary
            : colors.neutralDark,
        label: store.name,
      })),
    [stores, data.selectedStoreId],
  );

  return (
    <View style={styles.container}>
      {/* 1. Status GPS i szybkie centrowanie */}
      <View style={styles.gpsRow}>
        <View style={styles.gpsStatus}>
          <Text style={styles.gpsStatusLabel}>Status lokalizacji:</Text>
          {gpsStatus === "granted" ? (
            <Badge tone="accent" label="GPS aktywny" />
          ) : gpsStatus === "loading" ? (
            <Badge tone="muted" label="Ustalanie pozycji..." />
          ) : (
            <Badge tone="highlight" label="Brak dostępu do GPS" />
          )}
        </View>

        <Button
          variant="tonal"
          size="sm"
          icon="navigate-outline"
          label="Mój GPS"
          onPress={handleUseGps}
        />
      </View>

      {gpsStatus === "denied" && (
        <View style={styles.warningNotice}>
          <Text style={styles.warningText}>
            Dostęp do GPS jest wyłączony. Użyto domyślnego punktu w Krakowie.
            Możesz przesunąć pinezkę lub wybrać sklep z listy poniżej.
          </Text>
        </View>
      )}

      {/* 2. Interaktywna mapa z pinezką */}
      <View style={styles.mapCard}>
        <Text style={styles.mapHint}>
          👉 Dotknij mapy lub przeciągnij pinezkę, aby dokładnie wskazać
          miejsce:
        </Text>
        <View style={styles.mapContainer}>
          <DealsMap
            initialCenter={selectedPoint}
            initialZoom={16}
            markers={storeMarkers}
            userLocation={userLocation}
            selectedMarkerId={data.selectedStoreId}
            camera={camera}
            pickedLocation={selectedPoint}
            onPickedLocationChange={handleLocationChange}
            onMarkerPress={handleSelectStore}
            onMapPress={async (coords) => {
              if (coords) {
                await handleLocationChange(coords);
              }
            }}
            onOpenUrl={async (url) => {
              void Linking.openURL(url);
            }}
            dom={{ style: styles.mapElement, scrollEnabled: false }}
          />
        </View>
      </View>

      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}

      {/* 3. Wybrana lokalizacja - podgląd */}
      <Card elevation="sm" bordered style={styles.selectedLocationCard}>
        <Text style={styles.selectedLabel}>Aktualnie wybrana lokalizacja:</Text>
        <Text style={styles.selectedName}>
          {data.storeName || "Wybrany punkt na mapie"}
        </Text>
        {data.storeAddress ? (
          <Text style={styles.selectedAddress}>{data.storeAddress}</Text>
        ) : null}
        <Text style={styles.selectedCoords}>
          Współrzędne: {selectedPoint.latitude.toFixed(5)},{" "}
          {selectedPoint.longitude.toFixed(5)}
        </Text>

        <TextField
          label="Nazwa sklepu / miejsca *"
          placeholder="np. Biedronka, Żabka, Restauracja..."
          value={data.storeName}
          onChangeText={(storeName) => onChange({ storeName })}
          error={errors.storeName}
          containerStyle={styles.nameInput}
        />
      </Card>

      {/* 4. Lista pobliskich sklepów */}
      <View style={styles.storesSection}>
        <Text style={styles.sectionTitle}>Pobliskie sklepy i punkty:</Text>
        <Text style={styles.sectionSubtitle}>
          Wybierz sklep z listy, aby automatycznie przypisać okazję do tego
          miejsca:
        </Text>

        {isLoadingStores ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loaderText}>
              Wyszukiwanie sklepów w okolicy...
            </Text>
          </View>
        ) : storeFetchError ? (
          <EmptyState
            tone="danger"
            title="Błąd pobierania"
            message={storeFetchError}
            action={{
              label: "Spróbuj ponownie",
              onPress: () => loadStores(selectedPoint),
            }}
          />
        ) : stores.length === 0 ? (
          <EmptyState
            title="Brak zapisanych sklepów"
            message="W promieniu 5 km nie ma zarejestrowanych sklepów. Możesz wpisać własną nazwę powyżej."
          />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => {
              const isSelected = data.selectedStoreId === item.id;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleSelectStore(item.id)}
                  style={[
                    styles.storeItem,
                    isSelected && styles.storeItemSelected,
                  ]}
                >
                  <View style={styles.storeIconWrap}>
                    <Text style={styles.storeIcon}>🏪</Text>
                  </View>

                  <View style={styles.storeInfo}>
                    <Text
                      style={[
                        styles.storeItemName,
                        isSelected && styles.storeItemNameSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {item.address ? (
                      <Text style={styles.storeItemAddress}>
                        {item.address}
                      </Text>
                    ) : null}
                  </View>

                  {item.distanceMeters !== undefined ? (
                    <Text style={styles.distanceBadge}>
                      {formatDistance(item.distanceMeters)}
                    </Text>
                  ) : null}
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gpsStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  gpsStatusLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  warningNotice: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  warningText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  mapCard: {
    gap: spacing.xs,
  },
  mapHint: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  mapContainer: {
    height: 220,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  mapElement: {
    width: "100%",
    height: "100%",
  },
  selectedLocationCard: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  selectedLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  selectedName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  selectedAddress: {
    fontSize: 13,
    color: colors.textMuted,
  },
  selectedCoords: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: "monospace",
    marginTop: 2,
  },
  nameInput: {
    marginTop: spacing.sm,
  },
  storesSection: {
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  loaderContainer: {
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
  loaderText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  storeItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  storeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  storeIcon: {
    fontSize: 16,
  },
  storeInfo: {
    flex: 1,
    gap: 2,
  },
  storeItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  storeItemNameSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  storeItemAddress: {
    fontSize: 12,
    color: colors.textMuted,
  },
  distanceBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
