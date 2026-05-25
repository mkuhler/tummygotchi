import type { Goal, GoalId } from "../types";

export const GOALS: Record<GoalId, Goal> = {
  regularity: {
    id: "regularity",
    title: "Rhythm & Regularity",
    description: "Build a steady daily routine your gut can count on.",
    emoji: "🌅",
  },
  bloating: {
    id: "bloating",
    title: "Ease the Bloat",
    description: "Track patterns and habits that keep you feeling light.",
    emoji: "☁️",
  },
  triggers: {
    id: "triggers",
    title: "Know Your Triggers",
    description: "Spot foods and situations that upset your tummy.",
    emoji: "🔍",
  },
  hydration: {
    id: "hydration",
    title: "Stay Hydrated",
    description: "Sip consistently so digestion stays smooth.",
    emoji: "💧",
  },
  fiber: {
    id: "fiber",
    title: "Fiber Friend",
    description: "Gradually boost plants and fiber for happy microbes.",
    emoji: "🥬",
  },
  stress: {
    id: "stress",
    title: "Calm the Gut-Brain",
    description: "Lower stress that shows up as tummy tension.",
    emoji: "🧘",
  },
  "mindful-eating": {
    id: "mindful-eating",
    title: "Mindful Meals",
    description: "Slow down, chew well, and notice fullness cues.",
    emoji: "🍽️",
  },
  sleep: {
    id: "sleep",
    title: "Rest for Digestion",
    description: "Protect sleep so your gut can repair overnight.",
    emoji: "🌙",
  },
};
