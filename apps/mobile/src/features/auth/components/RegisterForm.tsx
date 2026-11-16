import { useState } from "react";
import { View } from "react-native";

import { authStyles } from "../authStyles";
import {
  EmailField,
  FieldLabel,
  PasswordField,
  SubmitButton,
} from "./AuthFormFields";

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
    <View style={authStyles.formCard}>
      <FieldLabel label="E-mail" />
      <EmailField value={email} onChangeText={setEmail} />
      <PasswordField
        label="Hasło"
        value={password}
        onChangeText={setPassword}
      />
      <PasswordField
        label="Powtórz hasło"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <SubmitButton label="Utwórz darmowe konto" onPress={handleRegister} />
    </View>
  );
}
