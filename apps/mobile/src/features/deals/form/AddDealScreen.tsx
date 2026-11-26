import { router, Stack } from "expo-router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Toast } from "@/components/Toast";
import { useAuthSession, useRequireAccount } from "@/lib/auth-session";
import { colors, spacing } from "@/theme";

import { Step1Details } from "./Step1Details";
import { Step2Location } from "./Step2Location";
import { Step3Publish } from "./Step3Publish";
import { StepIndicator } from "./StepIndicator";
import { submitDeal } from "../services/dealSubmissionService";
import {
  INITIAL_FORM_DATA,
  validateAll,
  validateStep1,
  validateStep2,
  type DealFormData,
  type DealFormErrors,
} from "../validation/dealFormValidation";

type Step = 1 | 2 | 3;

export function AddDealScreen() {
  const { session } = useAuthSession();
  const requireAccount = useRequireAccount();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<DealFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<DealFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  // Scroll to top when changing steps
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentStep]);

  // Check if user has entered any data (to confirm before abandoning form)
  const isDirty =
    formData.title.trim() !== "" ||
    formData.category !== null ||
    formData.imageUri !== null ||
    formData.description.trim() !== "";

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      return;
    }

    if (isDirty) {
      Alert.alert(
        "Opuścić formularz?",
        "Wprowadzone dane nie zostały jeszcze opublikowane i zostaną utracone.",
        [
          { text: "Zostań", style: "cancel" },
          {
            text: "Opuść",
            style: "destructive",
            onPress: () => router.back(),
          },
        ],
      );
    } else {
      router.back();
    }
  }, [currentStep, isDirty]);

  // Handle hardware Android back button
  useEffect(() => {
    if (Platform.OS === "web") return;

    const onBackPress = () => {
      handleBack();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => subscription.remove();
  }, [handleBack]);

  const updateFormData = (updates: Partial<DealFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear field-level errors when field is updated
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(updates).forEach((k) => {
        delete next[k as keyof DealFormErrors];
      });
      return next;
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const validation = validateStep1(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const validation = validateStep2(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
      setCurrentStep(3);
      return;
    }
  };

  const handleSubmit = async () => {
    if (!requireAccount()) return;

    const fullValidation = validateAll(formData);
    if (!fullValidation.isValid) {
      setErrors(fullValidation.errors);
      Alert.alert(
        "Błąd formularza",
        "Popraw zaznaczone pola przed publikacją okazji.",
      );
      return;
    }

    // Non-guests always have a session here (the root layout redirects others to /auth).
    const userId = session?.user.id;
    if (!userId) return;

    try {
      setIsSubmitting(true);

      await submitDeal(formData, userId);

      setToastMessage("Okazja została pomyślnie opublikowana!");

      setTimeout(() => {
        router.replace("/(tabs)/deals");
      }, 1500);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Wystąpił nieoczekiwany błąd podczas publikacji okazji.";
      Alert.alert("Nie udało się opublikować okazji", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScreenHeader
          title="Dodaj okazję"
          onBack={handleBack}
          right={
            <Badge
              label={`Krok ${currentStep} z 3`}
              tone="primary"
              size="md"
              style={styles.stepCounter}
            />
          }
        />

        <StepIndicator currentStep={currentStep} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {currentStep === 1 && (
              <Step1Details
                data={formData}
                errors={errors}
                onChange={updateFormData}
              />
            )}

            {currentStep === 2 && (
              <Step2Location
                data={formData}
                errors={errors}
                onChange={updateFormData}
              />
            )}

            {currentStep === 3 && (
              <Step3Publish
                data={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onChange={updateFormData}
                onSubmit={handleSubmit}
              />
            )}

            {/* Dolne przyciski nawigacji kroków */}
            <View style={styles.navigationRow}>
              {currentStep > 1 ? (
                <Button
                  variant="surface"
                  size="lg"
                  icon="arrow-back"
                  label="Wstecz"
                  onPress={handleBack}
                  disabled={isSubmitting}
                  style={styles.navButton}
                />
              ) : null}

              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  size="lg"
                  icon="arrow-forward"
                  iconPosition="end"
                  label="Dalej"
                  onPress={handleNext}
                  style={styles.navButton}
                />
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {toastMessage && (
          <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.lg,
  },
  stepCounter: {
    marginRight: spacing.sm,
  },
  navigationRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  navButton: {
    flex: 1,
  },
});
