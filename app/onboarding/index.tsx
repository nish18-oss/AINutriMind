import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useOnboarding } from "@/lib/onboarding-context";

const goals = [
  {
    title: "Lose Weight",
    description: "Build a sustainable calorie deficit and healthier routine.",
    icon: "⚖️",
  },
  {
    title: "Build Muscle",
    description: "Support strength training with nutrition and recovery.",
    icon: "💪",
  },
  {
    title: "Maintain Weight",
    description: "Stay consistent with balanced nutrition and activity.",
    icon: "🎯",
  },
  {
    title: "Improve Nutrition",
    description: "Eat better, build healthier habits and improve food quality.",
    icon: "🥗",
  },
];

export default function GoalScreen() {
  const { data, updateData } = useOnboarding();

  const selectedGoal = data.goal;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.progressHeader}>
        <Text style={styles.stepText}>
          STEP 1 OF 4
        </Text>

        <Text style={styles.progressNumber}>
          25%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.title}>
        What is your main goal?
      </Text>

      <Text style={styles.subtitle}>
        Choose the goal AINutriMind should prioritize when building your plan.
      </Text>

      <View style={styles.options}>
        {goals.map((goal) => {
          const selected =
            selectedGoal === goal.title;

          return (
            <Pressable
              key={goal.title}
              style={[
                styles.option,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() => {
                updateData({
                  goal: goal.title,
                });
              }}
            >
              <View
                style={[
                  styles.iconBox,
                  selected &&
                    styles.iconBoxSelected,
                ]}
              >
                <Text style={styles.icon}>
                  {goal.icon}
                </Text>
              </View>

              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionTitle,
                    selected &&
                      styles.optionTitleSelected,
                  ]}
                >
                  {goal.title}
                </Text>

                <Text style={styles.optionDescription}>
                  {goal.description}
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selected &&
                    styles.radioSelected,
                ]}
              >
                {selected && (
                  <View style={styles.radioDot} />
                )}
              </View>
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

        <Text style={styles.arrow}>
          →
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
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 80,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stepText: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  progressNumber: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },

  progressTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    width: "25%",
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 999,
  },

  title: {
    marginTop: 32,
    color: "#0F172A",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 42,
  },

  subtitle: {
    marginTop: 14,
    color: "#64748B",
    fontSize: 16,
    lineHeight: 25,
  },

  options: {
    marginTop: 30,
    gap: 14,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 16,
  },

  optionSelected: {
    borderColor: "#22C55E",
    backgroundColor: "#F7FDF9",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  iconBoxSelected: {
    backgroundColor: "#DCFCE7",
  },

  icon: {
    fontSize: 24,
  },

  optionContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  optionTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
  },

  optionTitleSelected: {
    color: "#15803D",
  },

  optionDescription: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },

  radioSelected: {
    borderColor: "#22C55E",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },

  continueButton: {
    marginTop: 32,
    minHeight: 58,
    backgroundColor: "#16A34A",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  continueButtonDisabled: {
    opacity: 0.35,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  arrow: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
});