import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { colors, radius, spacing } from "@/theme";

import type { ProfileStatsDto, UserProfileDto } from "../types";
import { ProfileStats } from "./ProfileStats";

interface Props {
  user: UserProfileDto;
  stats: ProfileStatsDto;
}

export function UserProfileCard({ user, stats }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <Card style={styles.card}>
      {/* Decorative pastel glow at the top-left of the card */}
      <View style={styles.decorativeGlow} pointerEvents="none" />

      {/* Main section with user avatar and basic info */}
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Avatar uri={user.avatarUrl} name={fullName} size={70} />
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

      {/* User statistics row */}
      <ProfileStats stats={stats} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: spacing.lg + 2,
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
