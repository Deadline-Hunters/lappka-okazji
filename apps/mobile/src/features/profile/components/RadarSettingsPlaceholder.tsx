import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

export function RadarSettingsPlaceholder() {
  return (
    <View style={styles.card}>
      {/* Nagłówek i status */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="radio-outline" size={30} color={colors.accent} />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>W przygotowaniu</Text>
        </View>
      </View>

      <Text style={styles.title}>Ustawienia radaru okazji</Text>
      <Text style={styles.description}>
        Radar pozwoli Ci na automatyczne wykrywanie promocji w Twoim najbliższym
        otoczeniu oraz dostosowanie powiadomień do Twoich preferencji.
      </Text>

      {/* Podgląd przyszłych opcji konfiguracyjnych */}
      <View style={styles.previewContainer}>
        <View style={styles.previewRow}>
          <View style={styles.previewRowLeft}>
            <Ionicons
              name="locate-outline"
              size={18}
              color={colors.textMuted}
            />
            <Text style={styles.previewLabel}>Promień wyszukiwania</Text>
          </View>
          <View style={styles.previewPill}>
            <Text style={styles.previewPillText}>1.5 km</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.previewRow}>
          <View style={styles.previewRowLeft}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={colors.textMuted}
            />
            <Text style={styles.previewLabel}>Powiadomienia o okazjach</Text>
          </View>
          <View style={styles.previewPill}>
            <Text style={styles.previewPillText}>Włączone</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.previewRow}>
          <View style={styles.previewRowLeft}>
            <Ionicons
              name="options-outline"
              size={18}
              color={colors.textMuted}
            />
            <Text style={styles.previewLabel}>Preferowane kategorie</Text>
          </View>
          <View style={styles.previewPill}>
            <Text style={styles.previewPillText}>Wszystkie</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
    shadowColor: "#1E1B24",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0EDF5",
    gap: spacing.md,
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: "#EEF3FC",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  previewContainer: {
    width: "100%",
    backgroundColor: "#F9F8FD",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: "#EAE7F2",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs + 2,
  },
  previewRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  previewLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  previewPill: {
    backgroundColor: "#EBE8F3",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  previewPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: "#ECE8F3",
    marginVertical: spacing.xs + 2,
  },
});
