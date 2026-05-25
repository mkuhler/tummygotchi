import type { GoalId } from "../types";

export type SurveyOption = {
  id: string;
  label: string;
  goalWeights: Partial<Record<GoalId, number>>;
};

export type SurveyQuestion = {
  id: string;
  prompt: string;
  followUp?: (answerLabel: string) => string;
  options: SurveyOption[];
  customFallbackWeights: Partial<Record<GoalId, number>>;
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "concern",
    prompt:
      "Hi there! I'm your Tummy Guide — think of me as a friendly coach for your gut. 💚\n\nLet's start simple: what's bothering your tummy most right now?",
    followUp: (label) =>
      `Got it — "${label}" is a really common focus. You're not alone in this.`,
    options: [
      {
        id: "irregular",
        label: "Unpredictable bathroom trips",
        goalWeights: { regularity: 3, fiber: 1, hydration: 1 },
      },
      {
        id: "bloat",
        label: "Bloating or feeling stuffed",
        goalWeights: { bloating: 3, "mindful-eating": 2, triggers: 1 },
      },
      {
        id: "pain",
        label: "Cramping or discomfort after eating",
        goalWeights: { triggers: 3, "mindful-eating": 2, stress: 1 },
      },
      {
        id: "reflux",
        label: "Heartburn or acid reflux",
        goalWeights: { triggers: 2, "mindful-eating": 2, sleep: 1 },
      },
    ],
    customFallbackWeights: { triggers: 1, regularity: 1, bloating: 1 },
  },
  {
    id: "typical-day",
    prompt:
      "Thanks for sharing. When you think about a typical day, how does your digestion usually feel?",
    followUp: (label) =>
      `A "${label}" day gives us a great baseline to improve from.`,
    options: [
      {
        id: "mostly-ok",
        label: "Mostly fine with occasional hiccups",
        goalWeights: { hydration: 1, fiber: 1 },
      },
      {
        id: "up-down",
        label: "Up and down — good days and rough days",
        goalWeights: { triggers: 2, regularity: 2 },
      },
      {
        id: "often-uncomfortable",
        label: "Often uncomfortable or unpredictable",
        goalWeights: { bloating: 2, stress: 2, triggers: 2 },
      },
      {
        id: "managing-condition",
        label: "Managing a known condition (IBS, IBD, etc.)",
        goalWeights: { triggers: 3, regularity: 2, stress: 1 },
      },
    ],
    customFallbackWeights: { regularity: 1, triggers: 1, stress: 1 },
  },
  {
    id: "triggers",
    prompt:
      "Many tummies react to specific triggers. Which of these sounds most like your experience?",
    followUp: (label) =>
      `Noted — we'll keep an eye on "${label}" as we shape your goals.`,
    options: [
      {
        id: "food",
        label: "Certain foods or drinks",
        goalWeights: { triggers: 3, fiber: 1 },
      },
      {
        id: "stress",
        label: "Stress, anxiety, or rushing",
        goalWeights: { stress: 3, "mindful-eating": 2 },
      },
      {
        id: "sleep",
        label: "Poor sleep or late nights",
        goalWeights: { sleep: 3, regularity: 1 },
      },
      {
        id: "unknown",
        label: "Not sure yet — I want to discover patterns",
        goalWeights: { triggers: 2, hydration: 1, regularity: 1 },
      },
    ],
    customFallbackWeights: { triggers: 2, stress: 1, sleep: 1 },
  },
  {
    id: "habits",
    prompt:
      "Almost there! Which habit would help your tummy the most if you nailed it this month?",
    followUp: (label) =>
      `"${label}" — love that focus. Small wins add up fast.`,
    options: [
      {
        id: "water",
        label: "Drinking enough water through the day",
        goalWeights: { hydration: 3 },
      },
      {
        id: "plants",
        label: "Eating more plants and fiber",
        goalWeights: { fiber: 3, bloating: 1 },
      },
      {
        id: "pace",
        label: "Eating slower and without distractions",
        goalWeights: { "mindful-eating": 3, bloating: 1 },
      },
      {
        id: "log",
        label: "Logging meals and symptoms consistently",
        goalWeights: { triggers: 2, regularity: 2 },
      },
    ],
    customFallbackWeights: { "mindful-eating": 1, hydration: 1, fiber: 1 },
  },
  {
    id: "motivation",
    prompt:
      "Last one! How do you want your Tummy-Gotchi to support you day to day?",
    followUp: () =>
      "Perfect — I have everything I need. Give me a moment to hatch your buddy...",
    options: [
      {
        id: "gentle",
        label: "Gentle reminders and encouragement",
        goalWeights: { stress: 2, "mindful-eating": 1 },
      },
      {
        id: "data",
        label: "Clear tracking and pattern insights",
        goalWeights: { triggers: 2, regularity: 2 },
      },
      {
        id: "playful",
        label: "Fun streaks and celebrating small wins",
        goalWeights: { hydration: 1, fiber: 1, regularity: 1 },
      },
      {
        id: "holistic",
        label: "Whole-lifestyle balance (food, sleep, stress)",
        goalWeights: { sleep: 2, stress: 2, hydration: 1 },
      },
    ],
    customFallbackWeights: { stress: 1, regularity: 1, triggers: 1 },
  },
];
