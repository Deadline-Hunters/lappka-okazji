import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

type Props = {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

export function DealsTopBar({ onNotificationPress, onProfilePress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.appName}>Łappka Okazji</Text>
        <Text style={styles.subTitle}>Okazje</Text>
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
            size={22}
            color={colors.text}
          />
          <View style={styles.notificationDot} />
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
    // Przesunięcie lekko, żeby uwzględnić ikony po prawej i zbalansować layout
    paddingLeft: 44,
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
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.badgeDiscountBg,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
