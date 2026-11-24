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
import { isValidEmail, isValidPassword } from "../validation";

export function ResetPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function sendCode() {
    if (!isValidEmail(email)) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.email);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setCodeSent(true);
      Alert.alert(
        authTexts.alertTitles.checkEmail,
        authTexts.notices.recoveryCodeSent,
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

  async function changePassword() {
    if (!verified && !/^\d{6}$/.test(code)) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.code);
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

    setIsLoading(true);
    try {
      if (!verified) {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: code,
          type: "recovery",
        });
        if (error) throw error;
        setVerified(true);
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      Alert.alert(
        authTexts.alertTitles.passwordChanged,
        authTexts.notices.passwordChanged,
      );
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        authTexts.alertTitles.changePasswordFailed,
        authErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function goBack() {
    if (!verified) {
      onBack();
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onBack();
    } catch (error) {
      Alert.alert(authTexts.alertTitles.logoutFailed, authErrorMessage(error));
    } finally {
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
        editable={!codeSent}
        value={email}
        onChangeText={setEmail}
      />
      {codeSent ? (
        <>
          {!verified ? (
            <TextField
              label={authTexts.fields.recoveryCode}
              icon="key-outline"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
          ) : null}
          <TextField
            label={authTexts.fields.newPassword}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
          <TextField
            label={authTexts.fields.confirmNewPassword}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </>
      ) : null}
      <Button
        label={
          codeSent
            ? authTexts.actions.changePassword
            : authTexts.actions.sendCode
        }
        onPress={codeSent ? changePassword : sendCode}
        loading={isLoading}
        size="lg"
        style={authStyles.submitButton}
      />
      {codeSent && !verified ? (
        <Button
          label={authTexts.actions.resendCode}
          variant="surface"
          onPress={sendCode}
          disabled={isLoading}
        />
      ) : null}
      <Button
        label={authTexts.actions.backToLogin}
        variant="surface"
        onPress={goBack}
        disabled={isLoading}
      />
    </Card>
  );
}
