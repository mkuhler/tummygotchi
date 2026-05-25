import { SURVEY_QUESTIONS } from "../data/survey";
import { GOALS } from "../data/goals";
import { inferCustomGoalWeights } from "./customAnswerInference";
import type { Goal, GoalId, PetDNA, PetArchetype, SurveyAnswer } from "../types";

const PET_NAMES = [
  "Bloop",
  "Mochi",
  "Pip",
  "Gurgle",
  "Nibble",
  "Wobble",
  "Sprinkle",
  "Puffo",
  "Tummy",
  "Bellybean",
];

const ARCHETYPE_BY_GOAL: Partial<Record<GoalId, PetArchetype>> = {
  fiber: "sprout",
  hydration: "droplet",
  bloating: "cloud",
  triggers: "ember",
  sleep: "moon",
  stress: "moon",
  regularity: "star",
  "mindful-eating": "star",
};

const PALETTES: Record<
  PetArchetype,
  { primary: string; accent: string; belly: string }
> = {
  sprout: { primary: "#7ec850", accent: "#4a8f2e", belly: "#b8e89a" },
  droplet: { primary: "#5eb8ff", accent: "#2a7fd4", belly: "#a8dcff" },
  cloud: { primary: "#e8b4ff", accent: "#b07ad4", belly: "#f5e0ff" },
  ember: { primary: "#ff9a6c", accent: "#e05a2b", belly: "#ffd4b8" },
  moon: { primary: "#9b8cff", accent: "#6b5ad4", belly: "#d4cfff" },
  star: { primary: "#ffd166", accent: "#f4a127", belly: "#fff0b8" },
};

export function suggestPetName(_archetype?: PetArchetype): string {
  return PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
}

export function deriveGoals(answers: SurveyAnswer[]): Goal[] {
  const scores = new Map<GoalId, number>();

  for (const answer of answers) {
    const question = SURVEY_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const weights =
      answer.isCustom || answer.optionId === "custom"
        ? inferCustomGoalWeights(answer.label, question.customFallbackWeights)
        : question.options.find((o) => o.id === answer.optionId)?.goalWeights;

    if (!weights) continue;
    for (const [goalId, weight] of Object.entries(weights)) {
      const id = goalId as GoalId;
      scores.set(id, (scores.get(id) ?? 0) + (weight ?? 0));
    }
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const top3 = ranked.slice(0, 3);
  const fallback: GoalId[] = ["hydration", "regularity", "mindful-eating"];
  for (const f of fallback) {
    if (top3.length >= 3) break;
    if (!top3.includes(f)) top3.push(f);
  }

  return top3.map((id) => GOALS[id]);
}

export function hatchPet(goals: Goal[], answers: SurveyAnswer[]): PetDNA {
  const primaryGoal = goals[0]?.id ?? "regularity";
  const archetype =
    ARCHETYPE_BY_GOAL[primaryGoal] ??
    (goals[1] ? ARCHETYPE_BY_GOAL[goals[1].id] : undefined) ??
    "star";

  const palette = PALETTES[archetype];

  const stressHeavy = answers.some(
    (a) => a.optionId === "stress" || a.optionId === "gentle"
  );
  const playful = answers.some((a) => a.optionId === "playful");

  let accessory: PetDNA["accessory"] = "none";
  if (goals.some((g) => g.id === "fiber")) accessory = "leaf";
  else if (goals.some((g) => g.id === "hydration")) accessory = "drop";
  else if (goals.some((g) => g.id === "triggers")) accessory = "flame";
  else if (goals.some((g) => g.id === "bloating")) accessory = "bow";

  const eyeStyle: PetDNA["eyeStyle"] = stressHeavy
    ? "sleepy"
    : playful
      ? "sparkle"
      : "round";

  const mood: PetDNA["mood"] = playful
    ? "energetic"
    : stressHeavy
      ? "cozy"
      : "happy";

  const name = suggestPetName(archetype);

  return {
    name,
    archetype,
    primaryColor: palette.primary,
    accentColor: palette.accent,
    bellyColor: palette.belly,
    eyeStyle,
    accessory,
    mood,
  };
}
