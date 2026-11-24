import { useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { supabase } from "@/lib/supabase";

import { authStyles } from "../authStyles";
import { authTexts } from "../authTexts";
import {
  isValidEmail,
  isValidPassword,
  isValidRegistrationAge,
  isValidUsername,
} from "../validation";

export function RegisterForm({
  onRegistered,
}: {
  onRegistered: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    const trimmedUsername = username.trim();
    if (!isValidEmail(email)) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.email);
      return;
    }
    if (!isValidUsername(trimmedUsername)) {
      Alert.alert(
        authTexts.alertTitles.checkData,
        authTexts.validation.username,
      );
      return;
    }
    if (!isValidRegistrationAge(age)) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.age);
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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { username: trimmedUsername, registration_age: Number(age) },
        },
      });
      if (error) throw error;
      if (data.session) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          authTexts.alertTitles.checkEmail,
          authTexts.notices.registrationConfirmation,
        );
        onRegistered(email.trim());
      }
    } catch (error) {
      console.error("Registration failed", error);
      Alert.alert(
        authTexts.alertTitles.registrationFailed,
        authTexts.errors.registration,
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
        placeholder={authTexts.fields.emailPlaceholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label={authTexts.fields.username}
        icon="person-outline"
        placeholder={authTexts.fields.usernamePlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={30}
        value={username}
        onChangeText={setUsername}
      />
      <TextField
        label={authTexts.fields.age}
        icon="calendar-outline"
        placeholder={authTexts.fields.agePlaceholder}
        keyboardType="number-pad"
        maxLength={3}
        value={age}
        onChangeText={setAge}
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
