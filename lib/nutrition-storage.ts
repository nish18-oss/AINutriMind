import AsyncStorage from "@react-native-async-storage/async-storage";

export type MealType =
  | "Breakfast"
  | "Lunch"
  | "Snack"
  | "Dinner";

export type NutritionEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: string;

  mealType: MealType;
};

const STORAGE_KEY =
  "@ainutrimind_nutrition_entries";

export async function getNutritionEntries(): Promise<
  NutritionEntry[]
> {
  try {
    const saved =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    /*
     * Normalize older saved entries.
     *
     * Older foods did not contain mealType,
     * so we assign one automatically from
     * the time they were logged.
     */
    const normalized: NutritionEntry[] =
      parsed.map((item) => {
        const createdAt =
          typeof item.createdAt === "string"
            ? item.createdAt
            : new Date().toISOString();

        return {
          id:
            typeof item.id === "string"
              ? item.id
              : Date.now().toString(),

          name:
            typeof item.name === "string"
              ? item.name
              : "Food",

          calories:
            typeof item.calories === "number"
              ? item.calories
              : 0,

          protein:
            typeof item.protein === "number"
              ? item.protein
              : 0,

          createdAt,

          mealType:
            isMealType(item.mealType)
              ? item.mealType
              : getMealTypeFromTime(
                  createdAt
                ),
        };
      });

    return normalized;
  } catch (error) {
    console.log(
      "Could not load nutrition entries:",
      error
    );

    return [];
  }
}

export async function saveNutritionEntries(
  entries: NutritionEntry[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries)
    );
  } catch (error) {
    console.log(
      "Could not save nutrition entries:",
      error
    );
  }
}

export async function addNutritionEntry(
  entry: NutritionEntry
): Promise<NutritionEntry[]> {
  const current =
    await getNutritionEntries();

  /*
   * Newest entry always comes first.
   */
  const updated = [
    entry,
    ...current,
  ];

  await saveNutritionEntries(
    updated
  );

  return updated;
}

export async function deleteNutritionEntry(
  id: string
): Promise<NutritionEntry[]> {
  const current =
    await getNutritionEntries();

  const updated =
    current.filter(
      (item) =>
        item.id !== id
    );

  await saveNutritionEntries(
    updated
  );

  return updated;
}

export function getTodayNutritionEntries(
  entries: NutritionEntry[]
): NutritionEntry[] {
  const today =
    new Date();

  const todayEntries =
    entries.filter(
      (item) => {
        const date =
          new Date(
            item.createdAt
          );

        return (
          date.getFullYear() ===
            today.getFullYear() &&
          date.getMonth() ===
            today.getMonth() &&
          date.getDate() ===
            today.getDate()
        );
      }
    );

  /*
   * Newest → oldest.
   */
  return todayEntries.sort(
    (a, b) => {
      const timeA =
        new Date(
          a.createdAt
        ).getTime();

      const timeB =
        new Date(
          b.createdAt
        ).getTime();

      return timeB - timeA;
    }
  );
}

export function getEntriesByMealType(
  entries: NutritionEntry[],
  mealType: MealType
): NutritionEntry[] {
  return entries.filter(
    (item) =>
      item.mealType === mealType
  );
}

export function calculateNutritionTotals(
  entries: NutritionEntry[]
) {
  const totals =
    entries.reduce(
      (result, item) => {
        return {
          calories:
            result.calories +
            item.calories,

          protein:
            result.protein +
            item.protein,
        };
      },
      {
        calories: 0,
        protein: 0,
      }
    );

  return {
    calories:
      Math.round(
        totals.calories
      ),

    protein:
      Number(
        totals.protein.toFixed(
          1
        )
      ),
  };
}

export function getMealTypeFromTime(
  createdAt:
    | string
    | Date = new Date()
): MealType {
  const date =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  const hour =
    date.getHours();

  if (hour >= 5 && hour < 11) {
    return "Breakfast";
  }

  if (hour >= 11 && hour < 16) {
    return "Lunch";
  }

  if (hour >= 16 && hour < 19) {
    return "Snack";
  }

  return "Dinner";
}

function isMealType(
  value: unknown
): value is MealType {
  return (
    value === "Breakfast" ||
    value === "Lunch" ||
    value === "Snack" ||
    value === "Dinner"
  );
}