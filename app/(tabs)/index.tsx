import { StyleSheet, Text, View, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌿</Text>

      <Text style={styles.title}>AINutriMind</Text>

      <Text style={styles.subtitle}>
        AI-backed Nutrition &{"\n"}Daily Health Planner
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          alert("Welcome to AINutriMind!");
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
    padding: 24,
  },

  logo: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 18,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 28,
  },

  button: {
    backgroundColor: "#22C55E",
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 18,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});