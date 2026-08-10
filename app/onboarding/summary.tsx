import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { router } from "expo-router";
import { useOnboarding } from "@/lib/onboarding-context";

export default function SummaryScreen() {
  const { data } = useOnboarding();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>
        REVIEW
      </Text>

      <Text style={styles.title}>
        Your AINutriMind profile
      </Text>

      <Text style={styles.subtitle}>
        Let’s confirm everything before we build your personalized plan.
      </Text>

      <View style={styles.card}>
        <Row label="Goal" value={data.goal ?? "Not selected"} />

        <Row
          label="Wake-up time"
          value={data.wakeTime}
        />

        <Row
          label="Sleep time"
          value={data.sleepTime}
        />

        <Row
          label="Schedule"
          value={data.schedule}
        />

        <Row
          label="Age"
          value={data.age}
        />

        <Row
          label="Height"
          value={`${data.height} cm`}
        />

        <Row
          label="Weight"
          value={`${data.weight} kg`}
        />

        <Row
          label="Activity level"
          value={data.activityLevel ?? "Not selected"}
        />

        <Row
          label="Diet preference"
          value={data.dietPreference ?? "Not selected"}
        />

        <View style={styles.section}>
          <Text style={styles.label}>
            Preferences
          </Text>

          {data.preferences.length > 0 ? (
            data.preferences.map((item) => (
              <View
                key={item}
                style={styles.preferenceChip}
              >
                <Text style={styles.preferenceText}>
                  {item}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.value}>
              None selected
            </Text>
          )}
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.buttonText}>
          Continue to Dashboard
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || "Not provided"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },

  eyebrow: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
  },

  title: {
    color: "#0F172A",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 42,
  },

  subtitle: {
    marginTop: 14,
    color: "#64748B",
    fontSize: 17,
    lineHeight: 26,
  },

  card: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  row: {
    marginBottom: 18,
  },

  section: {
    marginTop: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 6,
  },

  value: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
  },

  preferenceChip: {
    alignSelf: "flex-start",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
  },

  preferenceText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "700",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#22C55E",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});