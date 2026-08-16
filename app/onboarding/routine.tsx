import { router } from "expo-router";
import { useRef, useState } from "react";
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

import TimePickerModal from "@/components/time-picker-modal";
import { useOnboarding } from "@/lib/onboarding-context";

type ActivePicker = "wake" | "sleep" | null;

export default function RoutineScreen() {
  const { data, updateData } = useOnboarding();

  const [activePicker, setActivePicker] =
    useState<ActivePicker>(null);

  const scheduleInputRef =
    useRef<TextInput>(null);

  const canContinue =
    data.wakeTime.trim().length > 0 &&
    data.sleepTime.trim().length > 0 &&
    data.schedule.trim().length > 0;

  function handleWakeTimeSelected(
    value: string
  ) {
    updateData({
      wakeTime: value,
    });

    setActivePicker(null);

    // Automatically open Sleep Time next
    setTimeout(() => {
      setActivePicker("sleep");
    }, 250);
  }

  function handleSleepTimeSelected(
    value: string
  ) {
    updateData({
      sleepTime: value,
    });

    setActivePicker(null);

    // Automatically focus schedule next
    setTimeout(() => {
      scheduleInputRef.current?.focus();
    }, 300);
  }

  return (
    <>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <View style={styles.screen}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={
              styles.container
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* Progress */}

            <View style={styles.progressHeader}>
              <Text style={styles.stepText}>
                STEP 2 OF 4
              </Text>

              <Text
                style={styles.progressNumber}
              >
                50%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={styles.progressFill}
              />
            </View>

            {/* Heading */}

            <Text style={styles.title}>
              Build your daily routine
            </Text>

            <Text style={styles.subtitle}>
              Tell AINutriMind when your day
              usually starts and ends. We’ll
              organize meals, activity and
              reminders around your schedule.
            </Text>

            {/* Wake time */}

            <Text style={styles.sectionLabel}>
              WAKE-UP TIME
            </Text>

            <Pressable
              style={[
                styles.timeCard,
                data.wakeTime &&
                  styles.timeCardSelected,
              ]}
              onPress={() =>
                setActivePicker("wake")
              }
            >
              <View>
                <Text style={styles.timeLabel}>
                  I usually wake up at
                </Text>

                <Text
                  style={[
                    styles.timeValue,
                    !data.wakeTime &&
                      styles.placeholder,
                  ]}
                >
                  {data.wakeTime ||
                    "Select wake-up time"}
                </Text>
              </View>

              <View style={styles.timeIcon}>
                <Text style={styles.timeIconText}>
                  ☀️
                </Text>
              </View>
            </Pressable>

            {/* Sleep time */}

            <Text style={styles.sectionLabel}>
              SLEEP TIME
            </Text>

            <Pressable
              style={[
                styles.timeCard,
                data.sleepTime &&
                  styles.timeCardSelected,
              ]}
              onPress={() =>
                setActivePicker("sleep")
              }
            >
              <View>
                <Text style={styles.timeLabel}>
                  I usually sleep at
                </Text>

                <Text
                  style={[
                    styles.timeValue,
                    !data.sleepTime &&
                      styles.placeholder,
                  ]}
                >
                  {data.sleepTime ||
                    "Select sleep time"}
                </Text>
              </View>

              <View style={styles.timeIcon}>
                <Text style={styles.timeIconText}>
                  🌙
                </Text>
              </View>
            </Pressable>

            {/* Schedule */}

            <Text style={styles.sectionLabel}>
              WORK / COLLEGE / DAILY SCHEDULE
            </Text>

            <View style={styles.scheduleCard}>
              <TextInput
                ref={scheduleInputRef}
                style={styles.scheduleInput}
                value={data.schedule}
                onChangeText={(value) =>
                  updateData({
                    schedule: value,
                  })
                }
                placeholder="Example: College 9 AM–3 PM, gym at 6 PM"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
              />

              <Text style={styles.helperText}>
                You can include college, work,
                gym, commute or anything that
                affects your daily routine.
              </Text>
            </View>

            {/* Continue */}

            <Pressable
              disabled={!canContinue}
              style={[
                styles.continueButton,
                !canContinue &&
                  styles.continueButtonDisabled,
              ]}
              onPress={() =>
                router.push(
                  "/onboarding/profile"
                )
              }
            >
              <Text
                style={styles.continueText}
              >
                Continue
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* Wake-up picker */}

      <TimePickerModal
        visible={activePicker === "wake"}
        title="Wake-up time"
        initialValue={data.wakeTime}
        onClose={() =>
          setActivePicker(null)
        }
        onSelect={handleWakeTimeSelected}
      />

      {/* Sleep picker */}

      <TimePickerModal
        visible={activePicker === "sleep"}
        title="Sleep time"
        initialValue={data.sleepTime}
        onClose={() =>
          setActivePicker(null)
        }
        onSelect={handleSleepTimeSelected}
      />
    </>
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
    width: "50%",
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

  sectionLabel: {
    marginTop: 32,
    marginBottom: 10,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  timeCard: {
    minHeight: 94,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeCardSelected: {
    borderColor: "#86EFAC",
    backgroundColor: "#F7FDF9",
  },

  timeLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },

  timeValue: {
    marginTop: 6,
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800",
  },

  placeholder: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
  },

  timeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  timeIconText: {
    fontSize: 23,
  },

  scheduleCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 16,
  },

  scheduleInput: {
    minHeight: 100,
    color: "#0F172A",
    fontSize: 16,
    lineHeight: 24,
  },

  helperText: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
  },

  continueButton: {
    marginTop: 34,
    minHeight: 58,
    backgroundColor: "#16A34A",
    borderRadius: 18,
    paddingHorizontal: 22,
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