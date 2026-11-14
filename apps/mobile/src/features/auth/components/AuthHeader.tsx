import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";
import { authStyles } from "../authStyles";

export function AuthHeader() {
  return (
    <View style={authStyles.header}>
      <Text numberOfLines={1} style={authStyles.headerTitle}>
        Logowanie i rejestracja
      </Text>
      <View style={authStyles.headerSpacer} />
    </View>
  );
}
