import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { TextField } from "@/components/TextField";
import { CATEGORIES, type DealCategory } from "../types";
import type {
  DealFormData,
  DealFormErrors,
} from "../validation/dealFormValidation";
import { colors, radius, spacing } from "@/theme";

type Props = {
  data: DealFormData;
  errors: DealFormErrors;
  onChange: (updates: Partial<DealFormData>) => void;
};

const CATEGORY_KEYS = Object.keys(CATEGORIES) as DealCategory[];

export function Step1Details({ data, errors, onChange }: Props) {
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [priceInput, setPriceInput] = useState<string>(() =>
    data.price != null ? String(data.price) : "",
  );

  // Synchronize local input state if price was cleared externally
  useEffect(() => {
    if (data.price == null && priceInput !== "") {
      setPriceInput("");
    }
  }, [data.price, priceInput]);

  const handlePriceChange = (val: string) => {
    // Keep only digits, dots and commas
    const sanitized = val.replace(/[^0-9.,]/g, "");
    setPriceInput(sanitized);

    const clean = sanitized.replace(",", ".");
    if (clean.trim() === "" || clean === ".") {
      onChange({ price: undefined });
      return;
    }

    const num = parseFloat(clean);
    onChange({ price: isNaN(num) ? undefined : num });
  };

  const handlePickFromGallery = async () => {
    try {
      setIsPickingImage(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Wymagany dostęp do galerii",
          "Aby wybrać zdjęcie z pamięci urządzenia, zezwól aplikacji na dostęp do zdjęć w ustawieniach systemu.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChange({ imageUri: result.assets[0].uri });
      }
    } catch {
      Alert.alert(
        "Błąd galerii",
        "Wystąpił nieoczekiwany problem podczas otwierania galerii zdjęć. Spróbuj ponownie.",
      );
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setIsPickingImage(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Wymagany dostęp do aparatu",
          "Aby zrobić zdjęcie okazji, zezwól aplikacji na dostęp do aparatu w ustawieniach systemu.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChange({ imageUri: result.assets[0].uri });
      }
    } catch {
      Alert.alert(
        "Błąd aparatu",
        "Wystąpił problem podczas uruchamiania aparatu fotograficznego. Spróbuj ponownie.",
      );
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    onChange({ imageUri: null });
  };

  return (
    <View style={styles.container}>
      {/* 1. Zdjęcie okazji */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zdjęcie okazji (opcjonalne)</Text>
        <Text style={styles.sectionSubtitle}>
          Dobre zdjęcie zwiększa szansę na szybkie potwierdzenie przez innych
          łowców.
        </Text>

        {data.imageUri ? (
          <Card elevation="sm" bordered style={styles.previewCard}>
            <Image
              source={{ uri: data.imageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <View style={styles.previewActions}>
              <Button
                variant="surface"
                size="sm"
                icon="camera-outline"
                label="Zmień zdjęcie"
                onPress={handleTakePhoto}
                disabled={isPickingImage}
              />
              <IconButton
                icon="trash-outline"
                variant="muted"
                size="md"
                color={colors.danger}
                accessibilityLabel="Usuń zdjęcie"
                onPress={handleRemovePhoto}
              />
            </View>
          </Card>
        ) : (
          <Card elevation="sm" bordered style={styles.photoPickerCard}>
            <Text style={styles.photoPlaceholderText}>
              📷 Brak wybranego zdjęcia
            </Text>
            <View style={styles.photoButtonsRow}>
              <Button
                variant="tonal"
                size="md"
                icon="camera-outline"
                label="Zrób zdjęcie"
                onPress={handleTakePhoto}
                loading={isPickingImage}
                style={styles.actionBtn}
              />
              <Button
                variant="surface"
                size="md"
                icon="images-outline"
                label="Z galerii"
                onPress={handlePickFromGallery}
                disabled={isPickingImage}
                style={styles.actionBtn}
              />
            </View>
          </Card>
        )}
      </View>

      {/* 2. Tytuł okazji */}
      <View style={styles.section}>
        <TextField
          label="Tytuł okazji *"
          placeholder="np. Kawa 2 za 1 na wynos"
          value={data.title}
          onChangeText={(title) => onChange({ title })}
          error={errors.title}
          maxLength={120}
        />
        <Text style={styles.helperText}>
          Krótka, konkretna nazwa produktu lub promocji (3–120 znaków).
        </Text>
      </View>

      {/* 3. Kategoria okazji */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategoria *</Text>
        <Text style={styles.sectionSubtitle}>
          Wybierz kategorię, która najlepiej pasuje do oferty:
        </Text>

        <View style={styles.categoriesGrid}>
          {CATEGORY_KEYS.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const isSelected = data.category === catKey;

            return (
              <Pressable
                key={catKey}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onChange({ category: catKey })}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected && styles.categoryLabelSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.category ? (
          <Text style={styles.errorText}>{errors.category}</Text>
        ) : null}
      </View>

      {/* 4. Cena promocyjna (opcjonalnie) */}
      <View style={styles.section}>
        <TextField
          label="Cena promocyjna (zł)"
          hint="opcjonalnie"
          placeholder="np. 9.99 (0 = Gratis)"
          keyboardType="decimal-pad"
          value={priceInput}
          onChangeText={handlePriceChange}
          error={errors.price}
        />
        <Text style={styles.helperText}>
          Pozostaw puste, jeśli okazja dotyczy zniżki procentowej lub gratisu.
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
  photoPickerCard: {
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "500",
  },
  photoButtonsRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
  },
  previewCard: {
    overflow: "hidden",
    padding: 0,
  },
  imagePreview: {
    width: "100%",
    height: 190,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.surface,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: "transparent",
    minHeight: 44,
  },
  categoryChipSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inactiveFilterText,
  },
  categoryLabelSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
});
