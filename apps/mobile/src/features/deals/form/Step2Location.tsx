import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
import { useUserLocation } from "@/features/map/useUserLocation";
import { DEFAULT_CENTER, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

import LocationPickerMap from "./LocationPickerMap";
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

  const selectedPoint = data.location ?? userLocation ?? DEFAULT_CENTER;

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
      // If manually picking point, clear store ID unless store matches
      selectedStoreId: null,
      storeName: data.selectedStoreId
        ? ""
        : data.storeName || "Wybrany punkt na mapie",
    });
    void loadStores(newPoint);
  };

  // Handle store selection from map or list
  const handleSelectStore = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;

    onChange({
      location: { latitude: store.latitude, longitude: store.longitude },
      selectedStoreId: store.id,
      storeName: store.name,
      storeAddress: store.address ?? "",
    });
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
      void loadStores(pos);
    }
  };

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
          <LocationPickerMap
            initialCenter={selectedPoint}
            selectedLocation={selectedPoint}
            stores={stores}
            selectedStoreId={data.selectedStoreId}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
            onStoreSelect={handleSelectStore}
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
            icon="storefront-outline"
            title="Brak sklepów w pobliżu"
            message="Nie znaleziono zarejestrowanych sklepów w promieniu 5 km. Wskaż punkt na mapie i wpisz nazwę miejsca ręcznie."
          />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isSelected = item.id === data.selectedStoreId;

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

                  {item.distanceMeters != null ? (
                    <Badge
                      tone={isSelected ? "primary" : "muted"}
                      label={formatDistance(item.distanceMeters)}
                    />
                  ) : null}
                </Pressable>
              );
            }}
            contentContainerStyle={styles.storesList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
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
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  warningNotice: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  warningText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  mapCard: {
    gap: spacing.xs,
  },
  mapHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  mapContainer: {
    height: 240,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapElement: {
    flex: 1,
  },
  selectedLocationCard: {
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surface,
  },
  selectedLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
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
    marginTop: spacing.xs,
  },
  nameInput: {
    marginTop: spacing.sm,
  },
  storesSection: {
    gap: spacing.xs,
    marginTop: spacing.sm,
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
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loaderText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  storesList: {
    gap: spacing.xs,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  storeItemSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  storeInfo: {
    flex: 1,
    marginRight: spacing.sm,
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
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
  },
});
