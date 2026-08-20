import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppTheme } from "@/constants/theme";
import { calculateNutritionTargets } from "@/lib/nutrition-targets";
import { useOnboarding } from "@/lib/onboarding-context";

export default function ProfileScreen() {
  const { data } = useOnboarding();

  const targets = calculateNutritionTargets({
    goal: data.goal,
    weight: data.weight,
    activityLevel: data.activityLevel,
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            PROFILE
          </Text>

          <Text style={styles.title}>
            Your health profile
          </Text>
        </View>

        <View style={styles.profileIcon}>
          <Ionicons
            name="person-outline"
            size={22}
            color={AppTheme.colors.accentDark}
          />
        </View>
      </View>

      <Text style={styles.subtitle}>
        AINutriMind uses this information to personalize
        your nutrition targets and daily guidance.
      </Text>

      <View style={styles.targetCard}>
        <View style={styles.targetHeader}>
          <View>
            <Text style={styles.targetEyebrow}>
              CURRENT TARGETS
            </Text>

            <Text style={styles.targetTitle}>
              Your daily baseline
            </Text>
          </View>

          <Ionicons
            name="sparkles-outline"
            size={20}
            color="#A7F3D0"
          />
        </View>

        <View style={styles.targetNumbers}>
          <View style={styles.targetColumn}>
            <Text style={styles.targetLabel}>
              Calories
            </Text>

            <Text style={styles.targetValue}>
              {targets.calories}
            </Text>

            <Text style={styles.targetUnit}>
              kcal / day
            </Text>
          </View>

          <View style={styles.targetDivider} />

          <View style={styles.targetColumn}>
            <Text style={styles.targetLabel}>
              Protein
            </Text>

            <Text style={styles.targetValue}>
              {targets.protein}g
            </Text>

            <Text style={styles.targetUnit}>
              per day
            </Text>
          </View>
        </View>

        <Text style={styles.targetNote}>
          These are wellness estimates based on your
          current weight, activity and goal.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Personal details
      </Text>

      <View style={styles.card}>
        <ProfileRow
          icon="flag-outline"
          label="Goal"
          value={data.goal ?? "Not set"}
        />

        <ProfileRow
          icon="calendar-outline"
          label="Age"
          value={data.age || "Not set"}
        />

        <ProfileRow
          icon="resize-outline"
          label="Height"
          value={
            data.height
              ? `${data.height} cm`
              : "Not set"
          }
        />

        <ProfileRow
          icon="fitness-outline"
          label="Weight"
          value={
            data.weight
              ? `${data.weight} kg`
              : "Not set"
          }
        />

        <ProfileRow
          icon="walk-outline"
          label="Activity"
          value={
            data.activityLevel ??
            "Not set"
          }
        />

        <ProfileRow
          icon="restaurant-outline"
          label="Diet"
          value={
            data.dietPreference ??
            "Not set"
          }
          showBorder={false}
        />
      </View>

      <Text style={styles.sectionTitle}>
        Routine
      </Text>

      <View style={styles.card}>
        <ProfileRow
          icon="sunny-outline"
          label="Wake time"
          value={
            data.wakeTime ||
            "Not set"
          }
        />

        <ProfileRow
          icon="moon-outline"
          label="Sleep time"
          value={
            data.sleepTime ||
            "Not set"
          }
        />

        <ProfileRow
          icon="time-outline"
          label="Schedule"
          value={
            data.schedule ||
            "Not set"
          }
          showBorder={false}
        />
      </View>

      <Text style={styles.sectionTitle}>
        Edit information
      </Text>

      <Pressable
        style={styles.actionCard}
        onPress={() =>
          router.push(
            "/onboarding/profile"
          )
        }
      >
        <View style={styles.actionIcon}>
          <Ionicons
            name="heart-outline"
            size={21}
            color={AppTheme.colors.accentDark}
          />
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Health profile
          </Text>

          <Text style={styles.actionText}>
            Update age, height, weight, activity and
            diet preference.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={AppTheme.colors.textMuted}
        />
      </Pressable>

      <Pressable
        style={styles.actionCard}
        onPress={() =>
          router.push(
            "/onboarding/routine"
          )
        }
      >
        <View style={styles.actionIcon}>
          <Ionicons
            name="time-outline"
            size={21}
            color={AppTheme.colors.accentDark}
          />
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Daily routine
          </Text>

          <Text style={styles.actionText}>
            Update wake time, sleep time and your
            daily schedule.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={AppTheme.colors.textMuted}
        />
      </Pressable>
    </ScrollView>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  showBorder = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  showBorder?: boolean;
}) {
  return (
    <View
      style={[
        styles.profileRow,
        !showBorder &&
          styles.profileRowLast,
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons
            name={icon}
            size={17}
            color={AppTheme.colors.accentDark}
          />
        </View>

        <Text style={styles.profileLabel}>
          {label}
        </Text>
      </View>

      <Text style={styles.profileValue}>
        {value}
      </Text>
    </View>
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
    justifyContent:
      "space-between",
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
    fontSize: 30,
    fontWeight: "800",
  },

  profileIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor:
      AppTheme.colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  subtitle: {
    marginTop: 10,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  targetCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor:
      AppTheme.colors.darkSurface,
  },

  targetHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  targetEyebrow: {
    color: "#A7F3D0",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  targetTitle: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  targetNumbers: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
  },

  targetColumn: {
    flex: 1,
  },

  targetLabel: {
    color: "#98A2B3",
    fontSize: 10,
    fontWeight: "700",
  },

  targetValue: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  targetUnit: {
    marginTop: 2,
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "700",
  },

  targetDivider: {
    width: 1,
    height: 48,
    marginHorizontal: 20,
    backgroundColor:
      AppTheme.colors.darkBorder,
  },

  targetNote: {
    marginTop: 18,
    color: "#98A2B3",
    fontSize: 11,
    lineHeight: 17,
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    color: AppTheme.colors.ink,
    fontSize: 18,
    fontWeight: "800",
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
    paddingHorizontal: 16,
  },

  profileRow: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor:
      AppTheme.colors.border,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  profileRowLast: {
    borderBottomWidth: 0,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },

  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor:
      AppTheme.colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  profileLabel: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },

  profileValue: {
    maxWidth: "48%",
    color: AppTheme.colors.ink,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },

  actionCard: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      AppTheme.colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  actionContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  actionTitle: {
    color: AppTheme.colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },

  actionText: {
    marginTop: 3,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },
});