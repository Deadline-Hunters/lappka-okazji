import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

type Props = {
  city?: string;

  radiusMeters?: number;
  dealsCount: number;
};

export function DealsLocationBanner({
  city,

  radiusMeters = 500,
  dealsCount,
}: Props) {
  const countLabel =
    dealsCount === 1
      ? "1 okazja"
      : dealsCount % 10 >= 2 &&
          dealsCount % 10 <= 4 &&
          (dealsCount < 10 || dealsCount > 20)
        ? `${dealsCount} okazje`
        : `${dealsCount} okazji`;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="radio" size={20} color={colors.surface} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title} numberOfLines={1}>
          {city}
        </Text>
        <Text style={styles.subtitle}>
          Promień {radiusMeters} m wokół Ciebie
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{countLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.locationBannerBg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.locationBannerBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.locationIconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  badge: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },
});
