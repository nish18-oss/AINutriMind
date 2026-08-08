import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const goals = [
  "Lose Weight",
  "Build Muscle",
  "Maintain Weight",
  "Improve Nutrition",
];

export default function GoalScreen() {
  const [selectedGoal, setSelectedGoal] =
    useState<string | null>(null);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>
        STEP 1 OF 4
      </Text>

      <Text style={styles.title}>
        What is your main goal?
      </Text>

      <Text style={styles.subtitle}>
        AINutriMind will personalize your nutrition,
        routine and recommendations around your goal.
      </Text>

      <View style={styles.options}>
        {goals.map((goal) => {
          const selected = selectedGoal === goal;

          return (
            <Pressable
              key={goal}
              style={[
                styles.option,
                selected && styles.optionSelected,
              ]}
              onPress={() => setSelectedGoal(goal)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {goal}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={!selectedGoal}
        style={[
          styles.continueButton,
          !selectedGoal &&
            styles.continueButtonDisabled,
        ]}
        onPress={() =>
          router.push("/onboarding/routine")
        }
      >
        <Text style={styles.continueText}>
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 50,
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

  options: {
    marginTop: 32,
    gap: 14,
  },

  option: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  optionSelected: {
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
  },

  optionText: {
    color: "#334155",
    fontSize: 17,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#15803D",
  },

  continueButton: {
    marginTop: 32,
    backgroundColor: "#22C55E",
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
  },

  continueButtonDisabled: {
    opacity: 0.35,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});