import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/theme";

type Props = {
  // Screen name shown under the app name, e.g. "Mapa".
  title: string;
};

// Main tab header: app name + screen name.
// Rendered for every tab by `app/(tabs)/_layout.tsx`, so screens don't add their own top bar.
// The avatar and notifications bell from Figma are left out until real profiles
// (KAN-4/KAN-16) and push notifications (KAN-22) exist.
export function AppHeader({ title }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={styles.appName} accessibilityRole="header">
        Łappka Okazji
      </Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
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
});
