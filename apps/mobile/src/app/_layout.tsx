import {
  Redirect,
  Stack,
  useGlobalSearchParams,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, LogBox, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { DealsInteractionProvider } from "@/features/deals/deals-interaction";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { supabase } from "@/lib/supabase";
import { AuthSessionContext, GUEST_STORAGE_KEY } from "@/lib/auth-session";
import {
  createAuthReturnController,
  getReturnPath,
  type ReturnPath,
} from "@/lib/auth-navigation";
import { createTokenRefreshController } from "@/lib/token-refresh";
import { PreferencesProvider } from "@/features/preferences/PreferencesProvider";

// Expo SDK 58 bug (expo/build/dom/webview-wrapper.js): on a DOM component's first render it sends
// props to the WebView before the native view exists and doesn't catch the rejected promise.
// Expo re-sends the props once loaded (DOM_READY), so nothing is lost - it's just dev noise.
LogBox.ignoreLogs(["DomWebView.injectJavaScript"]);

const tokenRefresh = createTokenRefreshController(
  {
    async startAutoRefresh() {
      await supabase.auth.initialize();
      await supabase.auth.startAutoRefresh();
    },
    async stopAutoRefresh() {
      await supabase.auth.initialize();
      await supabase.auth.stopAutoRefresh();
    },
  },
  () => console.error("Unable to update auth token auto-refresh"),
);

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
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

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
  const pathname = usePathname();
  const { returnTo } = useGlobalSearchParams<{ returnTo?: string }>();
  const [authReturn] = useState(createAuthReturnController);
  const openAuth = useCallback(
    (returnPath: ReturnPath, mode?: "login" | "register") => {
      authReturn.markOpened();
      router.push({
        pathname: "/auth",
        params: { returnTo: returnPath, ...(mode ? { mode } : {}) },
      });
    },
    [authReturn, router],
  );
  const returnFromAuth = useCallback(
    (returnPath: unknown) => {
      authReturn.returnFromAuth(router, returnPath);
    },
    [authReturn, router],
  );

  useEffect(() => {
    if (Platform.OS === "web") return;

    function updateAutoRefresh(state: string | null | undefined) {
      void tokenRefresh.update(state);
    }

    const subscription = AppState.addEventListener("change", updateAutoRefresh);
    updateAutoRefresh(AppState.currentState);
    return () => {
      subscription.remove();
      void tokenRefresh.update(null);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let authChanged = false;
    setIsLoading(true);
    setLoadError(false);

    // Hydrate the guest flag together with the session so the auth screen never flashes.
    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem(GUEST_STORAGE_KEY),
    ])
      .then(([{ data, error }, guestFlag]) => {
        if (error) {
          throw error;
        }

        if (isMounted) {
          if (!authChanged) {
            setSession(data.session);
            setIsGuest(guestFlag === "1" && !data.session);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        console.error("Unable to load auth session or guest mode");
        if (isMounted) {
          setLoadError(true);
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        if (event === "INITIAL_SESSION") return;
        authChanged = true;
        setSession(session);
        if (session) {
          // A real sign-in replaces guest mode.
          setIsGuest(false);
          AsyncStorage.removeItem(GUEST_STORAGE_KEY).catch(() =>
            console.error("Unable to clear guest mode"),
          );
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadAttempt]);

  const isAuthRoute = segments[0] === "auth";

  useEffect(() => {
    if (!isAuthRoute) {
      authReturn.clear();
    } else if (session && !isLoading && !loadError) {
      returnFromAuth(returnTo);
    }
  }, [
    session,
    isAuthRoute,
    isLoading,
    loadError,
    returnTo,
    returnFromAuth,
    authReturn,
  ]);

  if (isLoading) {
    return <LoadingState message="Ładowanie sesji..." fill />;
  }

  if (loadError) {
    return (
      <EmptyState
        fill
        tone="danger"
        icon="alert-circle-outline"
        title="Nie udało się wczytać sesji"
        message="Sprawdź połączenie i spróbuj ponownie."
        action={{
          label: "Spróbuj ponownie",
          onPress: () => setLoadAttempt((attempt) => attempt + 1),
        }}
      />
    );
  }

  if (!session && !isGuest && !isAuthRoute) {
    return (
      <Redirect
        href={{
          pathname: "/auth",
          params: { returnTo: getReturnPath(pathname) },
        }}
      />
    );
  }

  return (
    <AuthSessionContext.Provider
      value={{
        session,
        isGuest,
        continueAsGuest,
        exitGuestMode,
        openAuth,
        returnFromAuth,
      }}
    >
      <DealsInteractionProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="deals/[id]" options={{ headerShown: false }} />
        </Stack>
      </DealsInteractionProvider>
    </AuthSessionContext.Provider>
  );
}
