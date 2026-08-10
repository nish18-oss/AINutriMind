import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#16A34A",
        tabBarInactiveTintColor: "#94A3B8",

        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E8F0",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}