import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { colors, radius, spacing } from "@/theme";

export function RadarSettingsPlaceholder() {
  return (
    <Card elevation="sm" style={styles.card}>
      {/* Header and status badge */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="radio-outline" size={30} color={colors.accent} />
        </View>
        <Badge label="W przygotowaniu" tone="primary" size="md" />
      </View>

      <Text style={styles.title}>Ustawienia radaru okazji</Text>
      <Text style={styles.description}>
        Radar pozwoli Ci na automatyczne wykrywanie promocji w Twoim najbliższym
        otoczeniu oraz dostosowanie powiadomień do Twoich preferencji.
      </Text>

      {/* Preview of upcoming configuration options */}
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    alignItems: "center",
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
