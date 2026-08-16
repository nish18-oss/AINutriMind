import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useOnboarding } from "@/lib/onboarding-context";

export default function ProfileScreen() {
  const { data } = useOnboarding();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>
        PROFILE
      </Text>

      <Text style={styles.title}>
        Your health profile
      </Text>

      <Text style={styles.subtitle}>
        Review and update the information AINutriMind uses
        to personalize your plan.
      </Text>

      <View style={styles.card}>
        <ProfileRow
          label="Goal"
          value={data.goal ?? "Not set"}
        />

        <ProfileRow
          label="Age"
          value={data.age || "Not set"}
        />

        <ProfileRow
          label="Height"
          value={
            data.height
              ? `${data.height} cm`
              : "Not set"
          }
        />

        <ProfileRow
          label="Weight"
          value={
            data.weight
              ? `${data.weight} kg`
              : "Not set"
          }
        />

        <ProfileRow
          label="Activity"
          value={
            data.activityLevel ??
            "Not set"
          }
        />

        <ProfileRow
          label="Diet"
          value={
            data.dietPreference ??
            "Not set"
          }
        />
      </View>

      <Text style={styles.sectionTitle}>
        Edit your information
      </Text>

      <Pressable
        style={styles.actionCard}
        onPress={() =>
          router.push(
            "/onboarding/routine"
          )
        }
      >
        <View style={styles.actionIcon}>
          <Text style={styles.actionEmoji}>
            ⏰
          </Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Daily Routine
          </Text>

          <Text style={styles.actionText}>
            Update wake time, sleep time and your daily schedule.
          </Text>
        </View>

        <Text style={styles.chevron}>
          ›
        </Text>
      </Pressable>

      <Pressable
        style={styles.actionCard}
        onPress={() =>
          router.push(
            "/onboarding/profile"
          )
        }
      >
        <View style={styles.actionIcon}>
          <Text style={styles.actionEmoji}>
            ❤️
          </Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Health Profile
          </Text>

          <Text style={styles.actionText}>
            Update age, height, weight, activity and diet.
          </Text>
        </View>

        <Text style={styles.chevron}>
          ›
        </Text>
      </Pressable>
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

  card: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    paddingHorizontal: 18,
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
    maxWidth: "58%",
    textAlign: "right",
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 14,
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800",
  },

  actionCard: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },

  actionEmoji: {
    fontSize: 22,
  },

  actionContent: {
    flex: 1,
    marginLeft: 14,
  },

  actionTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },

  actionText: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },

  chevron: {
    marginLeft: 12,
    color: "#94A3B8",
    fontSize: 28,
    fontWeight: "400",
  },
});