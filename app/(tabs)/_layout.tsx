import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AINutriMind</Text>
      <Text style={styles.tagline}>
        Your AI Health & Nutrition Companion
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2E7D32",
  },
  tagline: {
    marginTop: 15,
    fontSize: 18,
    color: "#64748B",
    textAlign: "center",
  },
});