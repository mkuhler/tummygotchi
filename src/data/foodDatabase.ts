export type FoodTag =
  | "high-fiber"
  | "moderate-fiber"
  | "low-fiber"
  | "hydrating"
  | "gentle"
  | "bloat-risk"
  | "trigger-spicy"
  | "trigger-dairy"
  | "trigger-fried"
  | "trigger-alcohol"
  | "trigger-caffeine"
  | "processed"
  | "probiotic"
  | "lean-protein"
  | "heavy";

export type FoodDbEntry = {
  id: string;
  name: string;
  emoji: string;
  serving: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: FoodTag[];
};

export const FOOD_DATABASE: FoodDbEntry[] = [
  {
    id: "oatmeal",
    name: "Oatmeal",
    emoji: "🥣",
    serving: "1 cup cooked",
    macros: { calories: 158, protein: 6, carbs: 27, fat: 3, fiber: 4 },
    tags: ["moderate-fiber", "gentle"],
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    serving: "1 medium",
    macros: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3 },
    tags: ["gentle", "moderate-fiber"],
  },
  {
    id: "salad",
    name: "Mixed green salad",
    emoji: "🥗",
    serving: "2 cups",
    macros: { calories: 50, protein: 3, carbs: 8, fat: 1, fiber: 4 },
    tags: ["high-fiber", "hydrating", "gentle"],
  },
  {
    id: "chicken-rice",
    name: "Grilled chicken & rice",
    emoji: "🍗",
    serving: "1 plate",
    macros: { calories: 420, protein: 35, carbs: 45, fat: 8, fiber: 2 },
    tags: ["lean-protein", "gentle"],
  },
  {
    id: "yogurt",
    name: "Greek yogurt",
    emoji: "🥛",
    serving: "1 cup",
    macros: { calories: 130, protein: 17, carbs: 9, fat: 4, fiber: 0 },
    tags: ["probiotic", "trigger-dairy", "low-fiber"],
  },
  {
    id: "coffee",
    name: "Coffee",
    emoji: "☕",
    serving: "12 oz",
    macros: { calories: 5, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    tags: ["trigger-caffeine", "hydrating"],
  },
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    serving: "16 oz",
    macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    tags: ["hydrating", "gentle"],
  },
  {
    id: "broccoli",
    name: "Steamed broccoli",
    emoji: "🥦",
    serving: "1 cup",
    macros: { calories: 55, protein: 4, carbs: 11, fat: 1, fiber: 5 },
    tags: ["high-fiber", "gentle"],
  },
  {
    id: "beans",
    name: "Black beans",
    emoji: "🫘",
    serving: "1 cup",
    macros: { calories: 227, protein: 15, carbs: 41, fat: 1, fiber: 15 },
    tags: ["high-fiber", "bloat-risk"],
  },
  {
    id: "pizza",
    name: "Pizza slice",
    emoji: "🍕",
    serving: "1 slice",
    macros: { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2 },
    tags: ["processed", "trigger-fried", "low-fiber"],
  },
  {
    id: "burger",
    name: "Cheeseburger",
    emoji: "🍔",
    serving: "1 burger",
    macros: { calories: 540, protein: 25, carbs: 40, fat: 29, fiber: 2 },
    tags: ["heavy", "processed", "trigger-fried", "trigger-dairy"],
  },
  {
    id: "sushi",
    name: "Salmon sushi roll",
    emoji: "🍣",
    serving: "8 pieces",
    macros: { calories: 300, protein: 14, carbs: 42, fat: 8, fiber: 2 },
    tags: ["lean-protein", "gentle"],
  },
  {
    id: "smoothie",
    name: "Berry smoothie",
    emoji: "🫐",
    serving: "16 oz",
    macros: { calories: 220, protein: 4, carbs: 48, fat: 2, fiber: 6 },
    tags: ["high-fiber", "hydrating"],
  },
  {
    id: "eggs",
    name: "Scrambled eggs",
    emoji: "🍳",
    serving: "2 eggs",
    macros: { calories: 182, protein: 12, carbs: 2, fat: 14, fiber: 0 },
    tags: ["lean-protein", "gentle"],
  },
  {
    id: "toast",
    name: "Whole wheat toast",
    emoji: "🍞",
    serving: "2 slices",
    macros: { calories: 160, protein: 8, carbs: 28, fat: 2, fiber: 4 },
    tags: ["moderate-fiber"],
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    serving: "1 medium",
    macros: { calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4 },
    tags: ["moderate-fiber", "hydrating", "gentle"],
  },
  {
    id: "kimchi",
    name: "Kimchi",
    emoji: "🥬",
    serving: "1/2 cup",
    macros: { calories: 23, protein: 2, carbs: 4, fat: 0, fiber: 2 },
    tags: ["probiotic", "trigger-spicy", "moderate-fiber"],
  },
  {
    id: "soda",
    name: "Soda",
    emoji: "🥤",
    serving: "12 oz",
    macros: { calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0 },
    tags: ["bloat-risk", "processed", "low-fiber"],
  },
  {
    id: "beer",
    name: "Beer",
    emoji: "🍺",
    serving: "12 oz",
    macros: { calories: 153, protein: 1, carbs: 13, fat: 0, fiber: 0 },
    tags: ["trigger-alcohol", "bloat-risk"],
  },
  {
    id: "ice-cream",
    name: "Ice cream",
    emoji: "🍨",
    serving: "1 cup",
    macros: { calories: 273, protein: 5, carbs: 31, fat: 15, fiber: 1 },
    tags: ["trigger-dairy", "heavy", "low-fiber"],
  },
  {
    id: "tacos",
    name: "Spicy tacos",
    emoji: "🌮",
    serving: "2 tacos",
    macros: { calories: 380, protein: 18, carbs: 32, fat: 20, fiber: 5 },
    tags: ["trigger-spicy", "moderate-fiber"],
  },
  {
    id: "soup",
    name: "Vegetable soup",
    emoji: "🍲",
    serving: "1 bowl",
    macros: { calories: 120, protein: 4, carbs: 18, fat: 3, fiber: 4 },
    tags: ["hydrating", "gentle", "moderate-fiber"],
  },
  {
    id: "avocado-toast",
    name: "Avocado toast",
    emoji: "🥑",
    serving: "1 slice",
    macros: { calories: 250, protein: 6, carbs: 24, fat: 15, fiber: 7 },
    tags: ["high-fiber", "gentle"],
  },
  {
    id: "chips",
    name: "Potato chips",
    emoji: "🥔",
    serving: "1 oz",
    macros: { calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1 },
    tags: ["processed", "trigger-fried", "bloat-risk"],
  },
  {
    id: "kefir",
    name: "Kefir",
    emoji: "🥛",
    serving: "1 cup",
    macros: { calories: 110, protein: 9, carbs: 12, fat: 2, fiber: 0 },
    tags: ["probiotic", "trigger-dairy", "gentle"],
  },
];
