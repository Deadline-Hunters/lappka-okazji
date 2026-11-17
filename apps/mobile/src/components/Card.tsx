import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, shadows, spacing } from "@/theme";

type Props = {
  children: ReactNode;
  // "lg" is for cards floating over the map; list cards use the default "md".
  elevation?: "none" | "sm" | "md" | "lg";
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
};

// White rounded surface used by list cards, form cards and empty states.
export function Card({
  children,
  elevation = "md",
  bordered = true,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        elevation === "none" ? null : shadows[elevation],
        bordered ? styles.bordered : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
