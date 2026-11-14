import { Stack } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authStyles } from "./authStyles";
import { AuthForm } from "./components/AuthForm";
import { AuthHeader } from "./components/AuthHeader";
import { AuthHero } from "./components/AuthHero";
import { AuthModeSwitch } from "./components/AuthModeSwitch";
import { AuthTerms } from "./components/AuthTerms";
import { SocialAuthButtons } from "./components/SocialAuthButtons";
import type { AuthMode } from "./types";

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");

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
            showsVerticalScrollIndicator={false}
          >
            <AuthHeader />
            <AuthHero />
            <AuthModeSwitch mode={mode} onChange={setMode} />
            <AuthForm mode={mode} />
            <SocialAuthButtons />
            <AuthTerms />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
