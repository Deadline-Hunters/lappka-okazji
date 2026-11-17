import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import type { IconName } from "./icons";

type Props = Omit<TextInputProps, "style"> & {
  label?: string;
  // Short note on the right of the label, e.g. "opcjonalnie".
  hint?: string;
  icon?: IconName;
  // Shown under the field in red; also marks the field as invalid.
  error?: string | null;
  // Shows an "x" that clears the field.
  clearable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

// Labelled text input for forms. With `secureTextEntry` it gets a show/hide password toggle.
export function TextField({
  label,
  hint,
  icon,
  error,
  clearable = false,
  containerStyle,
  secureTextEntry,
  value,
  onChangeText,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);
  const isSecret = Boolean(secureTextEntry);
  const showClear = clearable && !isSecret && Boolean(value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label || hint ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          focused ? styles.inputFocused : null,
          error ? styles.inputError : null,
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={20} color={colors.textMuted} />
        ) : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.outline}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecret && !secretVisible}
          accessibilityLabel={accessibilityLabel ?? label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {isSecret ? (
          <Pressable
            onPress={() => setSecretVisible((visible) => !visible)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={secretVisible ? "Ukryj hasło" : "Pokaż hasło"}
          >
            <Ionicons
              name={secretVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
        {showClear ? (
          <Pressable
            onPress={() => onChangeText?.("")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Wyczyść pole"
          >
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  inputWrapper: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.surfaceContainerLow,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 14,
    color: colors.text,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
  },
});
