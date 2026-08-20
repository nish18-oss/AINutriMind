import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppTheme } from "@/constants/theme";
import {
  calculateNutritionTotals,
  getNutritionEntries,
  getTodayNutritionEntries,
} from "@/lib/nutrition-storage";
import {
  calculateNutritionTargets,
} from "@/lib/nutrition-targets";
import { useOnboarding } from "@/lib/onboarding-context";

export default function HomeScreen() {
  const { data } = useOnboarding();

  const [proteinConsumed, setProteinConsumed] =
    useState(0);

  const [caloriesConsumed, setCaloriesConsumed] =
    useState(0);

  const targets = useMemo(
    () =>
      calculateNutritionTargets({
        goal: data.goal,
        weight: data.weight,
        activityLevel: data.activityLevel,
      }),
    [
      data.goal,
      data.weight,
      data.activityLevel,
    ]
  );

  const proteinRemaining = Math.max(
    targets.protein - proteinConsumed,
    0
  );

  const calorieRemaining = Math.max(
    targets.calories - caloriesConsumed,
    0
  );

  const proteinProgress = Math.min(
    targets.protein > 0
      ? (proteinConsumed / targets.protein) * 100
      : 0,
    100
  );

  const proteinComplete =
    proteinConsumed >= targets.protein;

  const loadNutrition = useCallback(async () => {
    const entries =
      await getNutritionEntries();

    const todayEntries =
      getTodayNutritionEntries(entries);

    const totals =
      calculateNutritionTotals(todayEntries);

    setProteinConsumed(totals.protein);
    setCaloriesConsumed(totals.calories);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNutrition();
    }, [loadNutrition])
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Good afternoon
          </Text>

          <Text style={styles.name}>
            Nishant
          </Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() =>
            router.push("/profile" as any)
          }
        >
          <Ionicons
            name="person-outline"
            size={21}
            color={AppTheme.colors.ink}
          />
        </Pressable>
      </View>

      <Text style={styles.date}>
        TODAY
      </Text>

      <View style={styles.balanceSection}>
        <View style={styles.balanceRing}>
          <Text style={styles.balanceNumber}>
            {proteinComplete ? "✓" : "72"}
          </Text>

          <Text style={styles.balanceLabel}>
            DAY BALANCE
          </Text>

          <Text style={styles.balanceStatus}>
            {proteinComplete
              ? "Protein complete"
              : "On track"}
          </Text>
        </View>

        <View style={styles.signals}>
          <Text style={styles.signalActive}>
            ● Nutrition
          </Text>

          <Text style={styles.signalActive}>
            ● Routine
          </Text>

          <Text style={styles.signalMuted}>
            ○ Activity
          </Text>
        </View>
      </View>

      <View style={styles.nowCard}>
        <View style={styles.nowHeader}>
          <Text style={styles.nowLabel}>
            ● NOW
          </Text>

          <Ionicons
            name="sparkles-outline"
            size={20}
            color="#A7F3D0"
          />
        </View>

        <Text style={styles.nowTitle}>
          {proteinComplete
            ? "Protein target complete"
            : proteinConsumed === 0
            ? "Start today’s nutrition"
            : "Protein needs attention"}
        </Text>

        <Text style={styles.nowBody}>
          {proteinComplete
            ? "You have reached today’s protein target. Keep the rest of your meals balanced."
            : proteinConsumed === 0
            ? "Log your first meal so AINutriMind can track your protein progress throughout the day."
            : "You are still below today’s protein target. A protein-rich next meal can help close the gap."}
        </Text>

        <View style={styles.proteinRow}>
          <View>
            <Text style={styles.proteinMain}>
              {proteinConsumed}g
            </Text>

            <Text style={styles.proteinCaption}>
              consumed
            </Text>
          </View>

          <View style={styles.targetBox}>
            <Text style={styles.proteinTarget}>
              {targets.protein}g
            </Text>

            <Text style={styles.proteinCaption}>
              target
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${proteinProgress}%`,
              },
            ]}
          />
        </View>

        <View style={styles.progressInfo}>
          <Text style={styles.remaining}>
            {proteinComplete
              ? "Target completed"
              : `${proteinRemaining}g remaining today`}
          </Text>

          <Text style={styles.goalAware}>
            GOAL-AWARE
          </Text>
        </View>

        <View style={styles.calorieStrip}>
          <View>
            <Text style={styles.calorieLabel}>
              Calories
            </Text>

            <Text style={styles.calorieValue}>
              {caloriesConsumed} / {targets.calories}
            </Text>
          </View>

          <Text style={styles.calorieRemaining}>
            {calorieRemaining} left
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push("/nutrition" as any)
          }
        >
          <Text style={styles.primaryButtonText}>
            {proteinComplete
              ? "View nutrition"
              : proteinConsumed === 0
              ? "Log my first meal"
              : "Add protein"}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <View style={styles.quickRow}>
        <Pressable
          style={styles.quickButton}
          onPress={() =>
            router.push("/nutrition" as any)
          }
        >
          <Ionicons
            name="restaurant-outline"
            size={21}
            color={AppTheme.colors.accentDark}
          />

          <Text style={styles.quickText}>
            Nutrition
          </Text>
        </Pressable>

        <Pressable
          style={styles.quickButton}
          onPress={() =>
            router.push("/planner" as any)
          }
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color={AppTheme.colors.accentDark}
          />

          <Text style={styles.quickText}>
            Planner
          </Text>
        </Pressable>

        <Pressable
          style={styles.quickButton}
          onPress={() =>
            router.push("/coach" as any)
          }
        >
          <Ionicons
            name="sparkles-outline"
            size={21}
            color={AppTheme.colors.accentDark}
          />

          <Text style={styles.quickText}>
            Ask AI
          </Text>
        </Pressable>
      </View>

      <View style={styles.tonightCard}>
        <View style={styles.moonCircle}>
          <Ionicons
            name="moon-outline"
            size={20}
            color={AppTheme.colors.accentDark}
          />
        </View>

        <View style={styles.tonightContent}>
          <Text style={styles.tonightTitle}>
            Tonight
          </Text>

          <Text style={styles.tonightText}>
            Your end-of-day check-in will use today’s
            nutrition progress before your usual sleep time.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: AppTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  name: {
    marginTop: 2,
    color: AppTheme.colors.ink,
    fontSize: 28,
    fontWeight: "800",
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  date: {
    marginTop: 22,
    color: AppTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  balanceSection: {
    marginTop: 28,
    alignItems: "center",
  },

  balanceRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 13,
    borderColor: AppTheme.colors.accentSoft,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  balanceNumber: {
    color: AppTheme.colors.ink,
    fontSize: 44,
    fontWeight: "800",
  },

  balanceLabel: {
    color: AppTheme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  balanceStatus: {
    marginTop: 4,
    color: AppTheme.colors.accentDark,
    fontSize: 11,
    fontWeight: "700",
  },

  signals: {
    marginTop: 16,
    flexDirection: "row",
    gap: 16,
  },

  signalActive: {
    color: AppTheme.colors.accentDark,
    fontSize: 12,
    fontWeight: "700",
  },

  signalMuted: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  nowCard: {
    marginTop: 28,
    padding: 22,
    borderRadius: 28,
    backgroundColor: AppTheme.colors.darkSurface,
  },

  nowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nowLabel: {
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  nowTitle: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 30,
  },

  nowBody: {
    marginTop: 9,
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
  },

  proteinRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  proteinMain: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
  },

  targetBox: {
    alignItems: "flex-end",
  },

  proteinTarget: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  proteinCaption: {
    marginTop: 2,
    color: "#98A2B3",
    fontSize: 11,
  },

  progressTrack: {
    height: 8,
    marginTop: 13,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: AppTheme.colors.darkBorder,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: AppTheme.colors.accentBright,
  },

  progressInfo: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  remaining: {
    color: "#A7F3D0",
    fontSize: 12,
    fontWeight: "700",
  },

  goalAware: {
    color: "#98A2B3",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  calorieStrip: {
    marginTop: 18,
    padding: 13,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.darkSurfaceSoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  calorieLabel: {
    color: "#98A2B3",
    fontSize: 10,
    fontWeight: "700",
  },

  calorieValue: {
    marginTop: 3,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  calorieRemaining: {
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "700",
  },

  primaryButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: AppTheme.colors.accent,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  quickRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },

  quickButton: {
    flex: 1,
    height: 78,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  quickText: {
    marginTop: 7,
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },

  tonightCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
  },

  moonCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: AppTheme.colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  tonightContent: {
    flex: 1,
    marginLeft: 12,
  },

  tonightTitle: {
    color: AppTheme.colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },

  tonightText: {
    marginTop: 3,
    color: AppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});