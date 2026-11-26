import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { Deal } from "@/features/deals/types";
import { distanceInMeters, formatDistance, type LatLng } from "@/lib/geo";
import { colors, radius, spacing } from "@/theme";

const WALKING_METERS_PER_MINUTE = 80;
const MAX_WALKING_MINUTES_SHOWN = 45;

type Props = {
  deal: Deal;
  userLocation: LatLng | null;
  onShowOnMap: () => void;
  onNavigate: () => void;
};

export function DealLocationCard({
  deal,
  userLocation,
  onShowOnMap,
  onNavigate,
}: Props) {
  const meters = userLocation
    ? distanceInMeters(userLocation, deal.location)
    : null;
  const distanceLabel = meters !== null ? formatDistance(meters) : null;
  const walkingMinutes =
    meters !== null
      ? Math.max(1, Math.round(meters / WALKING_METERS_PER_MINUTE))
      : null;
  const showWalkingTime =
    walkingMinutes !== null && walkingMinutes <= MAX_WALKING_MINUTES_SHOWN;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.pinIcon}>
          <Ionicons
            name="location-outline"
            size={20}
            color={colors.primaryDark}
          />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.address} numberOfLines={1}>
            {deal.address}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {deal.storeName}
            {showWalkingTime ? ` • ~${walkingMinutes} min pieszo` : ""}
          </Text>
        </View>
        {distanceLabel ? (
          <Badge label={distanceLabel} tone="muted" size="md" />
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <Button
          label="Pokaż na mapie"
          icon="map-outline"
          variant="dark"
          size="md"
          onPress={onShowOnMap}
          style={styles.actionButton}
        />
        <Button
          label="Nawiguj"
          icon="walk-outline"
          variant="tonal"
          size="md"
          onPress={onNavigate}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pinIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  storeInfo: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  address: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
