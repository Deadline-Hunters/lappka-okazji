import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

type Step = 1 | 2 | 3;

type Props = {
  currentStep: Step;
};

const STEPS = [
  { step: 1, label: "Szczegóły" },
  { step: 2, label: "Lokalizacja" },
  { step: 3, label: "Publikacja" },
] as const;

export function StepIndicator({ currentStep }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {STEPS.map((item, index) => {
          const isActive = item.step === currentStep;
          const isDone = item.step < currentStep;

          return (
            <View key={item.step} style={styles.stepItem}>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.circle,
                    isDone && styles.circleDone,
                    isActive && styles.circleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.circleText,
                      (isActive || isDone) && styles.circleTextActive,
                    ]}
                  >
                    {isDone ? "✓" : item.step}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isDone && styles.stepLabelDone,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>

              {index < STEPS.length - 1 && (
                <View
                  style={[styles.connector, isDone && styles.connectorDone]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    backgroundColor: colors.primary,
  },
  circleDone: {
    backgroundColor: colors.accent,
  },
  circleText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  circleTextActive: {
    color: colors.textInverse,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: "700",
  },
  stepLabelDone: {
    color: colors.textMuted,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  connectorDone: {
    backgroundColor: colors.accent,
  },
});
