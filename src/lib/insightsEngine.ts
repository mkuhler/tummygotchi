import { getFoodById } from "./foodLookup";
import type { FoodTag } from "../data/foodDatabase";
import type {
  Insight,
  MealLog,
  SymptomLog,
  SymptomType,
  UserProfile,
} from "../types";

const SYMPTOM_LABELS: Record<SymptomType, string> = {
  bloating: "bloating",
  cramping: "cramping",
  reflux: "heartburn/reflux",
  nausea: "nausea",
  gas: "gas",
  urgency: "urgency",
  fatigue: "fatigue",
};

const SYMPTOM_TAGS: Partial<Record<SymptomType, FoodTag[]>> = {
  bloating: ["bloat-risk", "trigger-dairy", "processed", "trigger-fried"],
  cramping: ["trigger-spicy", "trigger-fried", "heavy"],
  reflux: ["trigger-fried", "heavy", "trigger-caffeine"],
  gas: ["bloat-risk", "high-fiber", "trigger-dairy"],
  urgency: ["trigger-spicy", "probiotic"],
  nausea: ["heavy", "trigger-fried"],
  fatigue: ["heavy", "trigger-caffeine"],
};

const HOURS_BEFORE_SYMPTOM = 8;

function hoursBetween(isoA: string, isoB: string): number {
  return Math.abs(new Date(isoA).getTime() - new Date(isoB).getTime()) / 3_600_000;
}

function mealsBeforeSymptom(
  symptom: SymptomLog,
  meals: MealLog[]
): MealLog[] {
  return meals.filter(
    (m) =>
      hoursBetween(m.loggedAt, symptom.loggedAt) <= HOURS_BEFORE_SYMPTOM &&
      new Date(m.loggedAt) <= new Date(symptom.loggedAt)
  );
}

function insight(
  id: string,
  title: string,
  body: string,
  confidence: Insight["confidence"],
  emoji: string
): Insight {
  return { id, title, body, confidence, emoji };
}

export function generateInsights(profile: UserProfile): Insight[] {
  const insights: Insight[] = [];
  const { meals, symptoms, waterLogs, bmLogs, goals } = profile;

  if (symptoms.length === 0 && meals.length === 0) {
    return [
      insight(
        "start-tracking",
        "Start connecting the dots",
        "Log meals and symptoms over a few days — your Tummy Guide will spot patterns between what you eat and how your gut feels.",
        "low",
        "🔮"
      ),
    ];
  }

  if (symptoms.length === 0 && meals.length > 0) {
    insights.push(
      insight(
        "need-symptoms",
        "Meals logged — add symptoms next",
        `You've logged ${meals.length} meal${meals.length === 1 ? "" : "s"}. When your tummy acts up, tap Symptom so I can link habits to how you feel.`,
        "low",
        "📝"
      )
    );
  }

  // Food ↔ symptom co-occurrence
  const pairCounts = new Map<string, { food: string; symptom: SymptomType; count: number; avgSeverity: number }>();

  for (const symptom of symptoms) {
    const priorMeals = mealsBeforeSymptom(symptom, meals);
    for (const meal of priorMeals) {
      for (const entry of meal.entries) {
        const key = `${entry.name.toLowerCase()}::${symptom.type}`;
        const existing = pairCounts.get(key);
        if (existing) {
          existing.count += 1;
          existing.avgSeverity =
            (existing.avgSeverity * (existing.count - 1) + symptom.severity) /
            existing.count;
        } else {
          pairCounts.set(key, {
            food: entry.name,
            symptom: symptom.type,
            count: 1,
            avgSeverity: symptom.severity,
          });
        }
      }
    }
  }

  const topPairs = [...pairCounts.values()]
    .filter((p) => p.count >= 1 && p.avgSeverity >= 3)
    .sort((a, b) => b.count - a.count || b.avgSeverity - a.avgSeverity)
    .slice(0, 3);

  for (const pair of topPairs) {
    const conf: Insight["confidence"] =
      pair.count >= 3 ? "high" : pair.count >= 2 ? "medium" : "low";
    const foodDb = meals
      .flatMap((m) => m.entries)
      .find((e) => e.name === pair.food);
    const tags = foodDb?.foodDbId
      ? getFoodById(foodDb.foodDbId)?.tags ?? []
      : [];

    let reason = "appeared within a few hours of this symptom.";
    if (tags.includes("trigger-dairy")) reason = "contains dairy — a common trigger for sensitive tummies.";
    else if (tags.includes("trigger-spicy")) reason = "is spicy — often linked to gut irritation.";
    else if (tags.includes("trigger-fried")) reason = "is fried or heavy — harder for some guts to handle.";
    else if (tags.includes("bloat-risk")) reason = "is a known bloat-risk food for many people.";

    insights.push(
      insight(
        `pair-${pair.food}-${pair.symptom}`,
        `${pair.food} → ${SYMPTOM_LABELS[pair.symptom]}`,
        `${pair.food} showed up ${pair.count} time${pair.count === 1 ? "" : "s"} before ${SYMPTOM_LABELS[pair.symptom]} (avg severity ${pair.avgSeverity.toFixed(1)}/5). It ${reason}`,
        conf,
        "🔗"
      )
    );
  }

  // Tag-level pattern analysis
  const tagSymptomHits = new Map<string, number>();
  for (const symptom of symptoms) {
    const priorMeals = mealsBeforeSymptom(symptom, meals);
    const relevantTags = SYMPTOM_TAGS[symptom.type] ?? [];
    for (const meal of priorMeals) {
      for (const entry of meal.entries) {
        const db = entry.foodDbId ? getFoodById(entry.foodDbId) : undefined;
        for (const tag of db?.tags ?? []) {
          if (relevantTags.includes(tag)) {
            tagSymptomHits.set(tag, (tagSymptomHits.get(tag) ?? 0) + 1);
          }
        }
      }
    }
  }

  const topTag = [...tagSymptomHits.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topTag && topTag[1] >= 2 && insights.length < 4) {
    const [tag, hits] = topTag;
    const tagLabel = tag.replace("trigger-", "").replace("-", " ");
    insights.push(
      insight(
        `tag-${tag}`,
        `${tagLabel} pattern detected`,
        `Foods tagged as "${tagLabel}" appeared before symptoms ${hits} times recently. Try swapping one serving and logging how you feel 24 hours later.`,
        hits >= 3 ? "high" : "medium",
        "🏷️"
      )
    );
  }

  // Hydration habit vs symptoms
  const last7 = Date.now() - 7 * 86_400_000;
  const recentWater = waterLogs.filter((w) => new Date(w.loggedAt).getTime() > last7);
  const recentSymptoms = symptoms.filter((s) => new Date(s.loggedAt).getTime() > last7);
  const waterDays = new Set(recentWater.map((w) => w.date)).size;
  const lowWater = recentWater.length < 4 && waterDays < 3;
  const hasBloating = recentSymptoms.some((s) => s.type === "bloating" || s.type === "gas");

  if (lowWater && hasBloating && goals.some((g) => g.id === "hydration")) {
    insights.push(
      insight(
        "hydration-bloat",
        "Low hydration may worsen bloating",
        "On days with less water logged, you also reported bloating or gas. Even one extra glass with meals could help — worth testing for a week.",
        "medium",
        "💧"
      )
    );
  }

  // Protective foods — meals on symptom-free days
  const symptomDates = new Set(symptoms.map((s) => s.date));
  const calmDayFoods = new Map<string, number>();
  for (const meal of meals) {
    if (!symptomDates.has(meal.date)) {
      for (const entry of meal.entries) {
        calmDayFoods.set(entry.name, (calmDayFoods.get(entry.name) ?? 0) + 1);
      }
    }
  }

  const topCalmFood = [...calmDayFoods.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCalmFood && topCalmFood[1] >= 2 && insights.length < 5) {
    const [food, count] = topCalmFood;
    insights.push(
      insight(
        `calm-${food}`,
        `${food} on your good days`,
        `${food} showed up ${count} times on days you didn't log symptoms. It might be a gentle choice for your tummy — keep it in rotation.`,
        count >= 3 ? "medium" : "low",
        "✨"
      )
    );
  }

  // BM regularity
  const recentBm = bmLogs.filter((b) => new Date(b.loggedAt).getTime() > last7);
  const poorBm = recentBm.filter((b) => b.quality === "poor").length;
  if (poorBm >= 2 && goals.some((g) => g.id === "regularity")) {
    insights.push(
      insight(
        "bm-fiber",
        "Rough bathroom days — check fiber & water",
        `You logged ${poorBm} rough bathroom trips this week. Pairing fiber-rich meals with steady hydration often helps regularity — your top goal.`,
        "medium",
        "🌅"
      )
    );
  }

  if (insights.length === 0) {
    insights.push(
      insight(
        "keep-going",
        "Building your pattern map",
        "Not enough overlap yet for a strong link. Keep logging meals, water, and symptoms — patterns usually show up after 3–5 days of data.",
        "low",
        "🌱"
      )
    );
  }

  return insights.slice(0, 5);
}
