import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { supabase } from "@/lib/supabase";
import { colors, radius, spacing } from "@/theme";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const performSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(
          "Błąd wylogowania",
          error.message || "Nie udało się wylogować. Spróbuj ponownie.",
        );
        return;
      }
      // Po pomyślnym wylogowaniu przechodzimy do głównego ekranu publicznego (Mapa)
      router.replace("/(tabs)");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Wystąpił nieoczekiwany błąd podczas wylogowywania.";
      Alert.alert("Błąd wylogowania", message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handlePress = () => {
    if (isLoggingOut) {
      return;
    }

    Alert.alert(
      "Wylogowanie",
      "Czy na pewno chcesz się wylogować z aplikacji?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wyloguj",
          style: "destructive",
          onPress: performSignOut,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isLoggingOut && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={isLoggingOut}
      accessibilityRole="button"
      accessibilityLabel="Wyloguj się"
    >
      {isLoggingOut ? (
        <ActivityIndicator size="small" color={colors.textMuted} />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={18} color={colors.textMuted} />
          <Text style={styles.text}>Wyloguj się</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "center",
    marginTop: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: "#F9F8FC",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
