import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

type Props = {
  subtitle: string;
  onProfilePress?: () => void;
};

export function AppTopBar({ subtitle, onProfilePress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.appName}>Łappka Okazji</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  titleWrapper: {
    alignItems: "center",
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
  avatarButton: {
    position: "absolute",
    right: 0,
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
