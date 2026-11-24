import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { DealsInteractionProvider } from "@/features/deals/deals-interaction";
import { supabase } from "@/lib/supabase";
import { AuthSessionContext, GUEST_STORAGE_KEY } from "@/lib/auth-session";
import { PreferencesProvider } from "@/features/preferences/PreferencesProvider";

// Expo SDK 58 bug (expo/build/dom/webview-wrapper.js): on a DOM component's first render it sends
// props to the WebView before the native view exists and doesn't catch the rejected promise.
// Expo re-sends the props once loaded (DOM_READY), so nothing is lost - it's just dev noise.
LogBox.ignoreLogs(["DomWebView.injectJavaScript"]);

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <RootNavigator />
    </PreferencesProvider>
  );
}

function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setGuest = useCallback((value: boolean) => {
    setIsGuest(value);
    const write = value
      ? AsyncStorage.setItem(GUEST_STORAGE_KEY, "1")
      : AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    write.catch((error: unknown) =>
      console.error("Unable to persist guest mode", error),
    );
  }, []);
  const continueAsGuest = useCallback(() => setGuest(true), [setGuest]);
  const exitGuestMode = useCallback(() => setGuest(false), [setGuest]);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    // Hydrate the guest flag together with the session so the auth screen never flashes.
    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem(GUEST_STORAGE_KEY).catch(() => null),
    ])
      .then(([{ data, error }, guestFlag]) => {
        if (error) {
          throw error;
        }

        if (isMounted) {
          setSession(data.session);
          setIsGuest(guestFlag === "1" && !data.session);
          setIsLoading(false);
        }
      })
      .catch((error: unknown) => {
        console.error("Unable to load auth session", error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        if (session) {
          // A real sign-in replaces guest mode.
          setIsGuest(false);
          AsyncStorage.removeItem(GUEST_STORAGE_KEY).catch(() => undefined);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthRoute = segments[0] === "auth";

  // The auth listener commits `session` after signInWithPassword resolves, so navigate
  // from here once it is set instead of racing the state update in the sign-in caller.
  useEffect(() => {
    if (session && isAuthRoute) {
      router.replace("/(tabs)");
    }
  }, [session, isAuthRoute, router]);

  if (isLoading) {
    return null;
  }

  if (!session && !isGuest && !isAuthRoute) {
    return <Redirect href="/auth" />;
  }

  return (
    <AuthSessionContext.Provider
      value={{
        session,
        isGuest,
        continueAsGuest,
        exitGuestMode,
      }}
    >
      <DealsInteractionProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="deals/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="add-deal" options={{ headerShown: false }} />
        </Stack>
      </DealsInteractionProvider>
    </AuthSessionContext.Provider>
  );
}
