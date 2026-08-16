import { router } from "expo-router";
import { useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useOnboarding } from "@/lib/onboarding-context";

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
  const { data, updateData } = useOnboarding();

  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);

  const canContinue =
    data.age.trim().length > 0 &&
    data.height.trim().length > 0 &&
    data.weight.trim().length > 0 &&
    data.activityLevel !== null &&
    data.dietPreference !== null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.progressHeader}>
        <Text style={styles.stepText}>
          STEP 3 OF 4
        </Text>

        <Text style={styles.progressNumber}>
          75%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.title}>
        Build your health profile
      </Text>

      <Text style={styles.subtitle}>
        These details help AINutriMind personalize your nutrition,
        activity and daily recommendations.
      </Text>

      <Text style={styles.sectionLabel}>
        BASIC DETAILS
      </Text>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>
            Age
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              value={data.age}
              onChangeText={(value) =>
                updateData({
                  age: value.replace(/[^0-9]/g, ""),
                })
              }
              style={styles.input}
              placeholder="22"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                heightRef.current?.focus();
              }}
              maxLength={3}
            />

            <Text style={styles.unit}>
              yrs
            </Text>
          </View>
        </View>

        <View style={styles.halfField}>
          <Text style={styles.label}>
            Height
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              ref={heightRef}
              value={data.height}
              onChangeText={(value) =>
                updateData({
                  height: value.replace(/[^0-9]/g, ""),
                })
              }
              style={styles.input}
              placeholder="170"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                weightRef.current?.focus();
              }}
              maxLength={3}
            />

            <Text style={styles.unit}>
              cm
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.label}>
        Weight
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          ref={weightRef}
          value={data.weight}
          onChangeText={(value) => {
            const sanitized = value.replace(
              /[^0-9.]/g,
              ""
            );

            updateData({
              weight: sanitized,
            });
          }}
          style={styles.input}
          placeholder="70"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          returnKeyType="done"
          maxLength={6}
        />

        <Text style={styles.unit}>
          kg
        </Text>
      </View>

      <Text style={styles.sectionLabel}>
        ACTIVITY LEVEL
      </Text>

      <View style={styles.optionGrid}>
        {activityLevels.map((item) => {
          const selected =
            data.activityLevel === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.option,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                updateData({
                  activityLevel: item,
                })
              }
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

      <Text style={styles.sectionLabel}>
        DIET PREFERENCE
      </Text>

      <View style={styles.optionGrid}>
        {dietOptions.map((item) => {
          const selected =
            data.dietPreference === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.option,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                updateData({
                  dietPreference: item,
                })
              }
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
          router.push(
            "/onboarding/preferences"
          )
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
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 100,
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
    width: "75%",
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
    marginBottom: 8,
    color: "#64748B",
    fontSize: 16,
    lineHeight: 25,
  },

  sectionLabel: {
    marginTop: 30,
    marginBottom: 12,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
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
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 9,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    paddingVertical: 16,
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },

  unit: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
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
    marginTop: 36,
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