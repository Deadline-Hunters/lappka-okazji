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
import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { DealsInteractionProvider } from "@/features/deals/deals-interaction";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { authStorageKey, supabase } from "@/lib/supabase";
import { sessionStorage } from "@/lib/session-storage";
import { AuthSessionContext, GUEST_STORAGE_KEY } from "@/lib/auth-session";
import {
  createAuthReturnController,
  getReturnPath,
  type ReturnPath,
} from "@/lib/auth-navigation";
import { createTokenRefreshController } from "@/lib/token-refresh";
import {
  appStorageKeys,
  authStorageKeys,
  clearApplicationSession,
  clearLocalApplicationData,
  LOGOUT_PENDING_KEY,
  RESET_PENDING,
  resetLocalSession,
  SESSION_OWNER_KEY,
  withoutCleanupMarkers,
} from "@/lib/logout";
import { PreferencesProvider } from "@/features/preferences/PreferencesProvider";
import { preferencesService } from "@/features/preferences/services/preferencesService";

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
  return <RootNavigator />;
}

function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [logoutState, setLogoutState] = useState<
    "idle" | "running" | "failed" | "server-warning" | "complete"
  >("idle");
  const logoutRunning = useRef(false);
  const cleanupMode = useRef<"signout" | "local" | "reset">("signout");
  const serverSignOutFailed = useRef(false);

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
  const cleanupLocalData = useCallback(() => {
    return clearLocalApplicationData({
      waitForWrites: () => preferencesService.waitForPendingWrites(),
      clearStorage: async () => {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(
          withoutCleanupMarkers(
            Platform.OS === "web" ? appStorageKeys(keys) : keys,
          ),
        );
      },
      clearMarkers: () =>
        AsyncStorage.multiRemove([SESSION_OWNER_KEY, LOGOUT_PENDING_KEY]),
    });
  }, []);
  const startCleanup = useCallback(
    (mode: "signout" | "local" | "reset") => {
      if (logoutRunning.current) return;
      logoutRunning.current = true;
      cleanupMode.current = mode;
      setLogoutState("running");
      const cleanup =
        mode === "reset"
          ? resetLocalSession({
              markPending: () =>
                AsyncStorage.setItem(LOGOUT_PENDING_KEY, RESET_PENDING),
              clearStoredSession: async () => {
                await supabase.auth.initialize();
                const keys = authStorageKeys(
                  await AsyncStorage.getAllKeys(),
                  authStorageKey,
                );
                for (const key of keys) {
                  await sessionStorage.removeItem(key);
                }
              },
              clearLocalData: cleanupLocalData,
            })
          : mode === "signout"
            ? clearApplicationSession({
                markPending: () =>
                  AsyncStorage.setItem(LOGOUT_PENDING_KEY, "1"),
                signOut: async () => {
                  const result = await supabase.auth.signOut();
                  serverSignOutFailed.current ||= Boolean(result.error);
                  return result;
                },
                getSession: () => supabase.auth.getSession(),
                clearLocalData: cleanupLocalData,
              })
            : cleanupLocalData();
      void cleanup
        .then(() => {
          setSession(null);
          setIsGuest(false);
          setLoadError(false);
          authReturn.clear();
          if (mode === "reset") serverSignOutFailed.current = true;
          setLogoutState(
            serverSignOutFailed.current ? "server-warning" : "complete",
          );
        })
        .catch(() => {
          console.error("Unable to sign out or clear local application data");
          setLogoutState("failed");
        })
        .finally(() => {
          logoutRunning.current = false;
        });
    },
    [authReturn, cleanupLocalData],
  );
  const signOut = useCallback(() => startCleanup("signout"), [startCleanup]);
  const resetSession = useCallback(() => startCleanup("reset"), [startCleanup]);
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

    // Check unfinished cleanup before asking Supabase to restore a session.
    Promise.all([
      AsyncStorage.getItem(GUEST_STORAGE_KEY),
      AsyncStorage.getItem(SESSION_OWNER_KEY),
      AsyncStorage.getItem(LOGOUT_PENDING_KEY),
    ])
      .then(async ([guestFlag, owner, pending]) => {
        if (!isMounted) return;
        if (pending === "1" || pending === RESET_PENDING) {
          startCleanup(pending === RESET_PENDING ? "reset" : "signout");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        if (isMounted) {
          if (!authChanged) {
            if (owner === "1" && !data.session) {
              startCleanup("local");
              setIsLoading(false);
              return;
            }
            if (data.session) {
              await AsyncStorage.setItem(SESSION_OWNER_KEY, "1");
              if (!isMounted) return;
              if (authChanged) {
                setIsLoading(false);
                return;
              }
            }
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
        if (event === "SIGNED_OUT" && !logoutRunning.current) {
          setIsGuest(false);
          startCleanup("local");
        }
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
  }, [loadAttempt, startCleanup]);

  const isAuthRoute = segments[0] === "auth";

  useEffect(() => {
    if (logoutState === "complete" && isAuthRoute) {
      serverSignOutFailed.current = false;
      setLogoutState("idle");
    }
    if (!isAuthRoute) {
      authReturn.clear();
    } else if (session && !isLoading && !loadError && logoutState === "idle") {
      returnFromAuth(returnTo);
    }
  }, [
    session,
    isAuthRoute,
    isLoading,
    loadError,
    logoutState,
    returnTo,
    returnFromAuth,
    authReturn,
  ]);

  if (isLoading) {
    return <LoadingState message="Ładowanie sesji..." fill />;
  }

  if (logoutState === "running") {
    return <LoadingState message="Wylogowywanie..." fill />;
  }

  if (logoutState === "failed") {
    return (
      <EmptyState
        fill
        tone="danger"
        icon="alert-circle-outline"
        title={
          cleanupMode.current === "reset"
            ? "Nie udało się zresetować sesji"
            : "Nie udało się zakończyć wylogowania"
        }
        message="Nie udało się wyczyścić sesji lub danych lokalnych. Spróbuj ponownie."
        action={{
          label: "Spróbuj ponownie",
          onPress: () => startCleanup(cleanupMode.current),
        }}
      />
    );
  }

  if (logoutState === "server-warning") {
    return (
      <EmptyState
        fill
        tone="danger"
        icon="alert-circle-outline"
        title="Wylogowano na tym urządzeniu"
        message="Nie udało się potwierdzić wylogowania na serwerze. Sesje na serwerze mogą być nadal aktywne."
        action={{
          label: "Przejdź do logowania",
          onPress: () => setLogoutState("complete"),
        }}
      />
    );
  }

  if (loadError) {
    return (
      <EmptyState
        fill
        tone="danger"
        icon="alert-circle-outline"
        title="Nie udało się wczytać sesji"
        message="Sprawdź połączenie i spróbuj ponownie. Jeśli problem nie ustępuje, zresetuj sesję, aby zalogować się ponownie. Lokalne dane konta zostaną usunięte."
        action={{
          label: "Spróbuj ponownie",
          onPress: () => setLoadAttempt((attempt) => attempt + 1),
        }}
        secondaryAction={{
          label: "Zresetuj sesję",
          onPress: resetSession,
        }}
      />
    );
  }

  if (!session && !isGuest && !isAuthRoute) {
    if (logoutState === "complete") {
      return <Redirect href="/auth" />;
    }
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
        signOut,
        openAuth,
        returnFromAuth,
      }}
    >
      <PreferencesProvider>
        <DealsInteractionProvider>
          <StatusBar style="dark" />
          <Stack>
            <Stack.Protected guard={Boolean(session) || isGuest}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="deals/[id]"
                options={{ headerShown: false }}
              />
            </Stack.Protected>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>
        </DealsInteractionProvider>
      </PreferencesProvider>
    </AuthSessionContext.Provider>
  );
}
