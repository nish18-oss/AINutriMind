export type NutritionTargets = {
  calories: number;
  protein: number;

  weightKg: number | null;

  calorieMethod: string;
  proteinMethod: string;
};

type TargetInput = {
  goal: string | null;
  weight: string;
  activityLevel: string | null;
};

function parsePositiveNumber(
  value: string
): number | null {
  const parsed = Number(
    value.trim()
  );

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

function normalize(
  value: string | null
): string {
  return (
    value
      ?.trim()
      .toLowerCase() ?? ""
  );
}

function getActivityMultiplier(
  activityLevel: string | null
): number {
  const activity =
    normalize(activityLevel);

  if (
    activity.includes("very active") ||
    activity.includes("high")
  ) {
    return 36;
  }

  if (
    activity.includes("active") ||
    activity.includes("moderate")
  ) {
    return 33;
  }

  if (
    activity.includes("light") ||
    activity.includes("somewhat")
  ) {
    return 30;
  }

  if (
    activity.includes("sedentary") ||
    activity.includes("low")
  ) {
    return 27;
  }

  return 30;
}

function getGoalCalorieAdjustment(
  goal: string | null
): number {
  const normalizedGoal =
    normalize(goal);

  if (
    normalizedGoal.includes("muscle") ||
    normalizedGoal.includes("gain")
  ) {
    return 250;
  }

  if (
    normalizedGoal.includes("lose") ||
    normalizedGoal.includes("weight loss") ||
    normalizedGoal.includes("fat loss")
  ) {
    return -300;
  }

  return 0;
}

function getProteinPerKg(
  goal: string | null
): number {
  const normalizedGoal =
    normalize(goal);

  if (
    normalizedGoal.includes("muscle") ||
    normalizedGoal.includes("gain")
  ) {
    return 1.8;
  }

  if (
    normalizedGoal.includes("lose") ||
    normalizedGoal.includes("weight loss") ||
    normalizedGoal.includes("fat loss")
  ) {
    return 1.6;
  }

  if (
    normalizedGoal.includes("maintain") ||
    normalizedGoal.includes("healthy") ||
    normalizedGoal.includes("fitness")
  ) {
    return 1.4;
  }

  return 1.4;
}

export function calculateNutritionTargets(
  input: TargetInput
): NutritionTargets {
  const weightKg =
    parsePositiveNumber(
      input.weight
    );

  /*
   * If profile data is incomplete,
   * use temporary safe development
   * defaults instead of breaking
   * the Nutrition screen.
   */
  if (!weightKg) {
    return {
      calories: 2000,
      protein: 100,

      weightKg: null,

      calorieMethod:
        "Temporary default",

      proteinMethod:
        "Temporary default",
    };
  }

  const activityMultiplier =
    getActivityMultiplier(
      input.activityLevel
    );

  const goalAdjustment =
    getGoalCalorieAdjustment(
      input.goal
    );

  const estimatedCalories =
    weightKg *
      activityMultiplier +
    goalAdjustment;

  /*
   * Keep Phase 1 estimates within
   * sensible app-development bounds.
   *
   * These are not clinical limits.
   */
  const calorieTarget =
    Math.round(
      Math.min(
        Math.max(
          estimatedCalories,
          1400
        ),
        4500
      ) / 50
    ) * 50;

  const proteinPerKg =
    getProteinPerKg(
      input.goal
    );

  const proteinTarget =
    Math.round(
      weightKg * proteinPerKg
    );

  return {
    calories: calorieTarget,

    protein:
      Math.max(
        proteinTarget,
        50
      ),

    weightKg,

    calorieMethod:
      `${activityMultiplier} kcal/kg + goal adjustment`,

    proteinMethod:
      `${proteinPerKg} g/kg`,
  };
}