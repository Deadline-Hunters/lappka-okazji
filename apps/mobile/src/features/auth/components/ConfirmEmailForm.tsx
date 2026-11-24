import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { supabase } from "@/lib/supabase";

import { authErrorMessage } from "../authErrors";
import { authStyles } from "../authStyles";
import { authTexts } from "../authTexts";
import { isValidEmail } from "../validation";

export function ConfirmEmailForm({
  initialEmail,
  onBack,
}: {
  initialEmail: string;
  onBack: () => void;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function confirmEmail() {
    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      Alert.alert(
        authTexts.alertTitles.checkData,
        authTexts.validation.emailAndCode,
      );
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: "signup",
      });
      if (error) throw error;
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        authTexts.alertTitles.confirmEmailFailed,
        authErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function resendCode() {
    if (!isValidEmail(email)) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.email);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (error) throw error;
      Alert.alert(
        authTexts.alertTitles.checkEmail,
        authTexts.notices.confirmationCodeSent,
      );
    } catch (error) {
      Alert.alert(
        authTexts.alertTitles.sendCodeFailed,
        authErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card elevation="sm" bordered={false} style={authStyles.formCard}>
      <TextField
        label={authTexts.fields.email}
        icon="at-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label={authTexts.fields.confirmationCode}
        icon="key-outline"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />
      <Button
        label={authTexts.actions.confirmEmail}
        onPress={confirmEmail}
        loading={isLoading}
        size="lg"
        style={authStyles.submitButton}
      />
      <Button
        label={authTexts.actions.resendCode}
        variant="surface"
        onPress={resendCode}
        disabled={isLoading}
      />
      <Button
        label={authTexts.actions.backToLogin}
        variant="surface"
        onPress={onBack}
        disabled={isLoading}
      />
    </Card>
  );
}
