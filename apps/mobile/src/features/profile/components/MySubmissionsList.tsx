import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { MySubmissionDto } from "../types";
import { SubmissionCard } from "./SubmissionCard";

interface Props {
  submissions: MySubmissionDto[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function MySubmissionsList({
  submissions,
  isLoading,
  error,
  onRetry,
}: Props) {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.mutedText}>Ładowanie Twoich zgłoszeń...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateCard}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
        <Text style={styles.stateTitle}>Nie udało się pobrać zgłoszeń</Text>
        <Text style={styles.stateDescription}>{error.message}</Text>
        {onRetry && (
          <Pressable style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (submissions.length === 0) {
    return (
      <View style={styles.stateCard}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="pricetag-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.stateTitle}>Brak zgłoszeń</Text>
        <Text style={styles.stateDescription}>
          Nie dodałeś jeszcze żadnych okazji. Znalazłeś dobrą promocję w
          okolicy? Podziel się nią z innymi użytkownikami!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
  },
  centerContainer: {
    paddingVertical: spacing.xl * 2,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  mutedText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "#F0EDF5",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  stateDescription: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
