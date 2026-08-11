import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PlanItem = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
};

const STORAGE_KEY = "@ainutrimind_planner_items";

const categories = [
  "Meal",
  "Workout",
  "Work / College",
  "Personal",
];

export default function PlannerScreen() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Personal");
  const [items, setItems] = useState<PlanItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTasks(items);
    }
  }, [items, isLoaded]);

  async function loadTasks() {
    try {
      const savedTasks =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        const parsedTasks: PlanItem[] =
          JSON.parse(savedTasks);

        setItems(parsedTasks);
      }
    } catch (error) {
      console.log("Could not load planner tasks:", error);
    } finally {
      setIsLoaded(true);
    }
  }

  async function saveTasks(tasks: PlanItem[]) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.log("Could not save planner tasks:", error);
    }
  }

  function addTask() {
    const cleanTask = task.trim();

    if (!cleanTask) {
      return;
    }

    const newTask: PlanItem = {
      id: Date.now().toString(),
      title: cleanTask,
      category,
      completed: false,
    };

    setItems((current) => [
      ...current,
      newTask,
    ]);

    setTask("");
  }

  function toggleTask(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );
  }

  function deleteTask(id: string) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  const completedCount =
    items.filter((item) => item.completed).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>
        DAILY PLANNER
      </Text>

      <Text style={styles.title}>
        Plan your day
      </Text>

      <Text style={styles.subtitle}>
        Organize meals, workouts, work and personal
        tasks in one place.
      </Text>

      <View style={styles.addCard}>
        <Text style={styles.label}>
          What do you need to do?
        </Text>

        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Example: Gym at 6 PM"
          placeholderTextColor="#94A3B8"
          returnKeyType="done"
          onSubmitEditing={addTask}
        />

        <Text style={styles.label}>
          Category
        </Text>

        <View style={styles.categories}>
          {categories.map((item) => {
            const selected = category === item;

            return (
              <Pressable
                key={item}
                style={[
                  styles.category,
                  selected &&
                    styles.categorySelected,
                ]}
                onPress={() => setCategory(item)}
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

        <Pressable
          style={[
            styles.addButton,
            !task.trim() &&
              styles.addButtonDisabled,
          ]}
          disabled={!task.trim()}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>
            + Add to Today
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Today
          </Text>

          {items.length > 0 && (
            <Text style={styles.progressText}>
              {completedCount} of {items.length} completed
            </Text>
          )}
        </View>

        <Text style={styles.count}>
          {items.length}{" "}
          {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {!isLoaded ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Loading your planner...
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📋
          </Text>

          <Text style={styles.emptyTitle}>
            Your day is clear
          </Text>

          <Text style={styles.emptyText}>
            Add your first task above. Later,
            AINutriMind will suggest tasks based on
            your goals and routine.
          </Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          {items.map((item) => (
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
                <Text style={styles.checkText}>
                  {item.completed ? "✓" : ""}
                </Text>
              </Pressable>

              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed &&
                      styles.taskTitleCompleted,
                  ]}
                >
                  {item.title}
                </Text>

                <Text style={styles.taskCategory}>
                  {item.category}
                </Text>
              </View>

              <Pressable
                style={styles.deleteButton}
                onPress={() =>
                  deleteTask(item.id)
                }
              >
                <Text style={styles.deleteText}>
                  Delete
                </Text>
              </Pressable>
            </View>
          ))}
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

  addCard: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    padding: 18,
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

  taskCategory: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
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