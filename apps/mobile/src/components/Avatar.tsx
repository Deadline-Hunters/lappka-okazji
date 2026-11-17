import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius } from "@/theme";

type Props = {
  uri?: string | null;
  // Used for the initials fallback and the accessibility label.
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Round user picture. Falls back to initials, then to a person icon, when there is no image.
export function Avatar({ uri, name, size = 36, style }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name ? initialsOf(name) : "";
  const showImage = Boolean(uri) && !imageFailed;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        showImage ? null : styles.fallback,
        style,
      ]}
    >
      {showImage && uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          onError={() => setImageFailed(true)}
          accessibilityLabel={name ? `Zdjęcie profilowe: ${name}` : undefined}
        />
      ) : initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color={colors.primaryDark} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.pill,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    backgroundColor: colors.primarySoft,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontWeight: "700",
    color: colors.primaryDark,
  },
});
