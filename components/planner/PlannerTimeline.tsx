import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppTheme } from "@/constants/theme";

export type PlannerTimelineItem = {
  id: string;
  title: string;
  category: string;
  time: string;
  completed: boolean;
  reminderEnabled: boolean;
};

type PlannerTimelineProps = {
  items: PlannerTimelineItem[];
  onToggle: (id: string) => void;
  onDelete: (item: PlannerTimelineItem) => void;
};

export default function PlannerTimeline({
  items,
  onToggle,
  onDelete,
}: PlannerTimelineProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color={AppTheme.colors.accentDark}
          />
        </View>

        <Text style={styles.emptyTitle}>
          Your day is clear
        </Text>

        <Text style={styles.emptyText}>
          Add meals, workouts, college, work or personal
          tasks when you need them.
        </Text>
      </View>
    );
  }

  const sortedItems = [...items].sort(
    (a, b) =>
      convertTimeToMinutes(a.time) -
      convertTimeToMinutes(b.time)
  );

  return (
    <View style={styles.timeline}>
      {sortedItems.map((item, index) => {
        const isLast =
          index === sortedItems.length - 1;

        return (
          <View
            key={item.id}
            style={styles.timelineRow}
          >
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>
                {item.time || "Anytime"}
              </Text>
            </View>

            <View style={styles.lineColumn}>
              <Pressable
                style={[
                  styles.timelineDot,
                  item.completed &&
                    styles.timelineDotCompleted,
                ]}
                onPress={() =>
                  onToggle(item.id)
                }
              >
                {item.completed && (
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color="#FFFFFF"
                  />
                )}
              </Pressable>

              {!isLast && (
                <View
                  style={styles.timelineLine}
                />
              )}
            </View>

            <View
              style={[
                styles.contentCard,
                item.completed &&
                  styles.contentCardCompleted,
              ]}
            >
              <View style={styles.contentTop}>
                <View style={styles.titleArea}>
                  <Text
                    style={[
                      styles.title,
                      item.completed &&
                        styles.titleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.category}>
                    {item.category}
                  </Text>
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() =>
                    onDelete(item)
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={
                      AppTheme.colors.textMuted
                    }
                  />
                </Pressable>
              </View>

              {item.reminderEnabled && (
                <View
                  style={styles.reminderRow}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={14}
                    color={
                      AppTheme.colors.accentDark
                    }
                  />

                  <Text
                    style={styles.reminderText}
                  >
                    Reminder active
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function convertTimeToMinutes(
  value: string
): number {
  const trimmed =
    value.trim().toUpperCase();

  if (!trimmed) {
    return Number.MAX_SAFE_INTEGER;
  }

  const twelveHourMatch =
    trimmed.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
    );

  if (twelveHourMatch) {
    let hour =
      Number(twelveHourMatch[1]);

    const minute =
      Number(twelveHourMatch[2]);

    const period =
      twelveHourMatch[3];

    if (hour === 12) {
      hour = 0;
    }

    if (period === "PM") {
      hour += 12;
    }

    return hour * 60 + minute;
  }

  const twentyFourHourMatch =
    trimmed.match(
      /^(\d{1,2}):(\d{2})$/
    );

  if (twentyFourHourMatch) {
    const hour =
      Number(
        twentyFourHourMatch[1]
      );

    const minute =
      Number(
        twentyFourHourMatch[2]
      );

    return hour * 60 + minute;
  }

  return Number.MAX_SAFE_INTEGER;
}

const styles = StyleSheet.create({
  timeline: {
    marginTop: 8,
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 4,
  },

  timeColumn: {
    width: 72,
    paddingTop: 15,
  },

  timeText: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  lineColumn: {
    width: 28,
    alignItems: "center",
  },

  timelineDot: {
    marginTop: 16,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor:
      AppTheme.colors.accent,
    backgroundColor:
      AppTheme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  timelineDotCompleted: {
    backgroundColor:
      AppTheme.colors.accent,
  },

  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 2,
    backgroundColor:
      AppTheme.colors.border,
  },

  contentCard: {
    flex: 1,
    minHeight: 76,
    marginBottom: 12,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
  },

  contentCardCompleted: {
    opacity: 0.62,
  },

  contentTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  titleArea: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    color: AppTheme.colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },

  titleCompleted: {
    color:
      AppTheme.colors.textMuted,
    textDecorationLine:
      "line-through",
  },

  category: {
    marginTop: 4,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  reminderRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  reminderText: {
    marginLeft: 5,
    color:
      AppTheme.colors.accentDark,
    fontSize: 11,
    fontWeight: "700",
  },

  emptyState: {
    marginTop: 12,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
    alignItems: "center",
  },

  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor:
      AppTheme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 14,
    color: AppTheme.colors.ink,
    fontSize: 17,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 7,
    maxWidth: 270,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});