import { StyleSheet, View } from "react-native";

import { Chip } from "@/components/FilterChips";
import { CATEGORIES, type DealCategory } from "@/features/deals/types";
import { spacing } from "@/theme";

import { PREFERENCE_CATEGORY_IDS } from "../types";
import { PreferenceCard } from "./PreferenceCard";

type Props = {
  selected: readonly DealCategory[];
  onChange: (categories: DealCategory[]) => void;
};

export function FavoriteCategoriesCard({ selected, onChange }: Props) {
  const toggle = (category: DealCategory) => {
    onChange(
      selected.includes(category)
        ? selected.filter((id) => id !== category)
        : [...selected, category],
    );
  };

  const footnote =
    selected.length === 0
      ? "Nie wybrano kategorii, więc pokazujemy wszystkie okazje."
      : `Wybrane: ${selected.length}.`;

  return (
    <PreferenceCard
      title="Ulubione kategorie"
      description="Domyślny filtr „Ulubione” na mapie."
      icon="heart-outline"
      footnote={footnote}
    >
      <View style={styles.chips}>
        {PREFERENCE_CATEGORY_IDS.map((id) => (
          <Chip
            key={id}
            label={CATEGORIES[id].label}
            emoji={CATEGORIES[id].emoji}
            selected={selected.includes(id)}
            selectionRole="checkbox"
            onPress={() => toggle(id)}
          />
        ))}
      </View>
    </PreferenceCard>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
