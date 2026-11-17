import { Link } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/theme";

import { Avatar } from "./Avatar";
import { IconButton } from "./IconButton";

const SIDE_WIDTH = 88;

type Props = {
  // Screen name shown under the app name, e.g. "Mapa".
  title: string;
  hasUnreadNotifications?: boolean;
  onNotificationsPress?: () => void;
};

// Notifications come with KAN-22 - until then the bell only says there is nothing new.
function showNoNotifications() {
  Alert.alert("Powiadomienia", "Brak nowych powiadomień.");
}

// Main tab header from Figma: app name + screen name, notifications bell and the user's avatar.
// Rendered for every tab by `app/(tabs)/_layout.tsx`, so screens don't add their own top bar.
export function AppHeader({
  title,
  hasUnreadNotifications = false,
  onNotificationsPress = showNoNotifications,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.side} />

      <View style={styles.titleBox}>
        <Text style={styles.appName} accessibilityRole="header">
          Łappka Okazji
        </Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={[styles.side, styles.actions]}>
        <IconButton
          icon="notifications-outline"
          accessibilityLabel="Powiadomienia"
          onPress={onNotificationsPress}
          showDot={hasUnreadNotifications}
        />
        {/* TODO(KAN-4/KAN-16): show the signed-in user's photo once profiles come from Supabase. */}
        <Link href="/profile" asChild>
          <Pressable
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Profil"
          >
            <Avatar size={36} style={styles.avatar} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  side: {
    width: SIDE_WIDTH,
  },
  titleBox: {
    flex: 1,
    alignItems: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
