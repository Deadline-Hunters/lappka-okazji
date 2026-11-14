import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

// Expo SDK 58 bug (expo/build/dom/webview-wrapper.js): on a DOM component's first render it sends
// props to the WebView before the native view exists and doesn't catch the rejected promise.
// Expo re-sends the props once loaded (DOM_READY), so nothing is lost - it's just dev noise.
LogBox.ignoreLogs(["DomWebView.injectJavaScript"]);

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        if (isMounted) {
          setUser(data.session?.user ?? null);
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
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthRoute = segments[0] === "auth";

  if (isLoading) {
    return null;
  }

  if (!user && !isAuthRoute) {
    return <Redirect href="/auth" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
