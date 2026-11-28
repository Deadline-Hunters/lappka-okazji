import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { Button } from "./Button";
import { Card } from "./Card";
import type { IconName } from "./icons";

type Props = {
  title: string;
  message?: string;
  icon?: IconName;
  // danger - loading failed; the icon turns red.
  tone?: "default" | "danger";
  action?: { label: string; onPress: () => void };
  secondaryAction?: { label: string; onPress: () => void };
  // Wraps the message in a card (e.g. inside a scrolling profile section).
  card?: boolean;
  // Fills and centers in the available space (whole-screen states).
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Empty list or error message with an optional retry button.
export function EmptyState({
  title,
  message,
  icon,
  tone = "default",
  action,
  secondaryAction,
  card = false,
  fill = false,
  style,
}: Props) {
  const isDanger = tone === "danger";

  const content = (
    <>
      {icon ? (
        <View style={[styles.iconCircle, isDanger ? styles.iconDanger : null]}>
          <Ionicons
            name={icon}
            size={isDanger ? 40 : 32}
            color={isDanger ? colors.danger : colors.primary}
          />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? (
        <Button
          label={action.label}
          onPress={action.onPress}
          size="sm"
          style={styles.action}
        />
      ) : null}
      {secondaryAction ? (
        <Button
          label={secondaryAction.label}
          onPress={secondaryAction.onPress}
          variant="secondary"
        />
      ) : null}
    </>
  );

  if (card) {
    return (
      <Card elevation="sm" style={[styles.container, styles.card, style]}>
        {content}
      </Card>
    );
  }

  return (
    <View
      style={[styles.container, styles.plain, fill ? styles.fill : null, style]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  card: {
    padding: spacing.xl,
  },
  plain: {
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  fill: {
    flex: 1,
    backgroundColor: colors.background,
  },
  iconCircle: {
    width: 64,
    height: 64,
    marginBottom: spacing.xs,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  iconDanger: {
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  message: {
    maxWidth: 300,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.sm,
  },
});
