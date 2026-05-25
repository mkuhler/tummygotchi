import type { GoalId } from "../types";

type KeywordRule = {
  pattern: RegExp;
  weights: Partial<Record<GoalId, number>>;
};

const KEYWORD_RULES: KeywordRule[] = [
  { pattern: /\bbloat/i, weights: { bloating: 3, "mindful-eating": 1 } },
  { pattern: /\b(stuffed|gassy|gas)\b/i, weights: { bloating: 2 } },
  { pattern: /\b(water|hydrat|drink more)\b/i, weights: { hydration: 3 } },
  { pattern: /\b(fiber|vegetable|plant|salad|whole grain)\b/i, weights: { fiber: 3 } },
  { pattern: /\b(stress|anxiety|nervous|rush)\b/i, weights: { stress: 3 } },
  { pattern: /\b(sleep|insomnia|tired|late night)\b/i, weights: { sleep: 3 } },
  { pattern: /\b(reflux|heartburn|acid)\b/i, weights: { triggers: 2, "mindful-eating": 2 } },
  { pattern: /\b(cramp|pain|ache|discomfort)\b/i, weights: { triggers: 2, stress: 1 } },
  { pattern: /\b(constip|hard stool|backed up)\b/i, weights: { regularity: 3, fiber: 2 } },
  { pattern: /\b(diarr|loose|urgent)\b/i, weights: { regularity: 2, triggers: 2 } },
  { pattern: /\b(irregular|unpredict|schedule)\b/i, weights: { regularity: 3 } },
  { pattern: /\b(trigger|food sensit|intoler|allerg)\b/i, weights: { triggers: 3 } },
  { pattern: /\b(mindful|slow eat|chew|distraction)\b/i, weights: { "mindful-eating": 3 } },
  { pattern: /\b(log|track|journal|pattern)\b/i, weights: { triggers: 2, regularity: 1 } },
  { pattern: /\b(ibs|ibd|crohn|colitis|sibo)\b/i, weights: { triggers: 3, regularity: 2, stress: 1 } },
  { pattern: /\b(remind|encourag|gentle)\b/i, weights: { stress: 2, "mindful-eating": 1 } },
  { pattern: /\b(streak|fun|play|celebrat)\b/i, weights: { hydration: 1, fiber: 1, regularity: 1 } },
];

export function inferCustomGoalWeights(
  text: string,
  fallback: Partial<Record<GoalId, number>>
): Partial<Record<GoalId, number>> {
  const weights: Partial<Record<GoalId, number>> = { ...fallback };

  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(text)) {
      for (const [goalId, w] of Object.entries(rule.weights)) {
        const id = goalId as GoalId;
        weights[id] = (weights[id] ?? 0) + (w ?? 0);
      }
    }
  }

  const hasMatches = Object.keys(weights).some(
    (k) => (weights[k as GoalId] ?? 0) > (fallback[k as GoalId] ?? 0)
  );

  if (!hasMatches && Object.keys(fallback).length === 0) {
    return { triggers: 1, regularity: 1, "mindful-eating": 1 };
  }

  return weights;
}
