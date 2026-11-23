import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import type { IconName } from "@/components/icons";
import { colors, radius, spacing } from "@/theme";

type Props = {
  title: string;
  description?: string;
  icon: IconName;
  // Short note under the content, e.g. that a setting isn't used yet.
  footnote?: string;
  children: ReactNode;
};

// One group of settings in the Preferencje tab.
export function PreferenceCard({
  title,
  description,
  icon,
  footnote,
  children,
}: Props) {
  return (
    <Card elevation="sm" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={18} color={colors.primaryDark} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      </View>

      {children}

      {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  footnote: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
