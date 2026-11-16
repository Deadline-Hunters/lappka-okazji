import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";
import { authStyles } from "../authStyles";

export function SocialAuthButtons() {
  return (
    <>
      <View style={authStyles.divider}>
        <View style={authStyles.dividerLine} />
        <Text style={authStyles.dividerText}>LUB KONTYNUUJ PRZEZ</Text>
        <View style={authStyles.dividerLine} />
      </View>
      <View style={authStyles.socialRow}>
        <SocialButton icon="logo-google" label="Google" />
        <SocialButton icon="logo-apple" label="Apple" dark />
      </View>
    </>
  );
}

function SocialButton({
  icon,
  label,
  dark = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  dark?: boolean;
}) {
  return (
    <Pressable
      style={[authStyles.socialButton, dark && authStyles.socialButtonDark]}
    >
      <Ionicons name={icon} size={18} color={dark ? "#FFFFFF" : colors.text} />
      <Text style={[authStyles.socialText, dark && authStyles.socialTextDark]}>
        {label}
      </Text>
    </Pressable>
  );
}
