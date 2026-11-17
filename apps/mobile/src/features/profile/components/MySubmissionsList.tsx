import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";

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
    return <LoadingState message="Ładowanie Twoich zgłoszeń..." />;
  }

  if (error) {
    return (
      <EmptyState
        card
        icon="alert-circle-outline"
        tone="danger"
        title="Nie udało się pobrać zgłoszeń"
        message={error.message}
        action={
          onRetry ? { label: "Spróbuj ponownie", onPress: onRetry } : undefined
        }
      />
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        card
        icon="pricetag-outline"
        title="Brak zgłoszeń"
        message="Nie dodałeś jeszcze żadnych okazji. Znalazłeś dobrą promocję w okolicy? Podziel się nią z innymi użytkownikami!"
      />
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
});
