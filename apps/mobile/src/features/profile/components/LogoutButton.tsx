import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { spacing } from "@/theme";

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
      // After successful sign-out, navigate to the public map screen
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
    <Button
      label="Wyloguj się"
      icon="log-out-outline"
      variant="surface"
      onPress={handlePress}
      loading={isLoggingOut}
      style={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    marginTop: spacing.sm,
  },
});
