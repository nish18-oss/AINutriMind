import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const activityLevels = [
  "Low",
  "Moderate",
  "Active",
  "Very Active",
];

const dietOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Other",
];

export default function ProfileScreen() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [activity, setActivity] =
    useState<string | null>(null);

  const [diet, setDiet] =
    useState<string | null>(null);

  const canContinue =
    age.trim().length > 0 &&
    height.trim().length > 0 &&
    weight.trim().length > 0 &&
    activity !== null &&
    diet !== null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>
        STEP 3 OF 4
      </Text>

      <Text style={styles.title}>
        Build your health profile
      </Text>

      <Text style={styles.subtitle}>
        These details help AINutriMind personalize
        nutrition and activity recommendations.
      </Text>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>
            Age
          </Text>

          <TextInput
            value={age}
            onChangeText={setAge}
            style={styles.input}
            placeholder="22"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.halfField}>
          <Text style={styles.label}>
            Height (cm)
          </Text>

          <TextInput
            value={height}
            onChangeText={setHeight}
            style={styles.input}
            placeholder="170"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
          />
        </View>
      </View>

      <Text style={styles.label}>
        Weight (kg)
      </Text>

      <TextInput
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        placeholder="70"
        placeholderTextColor="#94A3B8"
        keyboardType="decimal-pad"
      />

      <Text style={styles.sectionTitle}>
        Activity level
      </Text>

      <View style={styles.optionGrid}>
        {activityLevels.map((item) => {
          const selected = activity === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.option,
                selected && styles.optionSelected,
              ]}
              onPress={() => setActivity(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected &&
                    styles.optionTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>
        Diet preference
      </Text>

      <View style={styles.optionGrid}>
        {dietOptions.map((item) => {
          const selected = diet === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.option,
                selected && styles.optionSelected,
              ]}
              onPress={() => setDiet(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected &&
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
        disabled={!canContinue}
        style={[
          styles.continueButton,
          !canContinue &&
            styles.continueButtonDisabled,
        ]}
        onPress={() =>
          router.push("/onboarding/preferences")
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100,
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
    marginBottom: 28,
    color: "#64748B",
    fontSize: 17,
    lineHeight: 26,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  halfField: {
    flex: 1,
  },

  label: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 9,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: "#0F172A",
    fontSize: 17,
    marginBottom: 22,
  },

  sectionTitle: {
    marginTop: 6,
    marginBottom: 14,
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 26,
  },

  option: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 17,
    paddingVertical: 13,
  },

  optionSelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
  },

  optionText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#15803D",
  },

  continueButton: {
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