import { FOOD_DATABASE, type FoodDbEntry } from "../data/foodDatabase";
import type { FoodMacros } from "../types";

export function searchFoods(query: string, limit = 6): FoodDbEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.tags.some((t) => t.includes(q))
  )
    .slice(0, limit);
}

export function getFoodById(id: string): FoodDbEntry | undefined {
  return FOOD_DATABASE.find((f) => f.id === id);
}

export function getFoodByName(name: string): FoodDbEntry | undefined {
  const n = name.trim().toLowerCase();
  return FOOD_DATABASE.find((f) => f.name.toLowerCase() === n);
}

export function autofillMacros(entry: FoodDbEntry): FoodMacros {
  return { ...entry.macros };
}

export function inferFoodDbEntry(name: string): FoodDbEntry | undefined {
  const exact = getFoodByName(name);
  if (exact) return exact;

  const q = name.trim().toLowerCase();
  return FOOD_DATABASE.find((f) => f.name.toLowerCase().includes(q));
}
