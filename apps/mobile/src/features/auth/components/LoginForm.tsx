import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import { TextField } from "@/components/TextField";

import { authStyles } from "../authStyles";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  function handleLogin() {
    console.log("Login form data:", { email, password, rememberMe });
  }

  return (
    <Card elevation="sm" bordered={false} style={authStyles.formCard}>
      <TextField
        label="E-mail lub login"
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
        autoComplete="current-password"
        value={password}
        onChangeText={setPassword}
      />

      <View style={authStyles.optionsRow}>
        <Checkbox
          label="Zapamiętaj mnie"
          checked={rememberMe}
          onChange={setRememberMe}
        />
        <Pressable accessibilityRole="button">
          <Text style={authStyles.link}>Nie pamiętasz hasła?</Text>
        </Pressable>
      </View>

      <Button
        label="Zaloguj się"
        icon="arrow-forward"
        iconPosition="end"
        size="lg"
        onPress={handleLogin}
        style={authStyles.submitButton}
      />
    </Card>
  );
}
