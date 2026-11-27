import { Alert, Platform, StyleSheet } from "react-native";

import { Button } from "@/components/Button";
import { useAuthSession } from "@/lib/auth-session";
import { spacing } from "@/theme";

export function LogoutButton() {
  const { signOut } = useAuthSession();

  const handlePress = () => {
    const message =
      "Czy na pewno chcesz się wylogować? Lokalne dane aplikacji, w tym preferencje, zostaną usunięte.";
    if (Platform.OS === "web") {
      if (globalThis.confirm(message)) signOut();
      return;
    }

    Alert.alert(
      "Wylogowanie",
      message,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wyloguj",
          style: "destructive",
          onPress: signOut,
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
