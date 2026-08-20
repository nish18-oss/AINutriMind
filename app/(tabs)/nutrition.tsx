import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppTheme } from "@/constants/theme";

import {
  IndianFood,
  calculateFoodNutrition,
  searchIndianFoods,
} from "@/lib/indian-foods";

import {
  addNutritionEntry,
  calculateNutritionTotals,
  deleteNutritionEntry,
  getEntriesByMealType,
  getMealTypeFromTime,
  getNutritionEntries,
  getTodayNutritionEntries,
  MealType,
  NutritionEntry,
} from "@/lib/nutrition-storage";

import {
  calculateNutritionTargets,
} from "@/lib/nutrition-targets";

import { useOnboarding } from "@/lib/onboarding-context";

const mealTypes: MealType[] = [
  "Breakfast",
  "Lunch",
  "Snack",
  "Dinner",
];

export default function NutritionScreen() {
  const { data } = useOnboarding();

  const [entries, setEntries] =
    useState<NutritionEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedFood, setSelectedFood] =
    useState<IndianFood | null>(null);

  const [quantity, setQuantity] =
    useState("");

  const [
    selectedPortionLabel,
    setSelectedPortionLabel,
  ] = useState("");

  const [
    useCustomGrams,
    setUseCustomGrams,
  ] = useState(false);

  const [mealType, setMealType] =
    useState<MealType>(
      getMealTypeFromTime()
    );

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

  const loadEntries = useCallback(
    async () => {
      setLoading(true);

      const saved =
        await getNutritionEntries();

      setEntries(saved);
      setLoading(false);
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const todayEntries = useMemo(
    () =>
      getTodayNutritionEntries(entries),
    [entries]
  );

  const totals = useMemo(
    () =>
      calculateNutritionTotals(
        todayEntries
      ),
    [todayEntries]
  );

  const searchResults = useMemo(
    () =>
      searchIndianFoods(search).slice(
        0,
        8
      ),
    [search]
  );

  const proteinRemaining = Math.max(
    targets.protein - totals.protein,
    0
  );

  const calorieRemaining = Math.max(
    targets.calories - totals.calories,
    0
  );

  const selectedNutrition =
    selectedFood && quantity
      ? calculateFoodNutrition(
          selectedFood,
          Number(quantity)
        )
      : null;

  function selectFood(food: IndianFood) {
    setSelectedFood(food);

    setSelectedPortionLabel(
      food.defaultPortion.label
    );

    setQuantity(
      food.defaultPortion.equivalentGrams.toString()
    );

    setUseCustomGrams(false);
  }

  function selectPortion(
    label: string,
    equivalentGrams: number
  ) {
    setSelectedPortionLabel(label);

    setQuantity(
      equivalentGrams.toString()
    );

    setUseCustomGrams(false);
  }

  function enableCustomGrams() {
    setSelectedPortionLabel("");
    setUseCustomGrams(true);
  }

  function clearComposer() {
    setSearch("");
    setSelectedFood(null);
    setQuantity("");
    setSelectedPortionLabel("");
    setUseCustomGrams(false);
    setMealType(
      getMealTypeFromTime()
    );
  }

  function closeComposer() {
    clearComposer();
    setShowAddForm(false);
  }

  async function handleAddFood() {
    if (!selectedFood) {
      return;
    }

    const quantityNumber =
      Number(quantity);

    if (
      !Number.isFinite(
        quantityNumber
      ) ||
      quantityNumber <= 0
    ) {
      Alert.alert(
        "Invalid quantity",
        "Enter a valid quantity."
      );

      return;
    }

    const nutrition =
      calculateFoodNutrition(
        selectedFood,
        quantityNumber
      );

    const entryName =
      selectedPortionLabel
        ? `${selectedFood.name} · ${selectedPortionLabel}`
        : selectedFood.name;

    const newEntry: NutritionEntry = {
      id: Date.now().toString(),

      name: entryName,

      calories:
        nutrition.calories,

      protein:
        nutrition.protein,

      createdAt:
        new Date().toISOString(),

      mealType,
    };

    const updated =
      await addNutritionEntry(
        newEntry
      );

    setEntries(updated);

    clearComposer();
    setShowAddForm(false);
  }

  function requestDelete(
    item: NutritionEntry
  ) {
    Alert.alert(
      "Remove food?",
      item.name,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Remove",
          style: "destructive",

          onPress: async () => {
            const updated =
              await deleteNutritionEntry(
                item.id
              );

            setEntries(updated);
          },
        },
      ]
    );
  }

  function formatEntryTime(
    createdAt: string
  ) {
    const date =
      new Date(createdAt);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function renderMealSection(
    type: MealType
  ) {
    const mealEntries =
      getEntriesByMealType(
        todayEntries,
        type
      );

    if (mealEntries.length === 0) {
      return null;
    }

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>
            {type}
          </Text>

          <Text style={styles.mealCount}>
            {mealEntries.length}
          </Text>
        </View>

        <View style={styles.list}>
          {mealEntries.map(
            (item) => (
              <View
                key={item.id}
                style={styles.foodCard}
              >
                <View style={styles.foodContent}>
                  <View style={styles.foodTitleRow}>
                    <Text style={styles.foodName}>
                      {item.name}
                    </Text>

                    <View style={styles.timeBadge}>
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={
                          AppTheme.colors
                            .textMuted
                        }
                      />

                      <Text style={styles.timeText}>
                        {formatEntryTime(
                          item.createdAt
                        )}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      {item.calories} kcal
                    </Text>

                    <Text style={styles.metaDot}>
                      •
                    </Text>

                    <Text style={styles.metaText}>
                      {item.protein}g protein
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() =>
                    requestDelete(item)
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={
                      AppTheme.colors
                        .textMuted
                    }
                  />
                </Pressable>
              </View>
            )
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            TODAY
          </Text>

          <Text style={styles.title}>
            Nutrition
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => {
            if (showAddForm) {
              closeComposer();
            } else {
              setMealType(
                getMealTypeFromTime()
              );

              setShowAddForm(true);
            }
          }}
        >
          <Ionicons
            name={
              showAddForm
                ? "close"
                : "add"
            }
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>
            Calories
          </Text>

          <Text style={styles.summaryValue}>
            {totals.calories}
          </Text>

          <Text style={styles.summarySubtext}>
            {calorieRemaining} remaining
          </Text>

          <Text style={styles.targetText}>
            Target {targets.calories} kcal
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>
            Protein
          </Text>

          <Text style={styles.summaryValue}>
            {totals.protein}g
          </Text>

          <Text style={styles.summarySubtext}>
            {proteinRemaining}g remaining
          </Text>

          <Text style={styles.targetText}>
            Target {targets.protein}g
          </Text>
        </View>
      </View>

      {showAddForm && (
        <View style={styles.formCard}>
          <Text style={styles.formEyebrow}>
            INDIA-FIRST FOOD SEARCH
          </Text>

          <Text style={styles.formTitle}>
            Add food
          </Text>

          <Text style={styles.formLabel}>
            Meal
          </Text>

          <View style={styles.mealTypeRow}>
            {mealTypes.map((type) => {
              const selected =
                mealType === type;

              return (
                <Pressable
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    selected &&
                      styles.mealTypeButtonSelected,
                  ]}
                  onPress={() =>
                    setMealType(type)
                  }
                >
                  <Text
                    style={[
                      styles.mealTypeText,
                      selected &&
                        styles.mealTypeTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.formLabel}>
            Food
          </Text>

          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={19}
              color={
                AppTheme.colors
                  .textMuted
              }
            />

            <TextInput
              value={search}
              onChangeText={(value) => {
                setSearch(value);
                setSelectedFood(null);
                setQuantity("");
                setSelectedPortionLabel("");
                setUseCustomGrams(false);
              }}
              placeholder="Search dal, paneer, poha..."
              placeholderTextColor={
                AppTheme.colors
                  .textMuted
              }
              style={styles.searchInput}
            />
          </View>

          {!selectedFood && (
            <View style={styles.results}>
              {searchResults.map(
                (food) => {
                  const preview =
                    calculateFoodNutrition(
                      food,
                      food.defaultPortion
                        .equivalentGrams
                    );

                  return (
                    <Pressable
                      key={food.id}
                      style={styles.foodOption}
                      onPress={() =>
                        selectFood(food)
                      }
                    >
                      <View
                        style={
                          styles.foodOptionContent
                        }
                      >
                        <Text
                          style={
                            styles.foodOptionName
                          }
                        >
                          {food.name}
                        </Text>

                        <Text
                          style={
                            styles.servingText
                          }
                        >
                          {
                            food
                              .defaultPortion
                              .label
                          }
                        </Text>
                      </View>

                      <View
                        style={
                          styles.foodOptionNumbers
                        }
                      >
                        <Text
                          style={
                            styles.foodOptionProtein
                          }
                        >
                          {
                            preview.protein
                          }
                          g protein
                        </Text>

                        <Text
                          style={
                            styles.foodOptionCalories
                          }
                        >
                          {
                            preview.calories
                          }{" "}
                          kcal
                        </Text>
                      </View>
                    </Pressable>
                  );
                }
              )}
            </View>
          )}

          {selectedFood && (
            <View style={styles.selectedCard}>
              <View style={styles.selectedHeader}>
                <View>
                  <Text style={styles.selectedFoodName}>
                    {selectedFood.name}
                  </Text>

                  <Text style={styles.selectedServing}>
                    Choose your portion
                  </Text>
                </View>

                <Pressable
                  style={styles.changeButton}
                  onPress={() => {
                    setSelectedFood(null);
                    setQuantity("");
                    setSelectedPortionLabel("");
                    setUseCustomGrams(false);
                  }}
                >
                  <Text style={styles.changeText}>
                    Change
                  </Text>
                </Pressable>
              </View>

              <View style={styles.portionWrap}>
                {selectedFood.portions.map(
                  (portion) => {
                    const selected =
                      selectedPortionLabel ===
                        portion.label &&
                      !useCustomGrams;

                    return (
                      <Pressable
                        key={portion.label}
                        style={[
                          styles.portionButton,
                          selected &&
                            styles.portionButtonSelected,
                        ]}
                        onPress={() =>
                          selectPortion(
                            portion.label,
                            portion.equivalentGrams
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.portionText,
                            selected &&
                              styles.portionTextSelected,
                          ]}
                        >
                          {portion.label}
                        </Text>
                      </Pressable>
                    );
                  }
                )}

                <Pressable
                  style={[
                    styles.portionButton,
                    useCustomGrams &&
                      styles.portionButtonSelected,
                  ]}
                  onPress={enableCustomGrams}
                >
                  <Text
                    style={[
                      styles.portionText,
                      useCustomGrams &&
                        styles.portionTextSelected,
                    ]}
                  >
                    Custom grams
                  </Text>
                </Pressable>
              </View>

              {useCustomGrams && (
                <>
                  <Text style={styles.formLabel}>
                    Custom quantity
                  </Text>

                  <View style={styles.quantityBox}>
                    <TextInput
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="decimal-pad"
                      placeholder="Enter grams"
                      placeholderTextColor={
                        AppTheme.colors.textMuted
                      }
                      style={styles.quantityInput}
                    />

                    <Text style={styles.quantityUnit}>
                      grams
                    </Text>
                  </View>
                </>
              )}

              {selectedNutrition && (
                <View style={styles.previewCard}>
                  <View>
                    <Text style={styles.previewLabel}>
                      CALORIES
                    </Text>

                    <Text style={styles.previewValue}>
                      {selectedNutrition.calories}
                    </Text>
                  </View>

                  <View style={styles.previewDivider} />

                  <View>
                    <Text style={styles.previewLabel}>
                      PROTEIN
                    </Text>

                    <Text style={styles.previewValue}>
                      {selectedNutrition.protein}g
                    </Text>
                  </View>
                </View>
              )}

              <Pressable
                style={styles.saveButton}
                onPress={handleAddFood}
              >
                <Text style={styles.saveButtonText}>
                  Add to {mealType.toLowerCase()}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          )}
        </View>
      )}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>
            LOGGED TODAY
          </Text>

          <Text style={styles.sectionTitle}>
            Meals & food
          </Text>
        </View>

        <Text style={styles.count}>
          {todayEntries.length}
        </Text>
      </View>

      {loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Loading nutrition...
          </Text>
        </View>
      ) : todayEntries.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="restaurant-outline"
              size={24}
              color={
                AppTheme.colors
                  .accentDark
              }
            />
          </View>

          <Text style={styles.emptyTitle}>
            No food logged yet
          </Text>

          <Text style={styles.emptyText}>
            Add your first meal to start tracking today&apos;s
            calories and protein.
          </Text>
        </View>
      ) : (
        <>
          {renderMealSection(
            "Breakfast"
          )}

          {renderMealSection(
            "Lunch"
          )}

          {renderMealSection(
            "Snack"
          )}

          {renderMealSection(
            "Dinner"
          )}
        </>
      )}
    </ScrollView>
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
    alignItems: "center",
    justifyContent:
      "space-between",
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
    fontSize: 32,
    fontWeight: "800",
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor:
      AppTheme.colors.ink,
    justifyContent: "center",
    alignItems: "center",
  },

  summaryCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 22,
    backgroundColor:
      AppTheme.colors.darkSurface,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryColumn: {
    flex: 1,
  },

  summaryLabel: {
    color: "#98A2B3",
    fontSize: 11,
    fontWeight: "700",
  },

  summaryValue: {
    marginTop: 5,
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },

  summarySubtext: {
    marginTop: 4,
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "700",
  },

  targetText: {
    marginTop: 3,
    color: "#667085",
    fontSize: 10,
    fontWeight: "600",
  },

  divider: {
    width: 1,
    height: 58,
    marginHorizontal: 18,
    backgroundColor:
      AppTheme.colors.darkBorder,
  },

  formCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
  },

  formEyebrow: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  formTitle: {
    marginTop: 4,
    marginBottom: 18,
    color: AppTheme.colors.ink,
    fontSize: 21,
    fontWeight: "800",
  },

  formLabel: {
    marginBottom: 8,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },

  mealTypeRow: {
    marginBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  mealTypeButton: {
    minHeight: 40,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  mealTypeButtonSelected: {
    borderColor:
      AppTheme.colors.accent,
    backgroundColor:
      AppTheme.colors.accentSoft,
  },

  mealTypeText: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  mealTypeTextSelected: {
    color:
      AppTheme.colors.accentDark,
  },

  searchBox: {
    minHeight: 54,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.background,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: AppTheme.colors.ink,
    fontSize: 14,
    fontWeight: "600",
  },

  results: {
    marginTop: 12,
    gap: 8,
  },

  foodOption: {
    minHeight: 64,
    padding: 13,
    borderRadius: 16,
    backgroundColor:
      AppTheme.colors.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  foodOptionContent: {
    flex: 1,
    paddingRight: 12,
  },

  foodOptionName: {
    color: AppTheme.colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },

  servingText: {
    marginTop: 3,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 11,
  },

  foodOptionNumbers: {
    alignItems: "flex-end",
  },

  foodOptionProtein: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 11,
    fontWeight: "800",
  },

  foodOptionCalories: {
    marginTop: 3,
    color:
      AppTheme.colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },

  selectedCard: {
    marginTop: 14,
  },

  selectedHeader: {
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  selectedFoodName: {
    color: AppTheme.colors.ink,
    fontSize: 19,
    fontWeight: "800",
  },

  selectedServing: {
    marginTop: 4,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 11,
  },

  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor:
      AppTheme.colors.accentSoft,
  },

  changeText: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 11,
    fontWeight: "800",
  },

  portionWrap: {
    marginBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  portionButton: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  portionButtonSelected: {
    borderColor:
      AppTheme.colors.accent,
    backgroundColor:
      AppTheme.colors.accentSoft,
  },

  portionText: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  portionTextSelected: {
    color:
      AppTheme.colors.accentDark,
  },

  quantityBox: {
    minHeight: 54,
    marginBottom: 14,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.background,
    flexDirection: "row",
    alignItems: "center",
  },

  quantityInput: {
    flex: 1,
    color: AppTheme.colors.ink,
    fontSize: 16,
    fontWeight: "800",
  },

  quantityUnit: {
    color:
      AppTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  previewCard: {
    marginTop: 4,
    padding: 15,
    borderRadius: 17,
    backgroundColor:
      AppTheme.colors.darkSurface,
    flexDirection: "row",
    alignItems: "center",
  },

  previewLabel: {
    color: "#98A2B3",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  previewValue: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  previewDivider: {
    width: 1,
    height: 32,
    marginHorizontal: 28,
    backgroundColor:
      AppTheme.colors.darkBorder,
  },

  saveButton: {
    minHeight: 54,
    marginTop: 15,
    paddingHorizontal: 18,
    borderRadius: 17,
    backgroundColor:
      AppTheme.colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent:
      "space-between",
  },

  sectionEyebrow: {
    color:
      AppTheme.colors.accentDark,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  sectionTitle: {
    marginTop: 4,
    color: AppTheme.colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },

  count: {
    color:
      AppTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },

  mealSection: {
    marginBottom: 24,
  },

  mealHeader: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  mealTitle: {
    color: AppTheme.colors.ink,
    fontSize: 16,
    fontWeight: "800",
  },

  mealCount: {
    minWidth: 28,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor:
      AppTheme.colors.surfaceSoft,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyCard: {
    padding: 28,
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
    maxWidth: 280,
    color:
      AppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  list: {
    gap: 10,
  },

  foodCard: {
    minHeight: 76,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      AppTheme.colors.border,
    backgroundColor:
      AppTheme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },

  foodContent: {
    flex: 1,
  },

  foodTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: 10,
  },

  foodName: {
    flex: 1,
    color: AppTheme.colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },

  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor:
      AppTheme.colors.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  timeText: {
    color:
      AppTheme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },

  metaRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    color:
      AppTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  metaDot: {
    marginHorizontal: 7,
    color:
      AppTheme.colors.textMuted,
  },

  deleteButton: {
    width: 36,
    height: 36,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});