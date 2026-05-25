export type SurveyAnswer = {
  questionId: string;
  optionId: string;
  label: string;
  isCustom?: boolean;
};

export type GoalId =
  | "regularity"
  | "bloating"
  | "triggers"
  | "hydration"
  | "fiber"
  | "stress"
  | "mindful-eating"
  | "sleep";

export type Goal = {
  id: GoalId;
  title: string;
  description: string;
  emoji: string;
};

export type PetArchetype =
  | "sprout"
  | "droplet"
  | "cloud"
  | "ember"
  | "moon"
  | "star";

export type PetDNA = {
  name: string;
  archetype: PetArchetype;
  primaryColor: string;
  accentColor: string;
  bellyColor: string;
  eyeStyle: "round" | "sleepy" | "sparkle";
  accessory: "leaf" | "drop" | "flame" | "bow" | "none";
  mood: "happy" | "cozy" | "energetic";
};

export type FoodMacros = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
};

export type FoodEntry = {
  id: string;
  name: string;
  macros: FoodMacros;
  foodDbId?: string;
};

export type FridgeItem = FoodEntry & {
  addedAt: string;
  xpEarned: number;
};

export type MealXpReason = {
  entryId: string;
  entryName: string;
  xp: number;
  reason: string;
  goalId?: GoalId;
};

export type MealLog = {
  id: string;
  date: string;
  entries: FoodEntry[];
  totalXp: number;
  reasons: MealXpReason[];
  loggedAt: string;
};

export type UserProfile = {
  goals: Goal[];
  pet: PetDNA;
  surveyAnswers: SurveyAnswer[];
  createdAt: string;
  xp: number;
  fridge: FridgeItem[];
  meals: MealLog[];
  symptoms: SymptomLog[];
  waterLogs: WaterLog[];
  bmLogs: BmLog[];
};

export type AppPhase = "welcome" | "survey" | "reveal" | "home";

export type MealXpResult = {
  totalXp: number;
  reasons: MealXpReason[];
  entryXp: Map<string, number>;
};

export type SymptomType =
  | "bloating"
  | "cramping"
  | "reflux"
  | "nausea"
  | "gas"
  | "urgency"
  | "fatigue";

export type SymptomLog = {
  id: string;
  type: SymptomType;
  severity: number;
  notes?: string;
  date: string;
  loggedAt: string;
};

export type WaterLog = {
  id: string;
  amountOz: number;
  date: string;
  loggedAt: string;
};

export type BmQuality = "great" | "ok" | "poor";

export type BmLog = {
  id: string;
  quality: BmQuality;
  date: string;
  loggedAt: string;
};

export type InsightConfidence = "low" | "medium" | "high";

export type Insight = {
  id: string;
  title: string;
  body: string;
  confidence: InsightConfidence;
  emoji: string;
};
