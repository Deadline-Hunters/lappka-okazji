import { useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";

import { authStyles } from "../authStyles";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleRegister() {
    console.log("Registration form data:", {
      email,
      password,
      confirmPassword,
    });
  }

  return (
    <Card elevation="sm" bordered={false} style={authStyles.formCard}>
      <TextField
        label="E-mail"
        icon="at-outline"
        placeholder="np. email@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label="Hasło"
        icon="lock-closed-outline"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        label="Powtórz hasło"
        icon="lock-closed-outline"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        label="Utwórz darmowe konto"
        icon="arrow-forward"
        iconPosition="end"
        size="lg"
        onPress={handleRegister}
        style={authStyles.submitButton}
      />
    </Card>
  );
}
