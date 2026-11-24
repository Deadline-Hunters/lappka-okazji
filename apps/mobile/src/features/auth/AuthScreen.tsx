import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAuthSession } from "@/lib/auth-session";
import { SegmentedControl } from "@/components/SegmentedControl";

import { authStyles } from "./authStyles";
import { AuthForm } from "./components/AuthForm";
import { AuthHeader } from "./components/AuthHeader";
import { AuthHero } from "./components/AuthHero";
import { AuthTerms } from "./components/AuthTerms";
import { ConfirmEmailForm } from "./components/ConfirmEmailForm";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { SocialAuthButtons } from "./components/SocialAuthButtons";
import { AUTH_MODES, type AuthMode } from "./types";

type AuthFlow = "auth" | "reset" | "confirm";
export function AuthScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<AuthMode>(
    params.mode === "register" ? "register" : "login",
  );
  const [flow, setFlow] = useState<AuthFlow>("auth");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const { continueAsGuest } = useAuthSession();
  const router = useRouter();

  function renderSwitch(param: AuthFlow) {
    switch (param) {
      case "reset":
        return <ResetPasswordForm onBack={() => setFlow("auth")} />;
      case "confirm":
        return (
          <ConfirmEmailForm
            initialEmail={confirmationEmail}
            onBack={() => {
              setMode("login");
              setFlow("auth");
            }}
          />
        );

      case "auth":
        return (
          <>
            <SegmentedControl
              options={AUTH_MODES}
              value={mode}
              onChange={setMode}
              tone="primary"
              style={authStyles.modeSwitch}
            />
            <AuthForm
              mode={mode}
              onForgotPassword={() => setFlow("reset")}
              onConfirmEmail={() => {
                setConfirmationEmail("");
                setFlow("confirm");
              }}
              onRegistered={(email) => {
                setConfirmationEmail(email);
                setFlow("confirm");
              }}
            />
            <SocialAuthButtons />
            <Button
              label="Kontynuuj jako gość"
              variant="tonal"
              onPress={() => {
                continueAsGuest();
                router.replace("/(tabs)");
              }}
              style={authStyles.guestButton}
            />
          </>
        );
      default:
        return "Bad form param";
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={authStyles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={authStyles.flex}
        >
          <ScrollView
            contentContainerStyle={authStyles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <AuthHeader />
            <AuthHero />
            {renderSwitch(flow)}
            <AuthTerms />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
