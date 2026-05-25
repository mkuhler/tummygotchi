import { useCallback, useEffect, useState } from "react";
import { WelcomeChat } from "./components/WelcomeChat";
import { RevealScreen } from "./components/RevealScreen";
import { HomeScreen } from "./components/HomeScreen";
import { MealLogScreen } from "./components/MealLogScreen";
import { SymptomLogScreen } from "./components/SymptomLogScreen";
import { BmLogScreen } from "./components/BmLogScreen";
import { XpResultScreen } from "./components/XpResultScreen";
import { deriveGoals, hatchPet } from "./lib/goalEngine";
import { calculateMealXp } from "./lib/mealXpEngine";
import { loadProfile, saveProfile, clearProfile, todayDateKey } from "./lib/storage";
import type {
  AppPhase,
  BmQuality,
  FoodEntry,
  FridgeItem,
  MealLog,
  SurveyAnswer,
  SymptomType,
  UserProfile,
} from "./types";

type HomeView = "dashboard" | "meal-log" | "meal-xp" | "symptom-log" | "bm-log";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [surveyKey, setSurveyKey] = useState(0);
  const [homeView, setHomeView] = useState<HomeView>("dashboard");
  const [lastMeal, setLastMeal] = useState<MealLog | null>(null);
  const [xpBeforeMeal, setXpBeforeMeal] = useState(0);

  useEffect(() => {
    const forceOnboarding = new URLSearchParams(window.location.search).has(
      "onboarding"
    );
    if (forceOnboarding) {
      clearProfile();
      setPhase("welcome");
      setSurveyKey((k) => k + 1);
      return;
    }

    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      setPhase("home");
    }
  }, []);

  const handleSurveyComplete = useCallback((answers: SurveyAnswer[]) => {
    const goals = deriveGoals(answers);
    const pet = hatchPet(goals, answers);

    const newProfile: UserProfile = {
      goals,
      pet,
      surveyAnswers: answers,
      createdAt: new Date().toISOString(),
      xp: 0,
      fridge: [],
      meals: [],
      symptoms: [],
      waterLogs: [],
      bmLogs: [],
    };
    setProfile(newProfile);
    saveProfile(newProfile);
    setPhase("reveal");
  }, []);

  const handleProfileUpdate = useCallback((updated: UserProfile) => {
    setProfile(updated);
    saveProfile(updated);
  }, []);

  const handleRenamePet = useCallback(
    (name: string) => {
      if (!profile) return;
      handleProfileUpdate({
        ...profile,
        pet: { ...profile.pet, name },
      });
    },
    [profile, handleProfileUpdate]
  );

  const handleMealSubmit = useCallback(
    (entries: FoodEntry[]) => {
      if (!profile) return;

      const xpResult = calculateMealXp(entries, profile.goals);
      const now = new Date().toISOString();

      const fridgeItems: FridgeItem[] = entries.map((entry) => ({
        ...entry,
        addedAt: now,
        xpEarned: xpResult.entryXp.get(entry.id) ?? 0,
      }));

      const meal: MealLog = {
        id: crypto.randomUUID(),
        date: todayDateKey(),
        entries,
        totalXp: xpResult.totalXp,
        reasons: xpResult.reasons,
        loggedAt: now,
      };

      const updated: UserProfile = {
        ...profile,
        xp: profile.xp + xpResult.totalXp,
        fridge: [...profile.fridge, ...fridgeItems],
        meals: [...profile.meals, meal],
      };

      setXpBeforeMeal(profile.xp);
      setLastMeal(meal);
      handleProfileUpdate(updated);
      setHomeView("meal-xp");
    },
    [profile, handleProfileUpdate]
  );

  const handleSymptomSubmit = useCallback(
    (type: SymptomType, severity: number, notes?: string) => {
      if (!profile) return;
      const now = new Date().toISOString();
      handleProfileUpdate({
        ...profile,
        symptoms: [
          ...profile.symptoms,
          {
            id: crypto.randomUUID(),
            type,
            severity,
            notes,
            date: todayDateKey(),
            loggedAt: now,
          },
        ],
      });
      setHomeView("dashboard");
    },
    [profile, handleProfileUpdate]
  );

  const handleBmSubmit = useCallback(
    (quality: BmQuality) => {
      if (!profile) return;
      const now = new Date().toISOString();
      handleProfileUpdate({
        ...profile,
        bmLogs: [
          ...profile.bmLogs,
          {
            id: crypto.randomUUID(),
            quality,
            date: todayDateKey(),
            loggedAt: now,
          },
        ],
      });
      setHomeView("dashboard");
    },
    [profile, handleProfileUpdate]
  );

  const handleWaterLog = useCallback(() => {
    if (!profile) return;
    const now = new Date().toISOString();
    handleProfileUpdate({
      ...profile,
      waterLogs: [
        ...profile.waterLogs,
        {
          id: crypto.randomUUID(),
          amountOz: 8,
          date: todayDateKey(),
          loggedAt: now,
        },
      ],
    });
  }, [profile, handleProfileUpdate]);

  const handleRevealContinue = () => {
    setHomeView("dashboard");
    setPhase("home");
  };

  const handleReset = () => {
    clearProfile();
    setProfile(null);
    setSurveyKey((k) => k + 1);
    setHomeView("dashboard");
    setLastMeal(null);
    setPhase("welcome");
  };

  return (
    <div className="app-shell">
      {phase === "welcome" && (
        <WelcomeChat key={surveyKey} onComplete={handleSurveyComplete} />
      )}
      {phase === "reveal" && profile && (
        <RevealScreen
          goals={profile.goals}
          pet={profile.pet}
          onNamePet={handleRenamePet}
          onContinue={handleRevealContinue}
        />
      )}
      {phase === "home" && profile && homeView === "dashboard" && (
        <HomeScreen
          pet={profile.pet}
          goals={profile.goals}
          profile={profile}
          onLogMeal={() => setHomeView("meal-log")}
          onLogSymptom={() => setHomeView("symptom-log")}
          onLogBm={() => setHomeView("bm-log")}
          onLogWater={handleWaterLog}
          onRenamePet={handleRenamePet}
          onReset={handleReset}
        />
      )}
      {phase === "home" && profile && homeView === "meal-log" && (
        <MealLogScreen
          onSubmit={handleMealSubmit}
          onCancel={() => setHomeView("dashboard")}
        />
      )}
      {phase === "home" && profile && homeView === "symptom-log" && (
        <SymptomLogScreen
          onSubmit={handleSymptomSubmit}
          onCancel={() => setHomeView("dashboard")}
        />
      )}
      {phase === "home" && profile && homeView === "bm-log" && (
        <BmLogScreen
          onSubmit={handleBmSubmit}
          onCancel={() => setHomeView("dashboard")}
        />
      )}
      {phase === "home" && profile && homeView === "meal-xp" && lastMeal && (
        <XpResultScreen
          meal={lastMeal}
          previousXp={xpBeforeMeal}
          onContinue={() => {
            setHomeView("dashboard");
            setLastMeal(null);
          }}
        />
      )}
    </div>
  );
}
