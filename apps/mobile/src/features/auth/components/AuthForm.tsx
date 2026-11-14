import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { colors } from "@/theme";
import { authStyles } from "../authStyles";
import type { AuthMode } from "../types";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isLogin = mode === "login";

  return (
    <View style={authStyles.formCard}>
      <FieldLabel label="E-mail lub login" hint="np. uczelniany" />
      <Input
        icon="at-outline"
        placeholder="np. student@uj.edu.pl"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FieldLabel label="Hasło" />
      <View style={authStyles.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={colors.textMuted}
        />
        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colors.outline}
          secureTextEntry={!passwordVisible}
          style={authStyles.input}
        />
        <Pressable
          accessibilityLabel="Pokaż lub ukryj hasło"
          hitSlop={8}
          onPress={() => setPasswordVisible((visible) => !visible)}
        >
          <Ionicons
            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={authStyles.optionsRow}>
        <Pressable style={authStyles.remember}>
          <View style={authStyles.checkbox}>
            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
          </View>
          <Text style={authStyles.secondaryText}>Zapamiętaj mnie</Text>
        </Pressable>
        <Pressable>
          <Text style={authStyles.link}>Nie pamiętasz hasła?</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          authStyles.primaryButton,
          pressed && authStyles.pressed,
        ]}
      >
        <Text style={authStyles.primaryButtonText}>
          {isLogin ? "Zaloguj się" : "Utwórz darmowe konto"}
        </Text>
        <Ionicons
          name={isLogin ? "arrow-forward" : "sparkles-outline"}
          size={20}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <View style={authStyles.fieldLabelRow}>
      <Text style={authStyles.fieldLabel}>{label}</Text>
      {hint ? <Text style={authStyles.fieldHint}>{hint}</Text> : null}
    </View>
  );
}

function Input({
  icon,
  ...props
}: { icon: keyof typeof Ionicons.glyphMap } & React.ComponentProps<
  typeof TextInput
>) {
  return (
    <View style={authStyles.inputWrapper}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <TextInput
        {...props}
        placeholderTextColor={colors.outline}
        style={authStyles.input}
      />
    </View>
  );
}
