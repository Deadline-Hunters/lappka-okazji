import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

// Błąd w Expo SDK 58 (expo/build/dom/webview-wrapper.js): przy pierwszym renderze komponentu DOM
// wysyła propsy do WebView, zanim natywny widok istnieje, i nie łapie odrzuconej obietnicy.
// Expo samo wysyła propsy ponownie po załadowaniu (DOM_READY), więc nic nie ginie - to tylko szum w dev.
LogBox.ignoreLogs(["DomWebView.injectJavaScript"]);

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
