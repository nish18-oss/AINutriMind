import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AddTaskCard, {
  PlannerCategory,
} from "@/components/planner/AddTaskCard";

import PlannerTimeline, {
  PlannerTimelineItem,
} from "@/components/planner/PlannerTimeline";

import { AppTheme } from "@/constants/theme";

import {
  cancelPlannerReminder,
  isValidPlannerTime,
  PlannerDayKey,
  scheduleWeeklyPlannerReminder,
} from "@/services/notifications/planner-notifications";

type PlanItem = {
  id: string;
  title: string;
  category: PlannerCategory;
  time: string;
  reminderEnabled: boolean;
  notificationId: string | null;
  completed: boolean;
};

type WeeklyPlan = Record<PlannerDayKey, PlanItem[]>;

const STORAGE_KEY =
  "@ainutrimind_weekly_planner";

const days: PlannerDayKey[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
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

function getTodayPlannerDay(): PlannerDayKey {
  const day = new Date().getDay();

  const map: PlannerDayKey[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  return map[day];
}

export default function PlannerScreen() {
  const [selectedDay, setSelectedDay] =
    useState<PlannerDayKey>(
      getTodayPlannerDay()
    );

  const [task, setTask] = useState("");

  const [time, setTime] = useState("");

  const [category, setCategory] =
    useState<PlannerCategory>("Personal");

  const [
    reminderEnabled,
    setReminderEnabled,
  ] = useState(false);

  const [weeklyPlan, setWeeklyPlan] =
    useState<WeeklyPlan>(emptyPlan);

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [isAdding, setIsAdding] =
    useState(false);

  const [
    showAddTask,
    setShowAddTask,
  ] = useState(false);

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
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) {
        return;
      }

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
    } catch (error) {
      console.log(
        "Could not load planner:",
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
      id:
        typeof item.id === "string"
          ? item.id
          : Date.now().toString(),

      title:
        typeof item.title === "string"
          ? item.title
          : "",

      category:
        isPlannerCategory(item.category)
          ? item.category
          : "Personal",

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

  function isPlannerCategory(
    value: unknown
  ): value is PlannerCategory {
    return (
      value === "Meal" ||
      value === "Workout" ||
      value === "Work / College" ||
      value === "Personal"
    );
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
        "Could not save planner:",
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

    if (!cleanTime) {
      Alert.alert(
        "Time required",
        "Choose a time for this item."
      );

      return;
    }

    if (
      !isValidPlannerTime(cleanTime)
    ) {
      Alert.alert(
        "Invalid time",
        "Enter time like 6:00 PM or 18:00."
      );

      return;
    }

    setIsAdding(true);

    try {
      let notificationId:
        | string
        | null = null;

      let finalReminderEnabled =
        reminderEnabled;

      if (reminderEnabled) {
        notificationId =
          await scheduleWeeklyPlannerReminder(
            {
              day: selectedDay,
              time: cleanTime,
              taskTitle: cleanTask,
            }
          );

        if (!notificationId) {
          finalReminderEnabled = false;

          Alert.alert(
            "Reminder not enabled",
            "The item was added, but notification permission was not available."
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

      clearComposer();

      setShowAddTask(false);
    } catch (error) {
      console.log(
        "Could not add planner item:",
        error
      );

      Alert.alert(
        "Something went wrong",
        "AINutriMind could not add this item."
      );
    } finally {
      setIsAdding(false);
    }
  }

  function clearComposer() {
    setTask("");
    setTime("");
    setCategory("Personal");
    setReminderEnabled(false);
  }

  function closeComposer() {
    clearComposer();
    setShowAddTask(false);
  }

  function toggleTask(id: string) {
    setWeeklyPlan((current) => ({
      ...current,

      [selectedDay]:
        current[selectedDay].map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  completed:
                    !item.completed,
                }
              : item
        ),
    }));
  }

  function requestDelete(
    timelineItem: PlannerTimelineItem
  ) {
    const item =
      weeklyPlan[selectedDay].find(
        (currentItem) =>
          currentItem.id ===
          timelineItem.id
      );

    if (!item) {
      return;
    }

    Alert.alert(
      "Remove from your flow?",
      item.title,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Remove",
          style: "destructive",

          onPress: () => {
            deleteTask(item);
          },
        },
      ]
    );
  }

  async function deleteTask(
    item: PlanItem
  ) {
    try {
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
    } catch (error) {
      console.log(
        "Could not delete planner item:",
        error
      );
    }
  }

  const selectedItems =
    weeklyPlan[selectedDay];

  const completedCount =
    selectedItems.filter(
      (item) => item.completed
    ).length;

  const weeklyTaskCount = useMemo(
    () =>
      days.reduce(
        (total, day) =>
          total +
          weeklyPlan[day].length,
        0
      ),
    [weeklyPlan]
  );

  const completionPercent =
    selectedItems.length === 0
      ? 0
      : Math.round(
          (completedCount /
            selectedItems.length) *
            100
        );

  const todayDay =
    getTodayPlannerDay();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            YOUR FLOW
          </Text>

          <Text style={styles.title}>
            Planner
          </Text>
        </View>

        <Pressable
          style={styles.addCircle}
          onPress={() =>
            setShowAddTask(
              (current) => !current
            )
          }
        >
          <Ionicons
            name={
              showAddTask
                ? "close"
                : "add"
            }
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryMain}>
            {weeklyTaskCount}
          </Text>

          <Text style={styles.summaryLabel}>
            moments this week
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View>
          <Text style={styles.summaryMain}>
            {completedCount}
          </Text>

          <Text style={styles.summaryLabel}>
            completed today
          </Text>
        </View>
      </View>

      {/* Day selector */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.dayRow
        }
      >
        {days.map((day) => {
          const selected =
            selectedDay === day;

          const isToday =
            todayDay === day;

          const itemCount =
            weeklyPlan[day].length;

          return (
            <Pressable
              key={day}
              style={[
                styles.dayButton,

                selected &&
                  styles.dayButtonSelected,
              ]}
              onPress={() => {
                setSelectedDay(day);
                setShowAddTask(false);
                clearComposer();
              }}
            >
              <Text
                style={[
                  styles.dayText,

                  selected &&
                    styles.dayTextSelected,
                ]}
              >
                {day.charAt(0)}
              </Text>

              {isToday && (
                <View
                  style={[
                    styles.todayDot,

                    selected &&
                      styles.todayDotSelected,
                  ]}
                />
              )}

              {!isToday &&
                itemCount > 0 && (
                  <Text
                    style={[
                      styles.dayCount,

                      selected &&
                        styles.dayCountSelected,
                    ]}
                  >
                    {itemCount}
                  </Text>
                )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Add task */}

      {showAddTask && (
        <AddTaskCard
          dayLabel={selectedDay}
          title={task}
          onTitleChange={setTask}
          time={time}
          onTimeChange={setTime}
          category={category}
          onCategoryChange={
            setCategory
          }
          reminderEnabled={
            reminderEnabled
          }
          onReminderChange={
            setReminderEnabled
          }
          onAdd={addTask}
          onClose={closeComposer}
        />
      )}

      {/* Current day */}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>
            {selectedDay === todayDay
              ? "TODAY"
              : selectedDay.toUpperCase()}
          </Text>

          <Text style={styles.sectionTitle}>
            Daily flow
          </Text>
        </View>

        {selectedItems.length > 0 && (
          <View style={styles.percentBadge}>
            <Text style={styles.percentText}>
              {completionPercent}%
            </Text>
          </View>
        )}
      </View>

      {!isLoaded ? (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>
            Loading your flow...
          </Text>
        </View>
      ) : (
        <PlannerTimeline
          items={selectedItems}
          onToggle={toggleTask}
          onDelete={requestDelete}
        />
      )}

      {/* Intelligence */}

      {selectedItems.length > 0 && (
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.sparkleCircle}>
              <Ionicons
                name="sparkles-outline"
                size={18}
                color="#A7F3D0"
              />
            </View>

            <Text style={styles.insightLabel}>
              FLOW INSIGHT
            </Text>
          </View>

          <Text style={styles.insightTitle}>
            Your day has structure
          </Text>

          <Text style={styles.insightText}>
            AINutriMind will eventually
            connect this schedule with your
            nutrition, activity and reminders
            so guidance appears when it is
            actually useful.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      AppTheme.colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eyebrow: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },

  title: {
    marginTop: 4,
    color: AppTheme.colors.ink,
    fontSize: 32,
    fontWeight: "800",
  },

  addCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor:
      AppTheme.colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryRow: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor:
      AppTheme.colors.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryMain: {
    color: AppTheme.colors.ink,
    fontSize: 20,
    fontWeight: "800",
  },

  summaryLabel: {
    marginTop: 2,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },

  summaryDivider: {
    width: 1,
    height: 34,
    marginHorizontal: 22,
    backgroundColor:
      AppTheme.colors.border,
  },

  dayRow: {
    gap: 9,
    paddingTop: 22,
    paddingBottom: 8,
  },

  dayButton: {
    width: 44,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  dayButtonSelected: {
    borderColor:
      AppTheme.colors.ink,
    backgroundColor:
      AppTheme.colors.ink,
  },

  dayText: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "800",
  },

  dayTextSelected: {
    color: "#FFFFFF",
  },

  todayDot: {
    width: 5,
    height: 5,
    marginTop: 5,
    borderRadius: 3,
    backgroundColor:
      AppTheme.colors.accent,
  },

  todayDotSelected: {
    backgroundColor: "#A7F3D0",
  },

  dayCount: {
    marginTop: 3,
    color:
      AppTheme.colors.textMuted,
    fontSize: 9,
    fontWeight: "800",
  },

  dayCountSelected: {
    color: "#CBD5E1",
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionEyebrow: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  sectionTitle: {
    marginTop: 4,
    color: AppTheme.colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },

  percentBadge: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor:
      AppTheme.colors.accentSoft,
  },

  percentText: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 11,
    fontWeight: "800",
  },

  loading: {
    marginTop: 20,
    padding: 30,
    alignItems: "center",
  },

  loadingText: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 13,
  },

  insightCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor:
      AppTheme.colors.darkSurface,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  sparkleCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor:
      AppTheme.colors.darkSurfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  insightLabel: {
    marginLeft: 10,
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  insightTitle: {
    marginTop: 16,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  insightText: {
    marginTop: 7,
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
  },
});