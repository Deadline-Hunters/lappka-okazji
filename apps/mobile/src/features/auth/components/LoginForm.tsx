import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { authStyles } from "../authStyles";
import {
  EmailField,
  FieldLabel,
  PasswordField,
  SubmitButton,
} from "./AuthFormFields";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  function handleLogin() {
    console.log("Login form data:", { email, password, rememberMe });
  }

  return (
    <View style={authStyles.formCard}>
      <FieldLabel label="E-mail lub login" />
      <EmailField value={email} onChangeText={setEmail} />
      <PasswordField
        label="Hasło"
        value={password}
        onChangeText={setPassword}
      />

      <View style={authStyles.optionsRow}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}
          onPress={() => setRememberMe((checked) => !checked)}
          style={authStyles.remember}
        >
          <View
            style={[
              authStyles.checkbox,
              !rememberMe && authStyles.checkboxUnchecked,
            ]}
          >
            {rememberMe ? (
              <Ionicons name="checkmark" size={13} color="#FFFFFF" />
            ) : null}
          </View>
          <Text style={authStyles.secondaryText}>Zapamiętaj mnie</Text>
        </Pressable>
        <Pressable>
          <Text style={authStyles.link}>Nie pamiętasz hasła?</Text>
        </Pressable>
      </View>

      <SubmitButton label="Zaloguj się" onPress={handleLogin} />
    </View>
  );
}
