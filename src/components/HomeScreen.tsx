import { useState } from "react";
import { PixelPet } from "./PixelPet";
import { FridgePanel } from "./FridgePanel";
import { EditablePetName } from "./EditablePetName";
import { InsightsPanel } from "./InsightsPanel";
import type { Goal, PetDNA, UserProfile } from "../types";

type Props = {
  pet: PetDNA;
  goals: Goal[];
  profile: UserProfile;
  onLogMeal: () => void;
  onLogSymptom: () => void;
  onLogBm: () => void;
  onLogWater: () => void;
  onRenamePet: (name: string) => void;
  onReset: () => void;
};

type HomeTab = "fridge" | "focus" | "insights";

const TABS: { id: HomeTab; label: string; emoji: string }[] = [
  { id: "fridge", label: "Fridge", emoji: "🧊" },
  { id: "focus", label: "Focus", emoji: "🎯" },
  { id: "insights", label: "Insights", emoji: "✨" },
];

export function HomeScreen({
  pet,
  goals,
  profile,
  onLogMeal,
  onLogSymptom,
  onLogBm,
  onLogWater,
  onRenamePet,
  onReset,
}: Props) {
  const [activeTab, setActiveTab] = useState<HomeTab>("fridge");

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const xp = profile.xp ?? 0;
  const gutJoy = Math.min(100, 40 + xp / 5);
  const todayWater = (profile.waterLogs ?? []).filter(
    (w) => w.date === new Date().toISOString().slice(0, 10)
  ).length;

  return (
    <div className="home">
      <header className="home__header">
        <h1>Tummy-Gotchi</h1>
        <p className="home__date">{today}</p>
      </header>

      <section className="home__pet-card">
        <PixelPet dna={pet} scale={2} />
        <div className="home__pet-info">
          <EditablePetName
            name={pet.name}
            onSave={onRenamePet}
            className="home__pet-name"
          />
          <p className="home__mood">
            Mood:{" "}
            {pet.mood === "energetic"
              ? "⚡ Energetic"
              : pet.mood === "cozy"
                ? "😌 Cozy"
                : "😊 Happy"}
          </p>
          <div className="home__stats">
            <div className="stat">
              <span>XP</span>
              <strong className="stat__value">{xp}</strong>
            </div>
            <div className="stat">
              <span>Gut joy</span>
              <meter value={gutJoy} min={0} max={100} />
            </div>
          </div>
        </div>
      </section>

      <section className="home-tabs">
        <div className="home-tabs__bar" role="tablist" aria-label="Home sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`home-tabs__btn ${activeTab === tab.id ? "home-tabs__btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="home-tabs__panel" role="tabpanel">
          {activeTab === "fridge" && (
            <FridgePanel
              items={profile.fridge ?? []}
              petName={pet.name}
              embedded
            />
          )}

          {activeTab === "focus" && (
            <section className="home__goals home__goals--tab">
              <p className="home-tabs__panel-desc">
                Your top gut-health goals from onboarding
              </p>
              <ul>
                {goals.map((g) => (
                  <li key={g.id}>
                    <span>{g.emoji}</span>
                    <div>
                      <strong>{g.title}</strong>
                      <p>{g.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === "insights" && (
            <>
              <p className="home-tabs__panel-desc">
                AI patterns between your habits and symptoms
              </p>
              <InsightsPanel profile={profile} embedded />
            </>
          )}
        </div>
      </section>

      <section className="home__actions">
        <button
          type="button"
          className="action-btn action-btn--primary"
          onClick={onLogMeal}
        >
          🍽️ Log meal
        </button>
        <button type="button" className="action-btn" onClick={onLogBm}>
          💩 Log BM
        </button>
        <button type="button" className="action-btn" onClick={onLogSymptom}>
          😣 Symptom
        </button>
        <button type="button" className="action-btn" onClick={onLogWater}>
          💧 Water{todayWater > 0 ? ` (${todayWater})` : ""}
        </button>
      </section>

      <button type="button" className="text-btn" onClick={onReset}>
        Start over (new survey)
      </button>
    </div>
  );
}
