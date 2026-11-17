import { router } from "expo-router";
import { Pressable, Text } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuthSession } from "@/lib/auth-session";

export function AuthHeader() {
  const { activateDevelopmentFlow } = useAuthSession();

  // TODO(auth): Remove this development-only handler after the user auth flow is implemented.
  const handleTemporaryBack = () => {
    if (!__DEV__) {
      return;
    }

    activateDevelopmentFlow();
    console.warn(
      "[AuthHeader] Temporary development-only navigation: returning to the main view.",
    );
    router.replace("/(tabs)");
  };

  return (
    <ScreenHeader
      title="Logowanie i rejestracja"
      left={
        /*TODO(auth): Remove this development-only Pressable after the user auth flow is implemented.*/
        __DEV__ && (
          <Pressable
            accessibilityLabel="Wróć"
            hitSlop={8}
            onPress={handleTemporaryBack}
            style={{
              position: "absolute",
              zIndex: 1,
              backgroundColor: "#aaaaaaaa",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "red" }}>[DEV] SKIP</Text>
          </Pressable>
        )
      }
    />
  );
}
