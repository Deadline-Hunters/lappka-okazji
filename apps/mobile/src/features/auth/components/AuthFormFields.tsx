import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { colors } from "@/theme";
import { authStyles } from "../authStyles";

type FieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function FieldLabel({ label }: { label: string }) {
  return (
    <View style={authStyles.fieldLabelRow}>
      <Text style={authStyles.fieldLabel}>{label}</Text>
    </View>
  );
}

export function EmailField({ value, onChangeText }: FieldProps) {
  return (
    <View style={authStyles.inputWrapper}>
      <Ionicons name="at-outline" size={20} color={colors.textMuted} />
      <TextInput
        placeholder="np. email@gmail.com"
        placeholderTextColor={colors.outline}
        keyboardType="email-address"
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        style={authStyles.input}
      />
    </View>
  );
}

export function PasswordField({
  label,
  value,
  onChangeText,
}: FieldProps & { label: string }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <FieldLabel label={label} />
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
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          style={authStyles.input}
        />
        <Pressable
          accessibilityLabel="Pokaż lub ukryj hasło"
          accessibilityRole="button"
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
    </>
  );
}

export function SubmitButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        authStyles.primaryButton,
        pressed && authStyles.pressed,
      ]}
    >
      <Text style={authStyles.primaryButtonText}>{label}</Text>
      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
    </Pressable>
  );
}
