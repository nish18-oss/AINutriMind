import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PlannerDayKey =
  | "Mon"
  | "Tue"
  | "Wed"
  | "Thu"
  | "Fri"
  | "Sat"
  | "Sun";

const CHANNEL_ID = "planner-reminders";

const weekdayMap: Record<PlannerDayKey, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configurePlannerNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      CHANNEL_ID,
      {
        name: "Planner reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      }
    );
  }

  const currentPermissions =
    await Notifications.getPermissionsAsync();

  if (currentPermissions.status === "granted") {
    return true;
  }

  const requestedPermissions =
    await Notifications.requestPermissionsAsync();

  return requestedPermissions.status === "granted";
}

export function parsePlannerTime(
  value: string
): {
  hour: number;
  minute: number;
} | null {
  const cleanValue = value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

  const twelveHourMatch = cleanValue.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (twelveHourMatch) {
    let hour = Number(twelveHourMatch[1]);
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3];

    if (
      hour < 1 ||
      hour > 12 ||
      minute < 0 ||
      minute > 59
    ) {
      return null;
    }

    if (period === "AM") {
      if (hour === 12) {
        hour = 0;
      }
    } else {
      if (hour !== 12) {
        hour += 12;
      }
    }

    return {
      hour,
      minute,
    };
  }

  const twentyFourHourMatch = cleanValue.match(
    /^(\d{1,2}):(\d{2})$/
  );

  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);

    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return null;
    }

    return {
      hour,
      minute,
    };
  }

  return null;
}

export function isValidPlannerTime(
  value: string
) {
  return parsePlannerTime(value) !== null;
}

export async function scheduleWeeklyPlannerReminder({
  day,
  time,
  taskTitle,
}: {
  day: PlannerDayKey;
  time: string;
  taskTitle: string;
}) {
  const allowed =
    await configurePlannerNotifications();

  if (!allowed) {
    return null;
  }

  const parsedTime = parsePlannerTime(time);

  if (!parsedTime) {
    return null;
  }

  const identifier =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "AINutriMind Reminder",
        body: `${taskTitle} • ${time}`,
        sound: "default",
        data: {
          type: "planner-reminder",
          day,
          taskTitle,
        },
      },

      trigger: {
        type: Notifications
          .SchedulableTriggerInputTypes.WEEKLY,
        weekday: weekdayMap[day],
        hour: parsedTime.hour,
        minute: parsedTime.minute,
        channelId: CHANNEL_ID,
      },
    });

  return identifier;
}

export async function cancelPlannerReminder(
  identifier?: string | null
) {
  if (!identifier) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(
      identifier
    );
  } catch (error) {
    console.log(
      "Could not cancel planner reminder:",
      error
    );
  }
}