import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import {
  SegmentedControl,
  type SegmentOption,
} from "@/components/SegmentedControl";
import { useAuthSession } from "@/lib/auth-session";
import { colors, spacing } from "@/theme";

import { LogoutButton } from "./components/LogoutButton";
import { MySubmissionsList } from "./components/MySubmissionsList";
import { RadarSettingsPlaceholder } from "./components/RadarSettingsPlaceholder";
import { UserProfileCard } from "./components/UserProfileCard";
import { useProfile } from "./hooks/useProfile";
import type { ProfileTab } from "./types";

function UserProfile() {
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
      {/* User profile card with details and statistics */}
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

export function ProfileScreen() {
  const { isGuest, exitGuestMode } = useAuthSession();
  const router = useRouter();

  if (!isGuest) {
    return <UserProfile />;
  }

  const openAuth = (mode: "login" | "register") => {
    exitGuestMode();
    router.replace({ pathname: "/auth", params: { mode } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
    >
      <EmptyState
        card
        icon="person-outline"
        title="Przeglądasz jako gość"
        message="Konto jest potrzebne, aby dodawać i potwierdzać okazje oraz zbierać Łappsy."
      />
      <Button label="Zaloguj się" onPress={() => openAuth("login")} />
      <Button
        label="Załóż konto"
        variant="secondary"
        onPress={() => openAuth("register")}
      />
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
