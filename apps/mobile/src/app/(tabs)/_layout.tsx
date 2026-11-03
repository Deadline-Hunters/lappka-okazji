import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: unknown; size: number }) => (
    <Ionicons name={name} size={size} color={typeof color === "string" ? color : undefined} />
  );
}

// Szkielet nawigacji z KAN-11: Mapa · Okazje · Kupony · Obserwowane · Profil.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Mapa", headerTitle: "Łappka Okazji", tabBarIcon: tabIcon("map-outline") }} />
      <Tabs.Screen name="okazje" options={{ title: "Okazje", tabBarIcon: tabIcon("flame-outline") }} />
      <Tabs.Screen name="kupony" options={{ title: "Kupony", tabBarIcon: tabIcon("ticket-outline") }} />
      <Tabs.Screen name="obserwowane" options={{ title: "Obserwowane", tabBarIcon: tabIcon("bookmark-outline") }} />
      <Tabs.Screen name="profil" options={{ title: "Profil", tabBarIcon: tabIcon("person-outline") }} />
    </Tabs>
  );
}
