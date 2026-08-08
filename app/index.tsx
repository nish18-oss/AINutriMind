import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌿</Text>

      <Text style={styles.title}>AINutriMind</Text>

      <Text style={styles.subtitle}>
        AI-backed Nutrition &{"\n"}Daily Health Planner
      </Text>

      <Text style={styles.description}>
        Your intelligent companion for nutrition, routines,
        health goals and everyday planning.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          router.push("/onboarding");
        }}
      >
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  logo: {
    fontSize: 72,
    marginBottom: 18,
  },

  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#16A34A",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    lineHeight: 28,
  },

  description: {
    marginTop: 18,
    maxWidth: 330,
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 23,
  },

  button: {
    width: "100%",
    marginTop: 42,
    backgroundColor: "#22C55E",
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});