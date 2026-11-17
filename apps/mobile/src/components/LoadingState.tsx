import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

type Props = {
  message?: string;
  // Fills and centers in the available space (whole-screen loading).
  fill?: boolean;
};

export function LoadingState({ message, fill = false }: Props) {
  return (
    <View
      style={[styles.container, fill ? styles.fill : null]}
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? "Ładowanie"}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl * 2,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  fill: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
