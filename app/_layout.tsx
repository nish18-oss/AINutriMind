import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { OnboardingProvider } from "@/lib/onboarding-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <OnboardingProvider>
      <ThemeProvider
        value={
          colorScheme === "dark"
            ? DarkTheme
            : DefaultTheme
        }
      >
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="onboarding"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modal"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack>

        <StatusBar style="dark" />
      </ThemeProvider>
    </OnboardingProvider>
  );
}