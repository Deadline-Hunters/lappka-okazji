import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, spacing } from "@/theme";

import { LogoutButton } from "./components/LogoutButton";
import { MySubmissionsList } from "./components/MySubmissionsList";
import { ProfileTabs } from "./components/ProfileTabs";
import { RadarSettingsPlaceholder } from "./components/RadarSettingsPlaceholder";
import { UserProfileCard } from "./components/UserProfileCard";
import { useProfile } from "./hooks/useProfile";
import type { ProfileTab } from "./types";

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("submissions");
  const { profile, isLoading, error, refetch } = useProfile();

  if (isLoading && !profile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Ładowanie profilu...</Text>
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Nie udało się załadować profilu</Text>
        <Text style={styles.errorSubtitle}>{error.message}</Text>
      </View>
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
      {/* Karta użytkownika ze zdjęciem, danymi oraz statystykami */}
      <UserProfileCard user={profile.user} stats={profile.stats} />

      {/* Przełącznik zakładek */}
      <ProfileTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        submissionsCount={profile.stats.submissionsCount}
      />

      {/* Zawartość wybranej zakładki */}
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

      {/* Przycisk wylogowania */}
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
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.danger,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
