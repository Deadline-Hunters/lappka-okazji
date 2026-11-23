import { useRouter } from "expo-router";
import { createContext, useCallback, useContext } from "react";
import { Alert } from "react-native";
import type { Session } from "@supabase/supabase-js";

type AuthSessionContextValue = {
  session: Session | null;
  activateDevelopmentFlow: () => void;
  isDevelopmentFlow: boolean;
  // Browse-only mode: no account, persisted so the app opens straight to the tabs.
  isGuest: boolean;
  continueAsGuest: () => void;
  exitGuestMode: () => void;
};

export const GUEST_STORAGE_KEY = "lappka:auth:guest";

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(
  null,
);

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionContext");
  }

  return context;
}

// Guards actions that need an account. Returns true when the user may proceed;
// guests get a prompt to sign in and false.
export function useRequireAccount() {
  const { isGuest, exitGuestMode } = useAuthSession();
  const router = useRouter();

  return useCallback((): boolean => {
    if (!isGuest) {
      return true;
    }

    Alert.alert(
      "Ta akcja wymaga konta",
      "Zaloguj się, aby głosować, dodawać okazje i zbierać Łappsy.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Zaloguj się",
          onPress: () => {
            exitGuestMode();
            router.replace("/auth");
          },
        },
      ],
    );
    return false;
  }, [isGuest, exitGuestMode, router]);
}
