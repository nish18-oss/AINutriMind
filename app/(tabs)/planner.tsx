import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  cancelPlannerReminder,
  isValidPlannerTime,
  PlannerDayKey,
  scheduleWeeklyPlannerReminder,
} from "@/services/notifications/planner-notifications";

type PlanItem = {
  id: string;
  title: string;
  category: string;
  time: string;
  reminderEnabled: boolean;
  notificationId: string | null;
  completed: boolean;
};

type WeeklyPlan = Record<PlannerDayKey, PlanItem[]>;

const STORAGE_KEY = "@ainutrimind_weekly_planner";

const days: PlannerDayKey[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const categories = [
  "Meal",
  "Workout",
  "Work / College",
  "Personal",
];

const emptyPlan: WeeklyPlan = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

export default function PlannerScreen() {
  const [selectedDay, setSelectedDay] =
    useState<PlannerDayKey>("Mon");

  const [task, setTask] = useState("");
  const [time, setTime] = useState("");

  const [category, setCategory] =
    useState("Personal");

  const [reminderEnabled, setReminderEnabled] =
    useState(false);

  const [weeklyPlan, setWeeklyPlan] =
    useState<WeeklyPlan>(emptyPlan);

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [isAdding, setIsAdding] =
    useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      savePlan(weeklyPlan);
    }
  }, [weeklyPlan, isLoaded]);

  async function loadPlan() {
    try {
      const saved =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        const normalizedPlan: WeeklyPlan = {
          Mon: normalizeItems(parsed.Mon),
          Tue: normalizeItems(parsed.Tue),
          Wed: normalizeItems(parsed.Wed),
          Thu: normalizeItems(parsed.Thu),
          Fri: normalizeItems(parsed.Fri),
          Sat: normalizeItems(parsed.Sat),
          Sun: normalizeItems(parsed.Sun),
        };

        setWeeklyPlan(normalizedPlan);
      }
    } catch (error) {
      console.log(
        "Could not load weekly planner:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }

  function normalizeItems(
    items?: PlanItem[]
  ): PlanItem[] {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => ({
      ...item,
      time:
        typeof item.time === "string"
          ? item.time
          : "",
      reminderEnabled:
        item.reminderEnabled ?? false,
      notificationId:
        item.notificationId ?? null,
      completed:
        item.completed ?? false,
    }));
  }

  async function savePlan(
    plan: WeeklyPlan
  ) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(plan)
      );
    } catch (error) {
      console.log(
        "Could not save weekly planner:",
        error
      );
    }
  }

  async function addTask() {
    const cleanTask = task.trim();
    const cleanTime = time.trim();

    if (!cleanTask) {
      return;
    }

    if (
      cleanTime.length > 0 &&
      !isValidPlannerTime(cleanTime)
    ) {
      Alert.alert(
        "Invalid time",
        "Enter time like 6:00 PM or 18:00."
      );
      return;
    }

    if (
      reminderEnabled &&
      !cleanTime
    ) {
      Alert.alert(
        "Time required",
        "Add a time before enabling a reminder."
      );
      return;
    }

    setIsAdding(true);

    try {
      let notificationId: string | null =
        null;

      let finalReminderEnabled =
        reminderEnabled;

      if (reminderEnabled) {
        notificationId =
          await scheduleWeeklyPlannerReminder({
            day: selectedDay,
            time: cleanTime,
            taskTitle: cleanTask,
          });

        if (!notificationId) {
          finalReminderEnabled = false;

          Alert.alert(
            "Reminder not enabled",
            "The task was added, but notification permission was not available."
          );
        }
      }

      const newItem: PlanItem = {
        id: Date.now().toString(),
        title: cleanTask,
        category,
        time: cleanTime,
        reminderEnabled:
          finalReminderEnabled,
        notificationId,
        completed: false,
      };

      setWeeklyPlan((current) => ({
        ...current,
        [selectedDay]: [
          ...current[selectedDay],
          newItem,
        ],
      }));

      setTask("");
      setTime("");
      setCategory("Personal");
      setReminderEnabled(false);
    } catch (error) {
      console.log(
        "Could not add planner task:",
        error
      );

      Alert.alert(
        "Something went wrong",
        "AINutriMind could not create the reminder."
      );
    } finally {
      setIsAdding(false);
    }
  }

  function toggleTask(id: string) {
    setWeeklyPlan((current) => ({
      ...current,
      [selectedDay]:
        current[selectedDay].map((item) =>
          item.id === id
            ? {
                ...item,
                completed: !item.completed,
              }
            : item
        ),
    }));
  }

  async function deleteTask(
    item: PlanItem
  ) {
    if (item.notificationId) {
      await cancelPlannerReminder(
        item.notificationId
      );
    }

    setWeeklyPlan((current) => ({
      ...current,
      [selectedDay]:
        current[selectedDay].filter(
          (currentItem) =>
            currentItem.id !== item.id
        ),
    }));
  }

  const selectedItems =
    weeklyPlan[selectedDay];

  const completedCount =
    selectedItems.filter(
      (item) => item.completed
    ).length;

  const weeklyTaskCount =
    useMemo(
      () =>
        days.reduce(
          (total, day) =>
            total +
            weeklyPlan[day].length,
          0
        ),
      [weeklyPlan]
    );

  const timeValid =
    !time.trim() ||
    isValidPlannerTime(time);

  const canAdd =
    task.trim().length > 0 &&
    timeValid &&
    (!reminderEnabled ||
      time.trim().length > 0) &&
    !isAdding;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>
        WEEKLY PLANNER
      </Text>

      <Text style={styles.title}>
        Plan your week
      </Text>

      <Text style={styles.subtitle}>
        Organize meals, workouts, work
        and personal tasks across your week.
      </Text>

      <View style={styles.weekSummary}>
        <Text
          style={styles.weekSummaryTitle}
        >
          This week
        </Text>

        <Text
          style={styles.weekSummaryValue}
        >
          {weeklyTaskCount}{" "}
          {weeklyTaskCount === 1
            ? "planned item"
            : "planned items"}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
      >
        {days.map((day) => {
          const selected =
            selectedDay === day;

          const count =
            weeklyPlan[day].length;

          return (
            <Pressable
              key={day}
              style={[
                styles.dayButton,
                selected &&
                  styles.dayButtonSelected,
              ]}
              onPress={() =>
                setSelectedDay(day)
              }
            >
              <Text
                style={[
                  styles.dayText,
                  selected &&
                    styles.dayTextSelected,
                ]}
              >
                {day}
              </Text>

              {count > 0 && (
                <View
                  style={[
                    styles.dayCount,
                    selected &&
                      styles.dayCountSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayCountText,
                      selected &&
                        styles.dayCountTextSelected,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.addCard}>
        <Text
          style={styles.selectedDayTitle}
        >
          Add to {selectedDay}
        </Text>

        <Text style={styles.label}>
          What do you need to do?
        </Text>

        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Example: Gym"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>
          Time
        </Text>

        <TextInput
          style={[
            styles.input,
            !timeValid &&
              styles.inputError,
          ]}
          value={time}
          onChangeText={setTime}
          placeholder="Example: 6:00 PM"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
        />

        {!timeValid && (
          <Text style={styles.errorText}>
            Use a time like 6:00 PM or 18:00.
          </Text>
        )}

        <Text style={styles.label}>
          Category
        </Text>

        <View style={styles.categories}>
          {categories.map((item) => {
            const selected =
              category === item;

            return (
              <Pressable
                key={item}
                style={[
                  styles.category,
                  selected &&
                    styles.categorySelected,
                ]}
                onPress={() =>
                  setCategory(item)
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.reminderRow}>
          <View
            style={styles.reminderContent}
          >
            <Text
              style={styles.reminderTitle}
            >
              Weekly reminder
            </Text>

            <Text
              style={styles.reminderText}
            >
              Notify me every {selectedDay}
              {" "}at this time.
            </Text>
          </View>

          <Switch
            value={reminderEnabled}
            onValueChange={
              setReminderEnabled
            }
            disabled={
              !time.trim() ||
              !timeValid
            }
          />
        </View>

        <Pressable
          style={[
            styles.addButton,
            !canAdd &&
              styles.addButtonDisabled,
          ]}
          disabled={!canAdd}
          onPress={addTask}
        >
          <Text
            style={styles.addButtonText}
          >
            {isAdding
              ? "Adding..."
              : `+ Add to ${selectedDay}`}
          </Text>
        </Pressable>
      </View>

      <View
        style={styles.sectionHeader}
      >
        <View>
          <Text
            style={styles.sectionTitle}
          >
            {selectedDay}
          </Text>

          {selectedItems.length > 0 && (
            <Text
              style={styles.progressText}
            >
              {completedCount} of{" "}
              {selectedItems.length} completed
            </Text>
          )}
        </View>

        <Text style={styles.count}>
          {selectedItems.length}{" "}
          {selectedItems.length === 1
            ? "item"
            : "items"}
        </Text>
      </View>

      {!isLoaded ? (
        <View style={styles.emptyCard}>
          <Text
            style={styles.emptyTitle}
          >
            Loading your week...
          </Text>
        </View>
      ) : selectedItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text
            style={styles.emptyIcon}
          >
            📅
          </Text>

          <Text
            style={styles.emptyTitle}
          >
            Nothing planned for{" "}
            {selectedDay}
          </Text>

          <Text
            style={styles.emptyText}
          >
            Add your first item for this day.
          </Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          {selectedItems.map(
            (item) => (
              <View
                key={item.id}
                style={[
                  styles.taskCard,
                  item.completed &&
                    styles.taskCardCompleted,
                ]}
              >
                <Pressable
                  style={[
                    styles.checkButton,
                    item.completed &&
                      styles.checkButtonCompleted,
                  ]}
                  onPress={() =>
                    toggleTask(item.id)
                  }
                >
                  <Text
                    style={styles.checkText}
                  >
                    {item.completed
                      ? "✓"
                      : ""}
                  </Text>
                </Pressable>

                <View
                  style={styles.taskContent}
                >
                  <Text
                    style={[
                      styles.taskTitle,
                      item.completed &&
                        styles.taskTitleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <View
                    style={styles.metaRow}
                  >
                    <Text
                      style={styles.taskCategory}
                    >
                      {item.category}
                    </Text>

                    {item.time && (
                      <Text
                        style={styles.taskTime}
                      >
                        {item.time}
                      </Text>
                    )}
                  </View>

                  {item.reminderEnabled && (
                    <Text
                      style={styles.reminderBadge}
                    >
                      🔔 Weekly reminder active
                    </Text>
                  )}
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() =>
                    deleteTask(item)
                  }
                >
                  <Text
                    style={styles.deleteText}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            )
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },

  eyebrow: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },

  title: {
    marginTop: 8,
    color: "#0F172A",
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 16,
    lineHeight: 24,
  },

  weekSummary: {
    marginTop: 24,
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 18,
  },

  weekSummaryTitle: {
    color: "#86EFAC",
    fontSize: 13,
    fontWeight: "800",
  },

  weekSummaryValue: {
    marginTop: 7,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  dayRow: {
    gap: 10,
    paddingVertical: 24,
  },

  dayButton: {
    minWidth: 62,
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  dayButtonSelected: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  dayText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "800",
  },

  dayTextSelected: {
    color: "#FFFFFF",
  },

  dayCount: {
    marginTop: 7,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  dayCountSelected: {
    backgroundColor: "#FFFFFF",
  },

  dayCountText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
  },

  dayCountTextSelected: {
    color: "#15803D",
  },

  addCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    padding: 18,
  },

  selectedDayTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
  },

  label: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 9,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#0F172A",
    fontSize: 16,
    marginBottom: 20,
  },

  inputError: {
    borderColor: "#EF4444",
    marginBottom: 7,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginBottom: 18,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  category: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  categorySelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
  },

  categoryText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  categoryTextSelected: {
    color: "#15803D",
  },

  reminderRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 15,
  },

  reminderContent: {
    flex: 1,
    paddingRight: 16,
  },

  reminderTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
  },

  reminderText: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
  },

  addButton: {
    marginTop: 20,
    backgroundColor: "#22C55E",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  addButtonDisabled: {
    opacity: 0.35,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "800",
  },

  progressText: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },

  count: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    marginTop: 12,
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  taskList: {
    gap: 12,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 15,
  },

  taskCardCompleted: {
    backgroundColor: "#F8FAFC",
  },

  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  checkButtonCompleted: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },

  checkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },

  taskTitleCompleted: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },

  metaRow: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  taskCategory: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },

  taskTime: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "700",
  },

  reminderBadge: {
    marginTop: 7,
    color: "#15803D",
    fontSize: 12,
    fontWeight: "700",
  },

  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  deleteText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "700",
  },
});