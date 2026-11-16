import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";
import { authStyles } from "../authStyles";
import type { AuthMode } from "../types";

type Props = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export function AuthModeSwitch({ mode, onChange }: Props) {
  return (
    <View style={authStyles.modeSwitch}>
      <ModeButton
        icon="log-in-outline"
        label="Zaloguj się"
        active={mode === "login"}
        onPress={() => onChange("login")}
      />
      <ModeButton
        icon="person-add-outline"
        label="Zarejestruj się"
        active={mode === "register"}
        onPress={() => onChange("register")}
      />
    </View>
  );
}

function ModeButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[authStyles.modeButton, active && authStyles.modeButtonActive]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? "#FFFFFF" : colors.textMuted}
      />
      <Text style={[authStyles.modeText, active && authStyles.modeTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}
