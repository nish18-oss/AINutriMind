import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import TimePickerModal from "@/components/time-picker-modal";
import { AppTheme } from "@/constants/theme";

export type PlannerCategory =
  | "Meal"
  | "Workout"
  | "Work / College"
  | "Personal";

type AddTaskCardProps = {
  dayLabel: string;

  title: string;
  onTitleChange: (value: string) => void;

  time: string;
  onTimeChange: (value: string) => void;

  category: PlannerCategory;
  onCategoryChange: (value: PlannerCategory) => void;

  reminderEnabled: boolean;
  onReminderChange: (value: boolean) => void;

  onAdd: () => void;
  onClose: () => void;
};

const categories: {
  label: PlannerCategory;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    label: "Meal",
    icon: "restaurant-outline",
  },
  {
    label: "Workout",
    icon: "barbell-outline",
  },
  {
    label: "Work / College",
    icon: "briefcase-outline",
  },
  {
    label: "Personal",
    icon: "person-outline",
  },
];

export default function AddTaskCard({
  dayLabel,
  title,
  onTitleChange,
  time,
  onTimeChange,
  category,
  onCategoryChange,
  reminderEnabled,
  onReminderChange,
  onAdd,
  onClose,
}: AddTaskCardProps) {
  const [showTimePicker, setShowTimePicker] =
    useState(false);

  const canAdd =
    title.trim().length > 0 &&
    time.trim().length > 0;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              NEW MOMENT
            </Text>

            <Text style={styles.heading}>
              Add to {dayLabel}
            </Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={20}
              color={AppTheme.colors.textSecondary}
            />
          </Pressable>
        </View>

        <Text style={styles.label}>
          What&apos;s happening?
        </Text>

        <TextInput
          value={title}
          onChangeText={onTitleChange}
          placeholder="e.g. Gym, lunch, college"
          placeholderTextColor={
            AppTheme.colors.textMuted
          }
          style={styles.input}
          returnKeyType="done"
        />

        <Text style={styles.label}>
          Time
        </Text>

        <Pressable
          style={[
            styles.timeButton,
            time && styles.timeButtonSelected,
          ]}
          onPress={() =>
            setShowTimePicker(true)
          }
        >
          <View style={styles.timeLeft}>
            <View style={styles.timeIcon}>
              <Ionicons
                name="time-outline"
                size={19}
                color={AppTheme.colors.accentDark}
              />
            </View>

            <View>
              <Text style={styles.timeCaption}>
                Scheduled time
              </Text>

              <Text
                style={[
                  styles.timeValue,
                  !time && styles.timePlaceholder,
                ]}
              >
                {time || "Select time"}
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={AppTheme.colors.textMuted}
          />
        </Pressable>

        <Text style={styles.label}>
          Type
        </Text>

        <View style={styles.categories}>
          {categories.map((item) => {
            const selected =
              category === item.label;

            return (
              <Pressable
                key={item.label}
                style={[
                  styles.category,
                  selected &&
                    styles.categorySelected,
                ]}
                onPress={() =>
                  onCategoryChange(item.label)
                }
              >
                <Ionicons
                  name={item.icon}
                  size={17}
                  color={
                    selected
                      ? AppTheme.colors.accentDark
                      : AppTheme.colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.categoryText,
                    selected &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.reminder}>
          <View style={styles.reminderLeft}>
            <View style={styles.reminderIcon}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={AppTheme.colors.accentDark}
              />
            </View>

            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>
                Smart reminder
              </Text>

              <Text style={styles.reminderDescription}>
                {time
                  ? `Notify me every ${dayLabel} at ${time}.`
                  : "Choose a time before enabling a reminder."}
              </Text>
            </View>
          </View>

          <Switch
            value={reminderEnabled}
            onValueChange={onReminderChange}
            disabled={!time}
            trackColor={{
              false: AppTheme.colors.border,
              true: AppTheme.colors.accentSoft,
            }}
            thumbColor={
              reminderEnabled
                ? AppTheme.colors.accent
                : AppTheme.colors.textMuted
            }
          />
        </View>

        <Pressable
          style={[
            styles.addButton,
            !canAdd && styles.addButtonDisabled,
          ]}
          onPress={onAdd}
          disabled={!canAdd}
        >
          <Text
            style={[
              styles.addButtonText,
              !canAdd &&
                styles.addButtonTextDisabled,
            ]}
          >
            Add to my flow
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={
              canAdd
                ? "#FFFFFF"
                : AppTheme.colors.textMuted
            }
          />
        </Pressable>
      </View>

      <TimePickerModal
        visible={showTimePicker}
        title="Choose time"
        initialValue={time}
        onClose={() =>
          setShowTimePicker(false)
        }
        onSelect={(value: string) => {
          onTimeChange(value);
          setShowTimePicker(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    padding: 20,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: AppTheme.colors.accentDark,
  },

  heading: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "800",
    color: AppTheme.colors.ink,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppTheme.colors.surfaceSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "800",
    color: AppTheme.colors.textSecondary,
  },

  input: {
    minHeight: 54,
    marginBottom: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
    fontSize: 15,
    fontWeight: "600",
    color: AppTheme.colors.ink,
  },

  timeButton: {
    minHeight: 68,
    marginBottom: 18,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  timeButtonSelected: {
    borderColor: AppTheme.colors.accent,
    backgroundColor: AppTheme.colors.accentSoft,
  },

  timeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: AppTheme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  timeCaption: {
    fontSize: 10,
    fontWeight: "700",
    color: AppTheme.colors.textMuted,
  },

  timeValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "800",
    color: AppTheme.colors.ink,
  },

  timePlaceholder: {
    color: AppTheme.colors.textSecondary,
    fontWeight: "600",
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  category: {
    minHeight: 42,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
    flexDirection: "row",
    alignItems: "center",
  },

  categorySelected: {
    borderColor: AppTheme.colors.accent,
    backgroundColor: AppTheme.colors.accentSoft,
  },

  categoryText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: AppTheme.colors.textSecondary,
  },

  categoryTextSelected: {
    color: AppTheme.colors.accentDark,
  },

  reminder: {
    minHeight: 72,
    padding: 13,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.surfaceSoft,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reminderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },

  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: AppTheme.colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  reminderContent: {
    flex: 1,
    marginLeft: 11,
  },

  reminderTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: AppTheme.colors.ink,
  },

  reminderDescription: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    color: AppTheme.colors.textSecondary,
  },

  addButton: {
    minHeight: 54,
    marginTop: 18,
    paddingHorizontal: 18,
    borderRadius: 17,
    backgroundColor: AppTheme.colors.accent,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addButtonDisabled: {
    backgroundColor: AppTheme.colors.surfaceSoft,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  addButtonTextDisabled: {
    color: AppTheme.colors.textMuted,
  },
});