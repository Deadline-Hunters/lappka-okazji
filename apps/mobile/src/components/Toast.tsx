import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

import { colors, radius, spacing } from "@/theme";

type Props = {
  /** Message to display. A null value hides the toast. */
  message: string | null;
  /** Called after the toast has faded out. */
  onHide: () => void;
  /** How long the toast stays visible, in milliseconds. */
  durationMs?: number;
};

export function Toast({ message, onHide, durationMs = 1800 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;

    opacity.stopAnimation();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onHide();
      });
    }, durationMs);

    return () => {
      clearTimeout(timer);
      opacity.stopAnimation();
    };
  }, [message, durationMs, opacity, onHide]);

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons name="checkmark-circle" size={16} color={colors.textInverse} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: spacing.xl,
    alignSelf: "center",
    maxWidth: "90%",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.neutralDark,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textInverse,
  },
});
