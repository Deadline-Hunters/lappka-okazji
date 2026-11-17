import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

import { colors, radius, shadows, spacing } from "@/theme";

type Props = Omit<
  TextInputProps,
  "style" | "value" | "onChangeText" | "placeholder"
> & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  // Shows the "Filtry" button on the right when set.
  onFilterPress?: () => void;
  // Stronger shadow and no border - for a search bar floating over the map.
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SEARCH_BAR_HEIGHT = 48;

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onFilterPress,
  elevated = false,
  style,
  accessibilityLabel,
  ...inputProps
}: Props) {
  return (
    <View
      style={[
        styles.container,
        elevated ? styles.elevated : styles.flat,
        style,
      ]}
    >
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        {...inputProps}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Wyczyść wyszukiwanie"
        >
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
      {onFilterPress ? (
        <Pressable
          onPress={onFilterPress}
          hitSlop={8}
          style={styles.filterButton}
          accessibilityRole="button"
          accessibilityLabel="Filtry"
        >
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SEARCH_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  flat: {
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  elevated: {
    ...shadows.lg,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: colors.text,
  },
  filterButton: {
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
});
