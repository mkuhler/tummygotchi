import { getFoodById, inferFoodDbEntry } from "./foodLookup";
import type { FoodDbEntry, FoodTag } from "../data/foodDatabase";
import type {
  FoodEntry,
  Goal,
  MealXpReason,
  MealXpResult,
} from "../types";

const BASE_LOG_XP = 4;

function hasTag(food: FoodDbEntry | undefined, tag: FoodTag): boolean {
  return food?.tags.includes(tag) ?? false;
}

function fiberGrams(entry: FoodEntry): number {
  return entry.macros.fiber ?? 0;
}

function scoreForGoal(
  entry: FoodEntry,
  goal: Goal,
  dbEntry: FoodDbEntry | undefined
): MealXpReason[] {
  const reasons: MealXpReason[] = [];
  const name = entry.name;
  const id = entry.id;

  const add = (xp: number, reason: string) => {
    reasons.push({ entryId: id, entryName: name, xp, reason, goalId: goal.id });
  };

  switch (goal.id) {
    case "fiber":
      if (fiberGrams(entry) >= 5 || hasTag(dbEntry, "high-fiber")) {
        add(12, "High fiber — great for your gut microbes 🥬");
      } else if (fiberGrams(entry) >= 3 || hasTag(dbEntry, "moderate-fiber")) {
        add(7, "Decent fiber to feed your tummy friends");
      } else if (hasTag(dbEntry, "low-fiber") || hasTag(dbEntry, "processed")) {
        add(-4, "Low fiber — try adding plants next time");
      }
      break;

    case "hydration":
      if (hasTag(dbEntry, "hydrating") || name.toLowerCase().includes("water")) {
        add(10, "Hydrating choice — your gut loves fluids 💧");
      } else if (hasTag(dbEntry, "trigger-caffeine") || hasTag(dbEntry, "trigger-alcohol")) {
        add(-5, "Can be dehydrating — pair with extra water");
      }
      break;

    case "bloating":
      if (hasTag(dbEntry, "gentle")) {
        add(9, "Gentle on the tummy — low bloat risk ☁️");
      }
      if (hasTag(dbEntry, "bloat-risk") || hasTag(dbEntry, "trigger-fried")) {
        add(-8, "May cause bloating for sensitive tummies");
      }
      if (hasTag(dbEntry, "probiotic")) {
        add(6, "Probiotic foods can ease bloating over time");
      }
      break;

    case "triggers":
      if (hasTag(dbEntry, "trigger-spicy")) {
        add(-10, "Spicy — watch for trigger patterns 🌶️");
      }
      if (hasTag(dbEntry, "trigger-dairy")) {
        add(-6, "Dairy — log symptoms if this is a trigger");
      }
      if (hasTag(dbEntry, "trigger-fried")) {
        add(-8, "Fried food — common GI trigger");
      }
      if (hasTag(dbEntry, "trigger-alcohol")) {
        add(-10, "Alcohol often irritates the gut lining");
      }
      if (hasTag(dbEntry, "gentle") && !hasTag(dbEntry, "trigger-spicy")) {
        add(5, "Unlikely trigger — easy to digest");
      }
      break;

    case "regularity":
      if (fiberGrams(entry) >= 4) {
        add(8, "Fiber helps keep bathroom trips predictable");
      }
      if (hasTag(dbEntry, "probiotic")) {
        add(6, "Probiotics support regular rhythm");
      }
      if (hasTag(dbEntry, "heavy")) {
        add(-4, "Heavy meal — may slow things down");
      }
      break;

    case "mindful-eating":
      if (
        entry.macros.calories !== undefined &&
        entry.macros.protein !== undefined
      ) {
        add(8, "Detailed logging = mindful eating win 🍽️");
      } else if (entry.name.trim().length > 3) {
        add(3, "Nice — naming your food builds awareness");
      }
      break;

    case "stress":
      if (hasTag(dbEntry, "gentle") && hasTag(dbEntry, "lean-protein")) {
        add(7, "Balanced meal supports calm gut-brain vibes");
      }
      if (hasTag(dbEntry, "processed") && hasTag(dbEntry, "heavy")) {
        add(-3, "Heavy processed food can stress the gut");
      }
      break;

    case "sleep":
      if (hasTag(dbEntry, "heavy")) {
        add(-6, "Heavy food late at night can disrupt sleep digestion");
      }
      if (hasTag(dbEntry, "trigger-caffeine")) {
        add(-5, "Caffeine may affect sleep — and gut repair overnight");
      }
      if (hasTag(dbEntry, "gentle") && !hasTag(dbEntry, "heavy")) {
        add(4, "Light choice — easier on overnight digestion 🌙");
      }
      break;
  }

  return reasons;
}

export function calculateMealXp(
  entries: FoodEntry[],
  goals: Goal[]
): MealXpResult {
  const reasons: MealXpReason[] = [];
  const entryXp = new Map<string, number>();

  for (const entry of entries) {
    const dbEntry = entry.foodDbId
      ? getFoodById(entry.foodDbId)
      : inferFoodDbEntry(entry.name);

    let itemTotal = BASE_LOG_XP;
    reasons.push({
      entryId: entry.id,
      entryName: entry.name,
      xp: BASE_LOG_XP,
      reason: "Logged a meal — tracking builds better habits!",
    });

    for (const goal of goals) {
      const goalReasons = scoreForGoal(entry, goal, dbEntry);
      for (const r of goalReasons) {
        reasons.push(r);
        itemTotal += r.xp;
      }
    }

    entryXp.set(entry.id, itemTotal);
  }

  const totalXp = [...entryXp.values()].reduce((a, b) => a + b, 0);

  return { totalXp, reasons, entryXp };
}
