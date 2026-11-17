import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, spacing } from "@/theme";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({ checked, onChange, label, style }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={8}
      style={[styles.row, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
    >
      <View style={[styles.box, checked ? styles.boxChecked : null]}>
        {checked ? (
          <Ionicons name="checkmark" size={13} color={colors.textInverse} />
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  box: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
  },
  boxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
