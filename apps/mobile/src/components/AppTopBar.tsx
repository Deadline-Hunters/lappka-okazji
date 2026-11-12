import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

type Props = {
  subtitle: string;
  hasUnreadNotifications?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

export function AppTopBar({
  subtitle,
  hasUnreadNotifications = true,
  onNotificationPress,
  onProfilePress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.appName}>Łappka Okazji</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>

      <View style={styles.actionsWrapper}>
        <Pressable
          onPress={onNotificationPress}
          style={styles.iconButton}
          hitSlop={8}
          accessibilityLabel="Powiadomienia"
        >
          <Ionicons
            name="notifications-outline"
            size={21}
            color={colors.text}
          />
          {hasUnreadNotifications ? (
            <View style={styles.notificationDot} />
          ) : null}
        </Pressable>

        <Pressable
          onPress={onProfilePress}
          style={styles.avatarButton}
          hitSlop={4}
          accessibilityLabel="Profil użytkownika"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            }}
            style={styles.avatar}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  titleWrapper: {
    alignItems: "center",
    flex: 1,
    // Balance the two action buttons on the right.
    paddingLeft: 84,
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  actionsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#F7F3BE",
  },
  notificationDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badgeDiscountBg,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
