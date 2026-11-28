import { useRef, useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { supabase } from "@/lib/supabase";
import { Alert } from "@/lib/alert";

import { authStyles } from "../authStyles";
import { authErrorMessage } from "../authErrors";
import { authTexts } from "../authTexts";
import { isValidEmail, isValidPassword } from "../validation";

export function RegisterForm({
  onRegistered,
}: {
  onRegistered: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = useRef(false);

  async function handleRegister() {
    if (!isValidEmail(email)) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.email);
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert(
        authTexts.alertTitles.checkData,
        authTexts.validation.password,
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        authTexts.alertTitles.checkData,
        authTexts.validation.passwordsMismatch,
      );
      return;
    }
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      if (data.session) {
        return;
      }

      Alert.alert(
        authTexts.alertTitles.checkEmail,
        authTexts.notices.registrationConfirmation,
      );
      onRegistered(email.trim());
    } catch (error) {
      Alert.alert(
        authTexts.alertTitles.registrationFailed,
        authErrorMessage(error),
      );
    } finally {
      isSubmitting.current = false;
      setIsLoading(false);
    }
  }

  return (
    <Card elevation="sm" bordered={false} style={authStyles.formCard}>
      <TextField
        label={authTexts.fields.email}
        icon="at-outline"
        placeholder={authTexts.fields.emailPlaceholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label={authTexts.fields.password}
        icon="lock-closed-outline"
        placeholder={authTexts.fields.passwordPlaceholder}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        label={authTexts.fields.confirmPassword}
        icon="lock-closed-outline"
        placeholder={authTexts.fields.passwordPlaceholder}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        label={authTexts.actions.register}
        icon="arrow-forward"
        iconPosition="end"
        size="lg"
        onPress={handleRegister}
        loading={isLoading}
        style={authStyles.submitButton}
      />
    </Card>
  );
}
