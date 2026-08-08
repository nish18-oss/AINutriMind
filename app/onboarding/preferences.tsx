import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const preferences = [
  "Meal Planning",
  "Smart Reminders",
  "Workout Guidance",
  "Daily Routine",
  "Healthy Habits",
  "AI Coaching",
];

export default function PreferencesScreen() {
  const [selected, setSelected] =
    useState<string[]>([]);

  function togglePreference(item: string) {
    setSelected((current) =>
      current.includes(item)
        ? current.filter(
            (preference) =>
              preference !== item
          )
        : [...current, item]
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>
        STEP 4 OF 4
      </Text>

      <Text style={styles.title}>
        How should AINutriMind help you?
      </Text>

      <Text style={styles.subtitle}>
        Choose everything you want your AI companion
        to help you manage.
      </Text>

      <View style={styles.options}>
        {preferences.map((item) => {
          const isSelected =
            selected.includes(item);

          return (
            <Pressable
              key={item}
              style={[
                styles.option,
                isSelected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                togglePreference(item)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected &&
                    styles.optionTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={selected.length === 0}
        style={[
          styles.finishButton,
          selected.length === 0 &&
            styles.finishButtonDisabled,
        ]}
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.finishText}>
          Build My Plan
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

  options: {
    marginTop: 32,
    gap: 12,
  },

  option: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 17,
  },

  optionSelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
  },

  optionText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#15803D",
  },

  finishButton: {
    marginTop: 32,
    backgroundColor: "#22C55E",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
  },

  finishButtonDisabled: {
    opacity: 0.35,
  },

  finishText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});