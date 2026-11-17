import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import {
  SegmentedControl,
  type SegmentOption,
} from "@/components/SegmentedControl";
import { colors, spacing } from "@/theme";

import { LogoutButton } from "./components/LogoutButton";
import { MySubmissionsList } from "./components/MySubmissionsList";
import { RadarSettingsPlaceholder } from "./components/RadarSettingsPlaceholder";
import { UserProfileCard } from "./components/UserProfileCard";
import { useProfile } from "./hooks/useProfile";
import type { ProfileTab } from "./types";

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("submissions");
  const { profile, isLoading, error, refetch } = useProfile();
  const submissionsCount = profile?.stats.submissionsCount;

  const tabs = useMemo<SegmentOption<ProfileTab>[]>(
    () => [
      {
        id: "submissions",
        label:
          submissionsCount != null
            ? `Moje zgłoszenia (${submissionsCount})`
            : "Moje zgłoszenia",
      },
      { id: "radar", label: "Ustawienia radaru" },
    ],
    [submissionsCount],
  );

  if (isLoading && !profile) {
    return <LoadingState message="Ładowanie profilu..." fill />;
  }

  if (error && !profile) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        tone="danger"
        title="Nie udało się załadować profilu"
        message={error.message}
        action={{ label: "Spróbuj ponownie", onPress: refetch }}
        fill
      />
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* User profile card with avatar, details, and statistics */}
      <UserProfileCard user={profile.user} stats={profile.stats} />

      {/* Tab selector */}
      <SegmentedControl
        options={tabs}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* Selected tab content */}
      {activeTab === "submissions" ? (
        <MySubmissionsList
          submissions={profile.submissions}
          isLoading={false}
          error={error}
          onRetry={refetch}
        />
      ) : (
        <RadarSettingsPlaceholder />
      )}

      {/* Sign out button */}
      <LogoutButton />
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
});
