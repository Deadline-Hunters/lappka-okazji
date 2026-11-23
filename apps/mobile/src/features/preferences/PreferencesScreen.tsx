import { ScrollView, StyleSheet, Text } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { colors, spacing } from "@/theme";

import { FavoriteCategoriesCard } from "./components/FavoriteCategoriesCard";
import { usePreferences } from "./PreferencesProvider";

// "Preferencje" tab (KAN-34). The AppHeader comes from the tabs layout.
export function PreferencesScreen() {
  const {
    preferences,
    isLoading,
    loadError,
    saveFailed,
    update,
    reload,
    retrySave,
  } = usePreferences();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {isLoading && !preferences ? (
        <LoadingState message="Ładowanie preferencji..." />
      ) : null}

      {loadError && !preferences ? (
        <EmptyState
          card
          icon="alert-circle-outline"
          tone="danger"
          title="Nie udało się wczytać preferencji"
          message={loadError.message}
          action={{ label: "Spróbuj ponownie", onPress: reload }}
        />
      ) : null}

      {preferences ? (
        <FavoriteCategoriesCard
          selected={preferences.favoriteCategories}
          onChange={(favoriteCategories) =>
            update((current) => ({ ...current, favoriteCategories }))
          }
        />
      ) : null}

      {saveFailed ? (
        <Card elevation="none" style={styles.saveError}>
          <Text style={styles.saveErrorText} accessibilityRole="alert">
            Nie udało się zapisać zmian. Spróbuj ponownie.
          </Text>
          <Button
            label="Zapisz ponownie"
            icon="refresh"
            size="sm"
            onPress={retrySave}
          />
        </Card>
      ) : preferences ? (
        <Text style={styles.status}>
          Zmiany zapisują się automatycznie na tym urządzeniu.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 3,
    gap: spacing.lg,
  },
  saveError: {
    gap: spacing.sm,
    alignItems: "flex-start",
    borderColor: colors.danger,
  },
  saveErrorText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.danger,
  },
  status: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textMuted,
  },
});
