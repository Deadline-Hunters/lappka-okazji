import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { CATEGORIES } from "../types";
import {
  getCalculatedExpirationDate,
  type DealFormData,
  type DealFormErrors,
  type ExpirationType,
} from "../validation/dealFormValidation";
import { colors, radius, spacing } from "@/theme";

type Props = {
  data: DealFormData;
  errors: DealFormErrors;
  isSubmitting: boolean;
  onChange: (updates: Partial<DealFormData>) => void;
  onSubmit: () => void;
};

const EXPIRATION_OPTIONS: { id: ExpirationType; label: string }[] = [
  { id: "today", label: "Dzisiaj" },
  { id: "tomorrow", label: "Jutro" },
  { id: "custom", label: "Własna data" },
];

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

export function Step3Publish({
  data,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: Props) {
  // Days ahead selector for "custom" date (1..14 days)
  const [daysAhead, setDaysAhead] = useState(3);

  const handleExpirationTypeChange = (type: ExpirationType) => {
    if (type === "custom") {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      d.setHours(23, 59, 59, 999);
      onChange({ expirationType: type, customDate: d });
    } else {
      onChange({ expirationType: type, customDate: null });
    }
  };

  const handleDaysAheadChange = (days: number) => {
    setDaysAhead(days);
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 59, 999);
    onChange({ expirationType: "custom", customDate: d });
  };

  const calculatedExpiration = getCalculatedExpirationDate(
    data.expirationType,
    data.customDate,
  );

  const selectedCategory = data.category ? CATEGORIES[data.category] : null;

  return (
    <View style={styles.container}>
      {/* 1. Termin ważności */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Termin ważności okazji *</Text>
        <Text style={styles.sectionSubtitle}>
          Określ, do kiedy oferta jest aktualna dla innych użytkowników:
        </Text>

        <View style={styles.expirationButtonsRow}>
          {EXPIRATION_OPTIONS.map((opt) => {
            const isSelected = data.expirationType === opt.id;

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleExpirationTypeChange(opt.id)}
                style={[
                  styles.expirationBtn,
                  isSelected && styles.expirationBtnSelected,
                ]}
              >
                <Text
                  style={[
                    styles.expirationBtnText,
                    isSelected && styles.expirationBtnTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {data.expirationType === "custom" && (
          <View style={styles.customDateContainer}>
            <Text style={styles.customDateLabel}>Wybierz czas trwania:</Text>
            <View style={styles.daysPillsRow}>
              {[2, 3, 5, 7, 14].map((days) => {
                const isSelected = daysAhead === days;
                return (
                  <Pressable
                    key={days}
                    onPress={() => handleDaysAheadChange(days)}
                    style={[
                      styles.dayPill,
                      isSelected && styles.dayPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayPillText,
                        isSelected && styles.dayPillTextSelected,
                      ]}
                    >
                      {days}{" "}
                      {days === 2 || days === 3 || days === 4 ? "dni" : "dni"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.datePreviewRow}>
          <Text style={styles.datePreviewLabel}>Ważna do:</Text>
          <Badge tone="accent" label={formatDate(calculatedExpiration)} />
        </View>

        {errors.validUntil && (
          <Text style={styles.errorText}>{errors.validUntil}</Text>
        )}
      </View>

      {/* 2. Wskazówka dla łowców (opcjonalna) */}
      <View style={styles.section}>
        <TextField
          label="Wskazówka dla innych (opcjonalnie)"
          placeholder="np. 'Promocja widoczna przy kasie, tylko z kartą Moja Biedronka' lub 'Stoisko z pieczywem na końcu sklepu'"
          value={data.description}
          onChangeText={(description) => onChange({ description })}
          error={errors.description}
          multiline
          numberOfLines={3}
          maxLength={1000}
          hint="Dodatkowe informacje ułatwiające znalezienie i skorzystanie z okazji."
        />
      </View>

      {/* 3. Podsumowanie przed publikacją */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Podsumowanie</Text>
        <Text style={styles.sectionSubtitle}>
          Upewnij się, że wszystkie dane są poprawne:
        </Text>

        <Card elevation="sm" bordered style={styles.summaryCard}>
          {/* Miniatura zdjęcia */}
          {data.imageUri ? (
            <View style={styles.summaryPhotoRow}>
              <Image
                source={{ uri: data.imageUri }}
                style={styles.summaryImage}
                resizeMode="cover"
              />
              <View style={styles.summaryPhotoInfo}>
                <Badge tone="accent" label="Zdjęcie dołączone" />
                <Text style={styles.summaryPhotoHint}>
                  Zostanie przesłane do chmury po kliknięciu publikuj
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noPhotoNotice}>
              <Badge tone="muted" label="Bez zdjęcia" />
              <Text style={styles.noPhotoText}>
                Możesz opublikować okazję bez zdjęcia
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          {/* Tytuł i kategoria */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tytuł:</Text>
            <Text style={styles.summaryValueTitle}>{data.title || "-"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kategoria:</Text>
            {selectedCategory ? (
              <Badge
                tone="primary"
                label={`${selectedCategory.emoji} ${selectedCategory.label}`}
              />
            ) : (
              <Text style={styles.summaryValue}>Nie wybrano</Text>
            )}
          </View>

          {data.price != null && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cena:</Text>
              <Text style={styles.summaryPrice}>
                {data.price === 0 ? "Gratis" : `${data.price.toFixed(2)} zł`}
              </Text>
            </View>
          )}

          {/* Miejsce */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lokalizacja:</Text>
            <View style={styles.summaryLocationBlock}>
              <Text style={styles.summaryValueBold}>
                {data.storeName || "Wybrany punkt na mapie"}
              </Text>
              {data.storeAddress ? (
                <Text style={styles.summaryValueMuted}>
                  {data.storeAddress}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Ważność */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ważność:</Text>
            <Text style={styles.summaryValue}>
              {formatDate(calculatedExpiration)}
            </Text>
          </View>

          {/* Wskazówka */}
          {data.description.trim() ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Wskazówka:</Text>
              <Text style={styles.summaryValueHint}>
                „{data.description.trim()}”
              </Text>
            </View>
          ) : null}
        </Card>
      </View>

      {/* 4. Przycisk Publikuj */}
      <View style={styles.submitSection}>
        <Button
          variant="primary"
          size="lg"
          icon="checkmark-circle-outline"
          label={isSubmitting ? "Publikowanie..." : "Opublikuj okazję"}
          onPress={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        />
        <Text style={styles.disclaimerText}>
          Publikując okazję pomagasz lokalnej społeczności oszczędzać każdego
          dnia!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  section: {
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
  expirationButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  expirationBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  expirationBtnSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  expirationBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inactiveFilterText,
  },
  expirationBtnTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  customDateContainer: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  customDateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.inactiveFilterText,
  },
  daysPillsRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  dayPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  dayPillTextSelected: {
    color: colors.textInverse,
  },
  datePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  datePreviewLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  summaryCard: {
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  summaryPhotoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  summaryImage: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
  },
  summaryPhotoInfo: {
    flex: 1,
    gap: 4,
  },
  summaryPhotoHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  noPhotoNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  noPhotoText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
    width: 90,
  },
  summaryValue: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    textAlign: "right",
  },
  summaryValueTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    textAlign: "right",
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.accent,
  },
  summaryLocationBlock: {
    flex: 1,
    alignItems: "flex-end",
  },
  summaryValueBold: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
  },
  summaryValueMuted: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "right",
  },
  summaryValueHint: {
    flex: 1,
    fontSize: 12,
    fontStyle: "italic",
    color: colors.textMuted,
    textAlign: "right",
  },
  submitSection: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  submitButton: {
    width: "100%",
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
