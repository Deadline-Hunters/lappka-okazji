import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { AppHeader } from "@/components/AppHeader";
import type { IconName } from "@/components/icons";
import { colors } from "@/theme";

function tabIcon(name: IconName) {
  return ({ color, size }: { color: unknown; size: number }) => (
    <Ionicons
      name={name}
      size={size}
      color={typeof color === "string" ? color : undefined}
    />
  );
}

// App shell from KAN-11: Map · Deals · Coupons · Watchlist · Profile.
// Every tab gets the same AppHeader with its title as the screen name.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => <AppHeader title={options.title ?? ""} />,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Mapa", tabBarIcon: tabIcon("map-outline") }}
      />
      <Tabs.Screen
        name="deals"
        options={{ title: "Okazje", tabBarIcon: tabIcon("flame-outline") }}
      />
      <Tabs.Screen
        name="coupons"
        options={{ title: "Kupony", tabBarIcon: tabIcon("ticket-outline") }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Obserwowane",
          tabBarIcon: tabIcon("bookmark-outline"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profil", tabBarIcon: tabIcon("person-outline") }}
      />
    </Tabs>
  );
}
