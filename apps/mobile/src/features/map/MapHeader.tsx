import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

const SIDE_WIDTH = 88;

// Map tab header from the Figma mockup: app name + screen name, notifications and the user's avatar.
export function MapHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.side} />

      <View style={styles.titleBox}>
        <Text style={styles.title}>Łappka Okazji</Text>
        <Text style={styles.subtitle}>Mapa</Text>
      </View>

      <View style={[styles.side, styles.actions]}>
        {/* Notifications come with KAN-22 - for now the bell is only an icon. */}
        <View style={styles.iconButton} accessibilityLabel="Powiadomienia">
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.text}
          />
        </View>
        <Link href="/profile" asChild>
          <Pressable
            style={styles.avatar}
            accessibilityRole="button"
            accessibilityLabel="Profil"
          >
            <Ionicons name="person" size={18} color={colors.primaryDark} />
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
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  side: {
    width: SIDE_WIDTH,
  },
  titleBox: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
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
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
