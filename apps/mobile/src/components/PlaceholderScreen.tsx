import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

type Props = {
  title: string;
  ticket: string;
};

// Tymczasowy ekran dla zakładek, które nie mają jeszcze implementacji.
export function PlaceholderScreen({ title, ticket }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>W przygotowaniu ({ticket})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
