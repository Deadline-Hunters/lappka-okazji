import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";
import { useAuthSession } from "@/lib/auth-session";
import { authStyles } from "../authStyles";

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
    <View style={authStyles.header}>
      {
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
      <Text numberOfLines={1} style={authStyles.headerTitle}>
        Logowanie i rejestracja
      </Text>
      <View style={authStyles.headerSpacer} />
    </View>
  );
}
