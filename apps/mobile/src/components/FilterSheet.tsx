import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, spacing } from "@/theme";

import { Chip, type ChipOption } from "./FilterChips";
import { IconButton } from "./IconButton";

type Props<T extends string> = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly ChipOption<T>[];
  selected: T;
  // The sheet closes itself after a pick.
  onSelect: (id: T) => void;
};

// Bottom sheet with every filter option, opened by the search bar's "Filtry" button.
// The chip row under the search bar shows only the most common options.
export function FilterSheet<T extends string>({
  visible,
  onClose,
  title,
  options,
  selected,
  onSelect,
}: Props<T>) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Zamknij filtry"
        />

        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}
        >
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
            <IconButton
              icon="close"
              variant="muted"
              size="sm"
              onPress={onClose}
              accessibilityLabel="Zamknij filtry"
            />
          </View>

          <View style={styles.options} accessibilityRole="radiogroup">
            {options.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                icon={option.icon}
                emoji={option.emoji}
                selected={option.id === selected}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: colors.backdrop,
  },
  sheet: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
