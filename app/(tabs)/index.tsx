import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useOnboarding } from "@/lib/onboarding-context";

export default function DashboardScreen() {
  const { data } = useOnboarding();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome to AINutriMind
          </Text>

          <Text style={styles.goal}>
            Goal: {data.goal ?? "Personal wellness"}
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>
          YOUR AI PLAN
        </Text>

        <Text style={styles.heroTitle}>
          Today is built around your routine
        </Text>

        <Text style={styles.heroText}>
          Wake at {data.wakeTime || "your usual time"},
          sleep at {data.sleepTime || "your usual time"}.
          AINutriMind will use this schedule to organize
          nutrition, reminders and daily health tasks.
        </Text>

        <Pressable style={styles.heroButton}>
          <Text style={styles.heroButtonText}>
            View Today&apos;s Plan
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>
        Today&apos;s Focus
      </Text>

      <View style={styles.focusGrid}>
        <View style={styles.focusCard}>
          <Text style={styles.focusIcon}>🍽️</Text>
          <Text style={styles.focusTitle}>
            Nutrition
          </Text>
          <Text style={styles.focusText}>
            {data.dietPreference ?? "Personalized"} meals
          </Text>
        </View>

        <View style={styles.focusCard}>
          <Text style={styles.focusIcon}>🏃</Text>
          <Text style={styles.focusTitle}>
            Activity
          </Text>
          <Text style={styles.focusText}>
            {data.activityLevel ?? "Balanced"} activity
          </Text>
        </View>

        <View style={styles.focusCard}>
          <Text style={styles.focusIcon}>⏰</Text>
          <Text style={styles.focusTitle}>
            Routine
          </Text>
          <Text style={styles.focusText}>
            {data.wakeTime || "Set schedule"}
          </Text>
        </View>

        <View style={styles.focusCard}>
          <Text style={styles.focusIcon}>🤖</Text>
          <Text style={styles.focusTitle}>
            AI Coach
          </Text>
          <Text style={styles.focusText}>
            Personalized guidance
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Your Profile
      </Text>

      <View style={styles.profileCard}>
        <ProfileRow
          label="Age"
          value={data.age || "—"}
        />

        <ProfileRow
          label="Height"
          value={
            data.height
              ? `${data.height} cm`
              : "—"
          }
        />

        <ProfileRow
          label="Weight"
          value={
            data.weight
              ? `${data.weight} kg`
              : "—"
          }
        />

        <ProfileRow
          label="Diet"
          value={data.dietPreference ?? "—"}
        />
      </View>

      <Text style={styles.sectionTitle}>
        AI Assistance
      </Text>

      <View style={styles.aiCard}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>

        <View style={styles.aiContent}>
          <Text style={styles.aiTitle}>
            Your health companion is ready
          </Text>

          <Text style={styles.aiText}>
            Soon, this section will turn your routine,
            goals and preferences into an adaptive daily
            plan.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>
        {label}
      </Text>

      <Text style={styles.profileValue}>
        {value}
      </Text>
    </View>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  goal: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#15803D",
    fontSize: 15,
    fontWeight: "800",
  },

  heroCard: {
    marginTop: 28,
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 22,
  },

  heroEyebrow: {
    color: "#86EFAC",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  heroTitle: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 31,
  },

  heroText: {
    marginTop: 12,
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
  },

  heroButton: {
    marginTop: 20,
    backgroundColor: "#22C55E",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  heroButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 14,
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800",
  },

  focusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  focusCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  focusIcon: {
    fontSize: 26,
  },

  focusTitle: {
    marginTop: 12,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },

  focusText: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  profileLabel: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },

  profileValue: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
  },

  aiCard: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  aiBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },

  aiBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  aiContent: {
    flex: 1,
    marginLeft: 14,
  },

  aiTitle: {
    color: "#14532D",
    fontSize: 16,
    fontWeight: "800",
  },

  aiText: {
    marginTop: 5,
    color: "#3F6212",
    fontSize: 14,
    lineHeight: 21,
  },
});