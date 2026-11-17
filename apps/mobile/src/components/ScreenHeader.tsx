import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, spacing } from "@/theme";

import { IconButton } from "./IconButton";

type Props = {
  title: string;
  // Shows a back arrow on the left.
  onBack?: () => void;
  // Custom left content when there is no back arrow.
  left?: ReactNode;
  // Actions on the right, e.g. a share IconButton.
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Sub-screen header from Figma (login, add deal, deal details): back arrow + title + actions.
// It doesn't add the safe-area inset - place it inside a SafeAreaView.
export function ScreenHeader({ title, onBack, left, right, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>
        {onBack ? (
          <IconButton
            icon="arrow-back"
            accessibilityLabel="Wróć"
            onPress={onBack}
            size="lg"
          />
        ) : (
          left
        )}
      </View>

      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>

      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  side: {
    minWidth: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    justifyContent: "flex-end",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
});
