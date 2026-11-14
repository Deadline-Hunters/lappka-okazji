import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { ProfileStatsDto, UserProfileDto } from "../types";
import { ProfileStats } from "./ProfileStats";

interface Props {
  user: UserProfileDto;
  stats: ProfileStatsDto;
}

export function UserProfileCard({ user, stats }: Props) {
  const [imageError, setImageError] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials =
    `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <View style={styles.card}>
      {/* Dekoracyjne pastelowe tło w górnej części karty */}
      <View style={styles.decorativeGlow} pointerEvents="none" />

      {/* Główna sekcja z avatarem i danymi użytkownika */}
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          {user.avatarUrl && !imageError ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              onError={() => setImageError(true)}
              accessibilityLabel={`Zdjęcie profilowe: ${fullName}`}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName}
            </Text>
            {user.isVerified && (
              <View
                style={styles.verifiedBadge}
                accessibilityLabel="Użytkownik zweryfikowany"
              >
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </View>

      {/* Sekcja statystyk */}
      <ProfileStats stats={stats} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.lg + 2,
    shadowColor: "#1E1B24",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EFEBF5",
    overflow: "hidden",
    position: "relative",
    gap: spacing.lg,
  },
  decorativeGlow: {
    position: "absolute",
    top: -40,
    left: -40,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#FDF5E6",
    opacity: 0.8,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    padding: 3,
    backgroundColor: "#FCECD4",
    shadowColor: "#E0A030",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: "#F0EDF5",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: "#D2733A",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
