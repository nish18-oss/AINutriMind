import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PlanItem = {
  id: number;
  title: string;
  category: string;
};

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

  function addTask() {
    const cleanTask = task.trim();

    if (!cleanTask) {
      return;
    }

    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        title: cleanTask,
        category,
      },
    ]);

    setTask("");
  }

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
        Organize meals, workouts, work and personal tasks in one place.
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
                  selected && styles.categorySelected,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
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
            !task.trim() && styles.addButtonDisabled,
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
        <Text style={styles.sectionTitle}>
          Today
        </Text>

        <Text style={styles.count}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📋
          </Text>

          <Text style={styles.emptyTitle}>
            Your day is clear
          </Text>

          <Text style={styles.emptyText}>
            Add your first task above. Later, AINutriMind will also suggest
            tasks automatically based on your goals and routine.
          </Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          {items.map((item) => (
            <View
              key={item.id}
              style={styles.taskCard}
            >
              <View style={styles.taskIndicator} />

              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>
                  {item.title}
                </Text>

                <Text style={styles.taskCategory}>
                  {item.category}
                </Text>
              </View>
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
    padding: 16,
  },

  taskIndicator: {
    width: 5,
    height: 42,
    backgroundColor: "#22C55E",
    borderRadius: 10,
    marginRight: 14,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },

  taskCategory: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
});