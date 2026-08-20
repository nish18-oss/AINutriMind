export type FoodUnit =
  | "g"
  | "ml"
  | "piece"
  | "bowl"
  | "glass";

export type FoodPortion = {
  label: string;

  quantity: number;

  unit: FoodUnit;

  equivalentGrams: number;
};

export type IndianFood = {
  id: string;
  name: string;

  category:
    | "Staple"
    | "Protein"
    | "Breakfast"
    | "Dairy"
    | "Pulse"
    | "Other";

  caloriesPer100g: number;
  proteinPer100g: number;

  defaultPortion: FoodPortion;

  portions: FoodPortion[];
};

export const indianFoods: IndianFood[] = [
  {
    id: "roti",
    name: "Roti",
    category: "Staple",

    caloriesPer100g: 297,
    proteinPer100g: 9.7,

    defaultPortion: {
      label: "1 roti / ~40 g",
      quantity: 1,
      unit: "piece",
      equivalentGrams: 40,
    },

    portions: [
      {
        label: "1 roti / ~40 g",
        quantity: 1,
        unit: "piece",
        equivalentGrams: 40,
      },
      {
        label: "2 rotis / ~80 g",
        quantity: 2,
        unit: "piece",
        equivalentGrams: 80,
      },
      {
        label: "3 rotis / ~120 g",
        quantity: 3,
        unit: "piece",
        equivalentGrams: 120,
      },
    ],
  },

  {
    id: "cooked-rice",
    name: "Cooked Rice",
    category: "Staple",

    caloriesPer100g: 130,
    proteinPer100g: 2.7,

    defaultPortion: {
      label: "1 bowl / ~150 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 150,
    },

    portions: [
      {
        label: "½ bowl / ~75 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 75,
      },
      {
        label: "1 bowl / ~150 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 150,
      },
      {
        label: "1½ bowls / ~225 g",
        quantity: 1.5,
        unit: "bowl",
        equivalentGrams: 225,
      },
      {
        label: "2 bowls / ~300 g",
        quantity: 2,
        unit: "bowl",
        equivalentGrams: 300,
      },
    ],
  },

  {
    id: "dal",
    name: "Cooked Dal",
    category: "Pulse",

    caloriesPer100g: 116,
    proteinPer100g: 7,

    defaultPortion: {
      label: "1 bowl / ~150 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 150,
    },

    portions: [
      {
        label: "½ bowl / ~75 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 75,
      },
      {
        label: "1 bowl / ~150 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 150,
      },
      {
        label: "1½ bowls / ~225 g",
        quantity: 1.5,
        unit: "bowl",
        equivalentGrams: 225,
      },
      {
        label: "2 bowls / ~300 g",
        quantity: 2,
        unit: "bowl",
        equivalentGrams: 300,
      },
    ],
  },

  {
    id: "rajma",
    name: "Rajma",
    category: "Pulse",

    caloriesPer100g: 127,
    proteinPer100g: 8.7,

    defaultPortion: {
      label: "1 bowl / ~150 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 150,
    },

    portions: [
      {
        label: "½ bowl / ~75 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 75,
      },
      {
        label: "1 bowl / ~150 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 150,
      },
      {
        label: "2 bowls / ~300 g",
        quantity: 2,
        unit: "bowl",
        equivalentGrams: 300,
      },
    ],
  },

  {
    id: "chole",
    name: "Chole",
    category: "Pulse",

    caloriesPer100g: 164,
    proteinPer100g: 8.9,

    defaultPortion: {
      label: "1 bowl / ~150 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 150,
    },

    portions: [
      {
        label: "½ bowl / ~75 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 75,
      },
      {
        label: "1 bowl / ~150 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 150,
      },
      {
        label: "2 bowls / ~300 g",
        quantity: 2,
        unit: "bowl",
        equivalentGrams: 300,
      },
    ],
  },

  {
    id: "paneer",
    name: "Paneer",
    category: "Protein",

    caloriesPer100g: 265,
    proteinPer100g: 18.3,

    defaultPortion: {
      label: "100 g",
      quantity: 100,
      unit: "g",
      equivalentGrams: 100,
    },

    portions: [
      {
        label: "50 g",
        quantity: 50,
        unit: "g",
        equivalentGrams: 50,
      },
      {
        label: "100 g",
        quantity: 100,
        unit: "g",
        equivalentGrams: 100,
      },
      {
        label: "150 g",
        quantity: 150,
        unit: "g",
        equivalentGrams: 150,
      },
      {
        label: "200 g",
        quantity: 200,
        unit: "g",
        equivalentGrams: 200,
      },
    ],
  },

  {
    id: "egg",
    name: "Boiled Egg",
    category: "Protein",

    caloriesPer100g: 155,
    proteinPer100g: 13,

    defaultPortion: {
      label: "2 eggs / ~100 g",
      quantity: 2,
      unit: "piece",
      equivalentGrams: 100,
    },

    portions: [
      {
        label: "1 egg / ~50 g",
        quantity: 1,
        unit: "piece",
        equivalentGrams: 50,
      },
      {
        label: "2 eggs / ~100 g",
        quantity: 2,
        unit: "piece",
        equivalentGrams: 100,
      },
      {
        label: "3 eggs / ~150 g",
        quantity: 3,
        unit: "piece",
        equivalentGrams: 150,
      },
      {
        label: "4 eggs / ~200 g",
        quantity: 4,
        unit: "piece",
        equivalentGrams: 200,
      },
    ],
  },

  {
    id: "soy-chunks",
    name: "Soy Chunks",
    category: "Protein",

    caloriesPer100g: 345,
    proteinPer100g: 52,

    defaultPortion: {
      label: "50 g dry",
      quantity: 50,
      unit: "g",
      equivalentGrams: 50,
    },

    portions: [
      {
        label: "25 g dry",
        quantity: 25,
        unit: "g",
        equivalentGrams: 25,
      },
      {
        label: "50 g dry",
        quantity: 50,
        unit: "g",
        equivalentGrams: 50,
      },
      {
        label: "75 g dry",
        quantity: 75,
        unit: "g",
        equivalentGrams: 75,
      },
      {
        label: "100 g dry",
        quantity: 100,
        unit: "g",
        equivalentGrams: 100,
      },
    ],
  },

  {
    id: "curd",
    name: "Curd",
    category: "Dairy",

    caloriesPer100g: 61,
    proteinPer100g: 3.5,

    defaultPortion: {
      label: "1 bowl / ~150 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 150,
    },

    portions: [
      {
        label: "½ bowl / ~75 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 75,
      },
      {
        label: "1 bowl / ~150 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 150,
      },
      {
        label: "2 bowls / ~300 g",
        quantity: 2,
        unit: "bowl",
        equivalentGrams: 300,
      },
    ],
  },

  {
    id: "milk",
    name: "Milk",
    category: "Dairy",

    caloriesPer100g: 61,
    proteinPer100g: 3.2,

    defaultPortion: {
      label: "1 glass / ~250 ml",
      quantity: 250,
      unit: "ml",
      equivalentGrams: 250,
    },

    portions: [
      {
        label: "½ glass / ~125 ml",
        quantity: 125,
        unit: "ml",
        equivalentGrams: 125,
      },
      {
        label: "1 glass / ~250 ml",
        quantity: 250,
        unit: "ml",
        equivalentGrams: 250,
      },
      {
        label: "2 glasses / ~500 ml",
        quantity: 500,
        unit: "ml",
        equivalentGrams: 500,
      },
    ],
  },

  {
    id: "poha",
    name: "Poha",
    category: "Breakfast",

    caloriesPer100g: 130,
    proteinPer100g: 3.5,

    defaultPortion: {
      label: "1 bowl / ~180 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 180,
    },

    portions: [
      {
        label: "½ bowl / ~90 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 90,
      },
      {
        label: "1 bowl / ~180 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 180,
      },
      {
        label: "1½ bowls / ~270 g",
        quantity: 1.5,
        unit: "bowl",
        equivalentGrams: 270,
      },
      {
        label: "2 bowls / ~360 g",
        quantity: 2,
        unit: "bowl",
        equivalentGrams: 360,
      },
    ],
  },

  {
    id: "upma",
    name: "Upma",
    category: "Breakfast",

    caloriesPer100g: 150,
    proteinPer100g: 4,

    defaultPortion: {
      label: "1 bowl / ~180 g",
      quantity: 1,
      unit: "bowl",
      equivalentGrams: 180,
    },

    portions: [
      {
        label: "½ bowl / ~90 g",
        quantity: 0.5,
        unit: "bowl",
        equivalentGrams: 90,
      },
      {
        label: "1 bowl / ~180 g",
        quantity: 1,
        unit: "bowl",
        equivalentGrams: 180,
      },
      {
        label: "1½ bowls / ~270 g",
        quantity: 1.5,
        unit: "bowl",
        equivalentGrams: 270,
      },
    ],
  },

  {
    id: "idli",
    name: "Idli",
    category: "Breakfast",

    caloriesPer100g: 146,
    proteinPer100g: 4.5,

    defaultPortion: {
      label: "2 idlis / ~100 g",
      quantity: 2,
      unit: "piece",
      equivalentGrams: 100,
    },

    portions: [
      {
        label: "1 idli / ~50 g",
        quantity: 1,
        unit: "piece",
        equivalentGrams: 50,
      },
      {
        label: "2 idlis / ~100 g",
        quantity: 2,
        unit: "piece",
        equivalentGrams: 100,
      },
      {
        label: "3 idlis / ~150 g",
        quantity: 3,
        unit: "piece",
        equivalentGrams: 150,
      },
      {
        label: "4 idlis / ~200 g",
        quantity: 4,
        unit: "piece",
        equivalentGrams: 200,
      },
    ],
  },

  {
    id: "besan-chilla",
    name: "Besan Chilla",
    category: "Breakfast",

    caloriesPer100g: 190,
    proteinPer100g: 8,

    defaultPortion: {
      label: "2 chillas / ~150 g",
      quantity: 2,
      unit: "piece",
      equivalentGrams: 150,
    },

    portions: [
      {
        label: "1 chilla / ~75 g",
        quantity: 1,
        unit: "piece",
        equivalentGrams: 75,
      },
      {
        label: "2 chillas / ~150 g",
        quantity: 2,
        unit: "piece",
        equivalentGrams: 150,
      },
      {
        label: "3 chillas / ~225 g",
        quantity: 3,
        unit: "piece",
        equivalentGrams: 225,
      },
    ],
  },
];

export function calculateFoodNutrition(
  food: IndianFood,
  equivalentGrams: number
) {
  const multiplier =
    equivalentGrams / 100;

  return {
    calories: Math.round(
      food.caloriesPer100g * multiplier
    ),

    protein: Number(
      (
        food.proteinPer100g * multiplier
      ).toFixed(1)
    ),
  };
}

export function searchIndianFoods(
  query: string
) {
  const cleaned =
    query.trim().toLowerCase();

  if (!cleaned) {
    return indianFoods;
  }

  return indianFoods.filter(
    (food) =>
      food.name
        .toLowerCase()
        .includes(cleaned) ||
      food.category
        .toLowerCase()
        .includes(cleaned)
  );
}