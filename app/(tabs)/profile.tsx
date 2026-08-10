import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        Your personalized daily and weekly plan will appear here.
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
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
    textAlign: "center",
  },
});