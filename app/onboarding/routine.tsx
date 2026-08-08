import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RoutineScreen() {
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [schedule, setSchedule] = useState("");

  const canContinue =
    wakeTime.trim().length > 0 &&
    sleepTime.trim().length > 0 &&
    schedule.trim().length > 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.eyebrow}>
            STEP 2 OF 4
          </Text>

          <Text style={styles.title}>
            Tell us about your daily routine
          </Text>

          <Text style={styles.subtitle}>
            This helps AINutriMind build meals,
            reminders and health tasks around your
            real schedule.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>
              Wake-up time
            </Text>

            <TextInput
              value={wakeTime}
              onChangeText={setWakeTime}
              style={styles.input}
              placeholder="Example: 7:00 AM"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>
              Sleep time
            </Text>

            <TextInput
              value={sleepTime}
              onChangeText={setSleepTime}
              style={styles.input}
              placeholder="Example: 11:30 PM"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>
              Work / college schedule
            </Text>

            <TextInput
              value={schedule}
              onChangeText={setSchedule}
              style={[
                styles.input,
                styles.scheduleInput,
              ]}
              placeholder="Example: College 9 AM–3 PM, gym at 6 PM"
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>

          <Pressable
            disabled={!canContinue}
            style={[
              styles.continueButton,
              !canContinue &&
                styles.continueButtonDisabled,
            ]}
            onPress={() =>
              router.push("/onboarding/profile")
            }
          >
            <Text style={styles.continueText}>
              Continue
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 180,
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
    lineHeight: 27,
  },

  form: {
    marginTop: 32,
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

  scheduleInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  continueButton: {
    width: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 8,
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