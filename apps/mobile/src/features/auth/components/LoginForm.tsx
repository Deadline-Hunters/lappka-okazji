import { useRef, useState } from "react";
import { Alert, Pressable, Text } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { supabase } from "@/lib/supabase";

import { authStyles } from "../authStyles";
import { authErrorMessage } from "../authErrors";
import { authTexts } from "../authTexts";
import { isValidEmail } from "../validation";

export function LoginForm({ onConfirmEmail }: { onConfirmEmail: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = useRef(false);

  async function handleLogin() {
    if (!isValidEmail(email) || !password) {
      Alert.alert(authTexts.alertTitles.checkData, authTexts.validation.login);
      return;
    }
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (error) {
      Alert.alert(authTexts.alertTitles.loginFailed, authErrorMessage(error));
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
        autoComplete="current-password"
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        accessibilityRole="button"
        onPress={onConfirmEmail}
        style={authStyles.confirmEmailLink}
      >
        <Text style={authStyles.link}>{authTexts.actions.confirmEmail}</Text>
      </Pressable>

      <Button
        label={authTexts.actions.login}
        icon="arrow-forward"
        iconPosition="end"
        size="lg"
        onPress={handleLogin}
        loading={isLoading}
        style={authStyles.submitButton}
      />
    </Card>
  );
}
