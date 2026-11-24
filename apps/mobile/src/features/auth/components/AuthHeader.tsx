import { useState } from "react";
import { StyleSheet } from "react-native";

import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/ScreenHeader";
import { supabase } from "@/lib/supabase";
import { spacing } from "@/theme";

// First account from supabase/seed.sql, used only by this development shortcut.
const DEV_SEED_USER = {
  email: "kamil.seed@example.com",
  password: "password",
};

export function AuthHeader() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  // TODO(auth): Remove this development-only shortcut after the user auth flow is implemented.
  const handleDevSignIn = async () => {
    if (!__DEV__ || isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(DEV_SEED_USER);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("[AuthHeader] Dev sign-in failed", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <ScreenHeader
      title="Logowanie i rejestracja"
      left={
        __DEV__ && (
          <Button
            label="[DEV] Zaloguj"
            accessibilityLabel="Zaloguj jako użytkownik testowy Kamil"
            variant="secondary"
            size="sm"
            loading={isSigningIn}
            onPress={handleDevSignIn}
            style={styles.devSignIn}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  devSignIn: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
});
