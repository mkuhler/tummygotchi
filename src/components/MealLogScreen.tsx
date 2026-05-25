import { useState } from "react";
import { autofillMacros, searchFoods } from "../lib/foodLookup";
import type { FoodDbEntry } from "../data/foodDatabase";
import type { FoodEntry, FoodMacros } from "../types";

type Props = {
  onSubmit: (entries: FoodEntry[]) => void;
  onCancel: () => void;
};

type DraftEntry = {
  id: string;
  name: string;
  foodDbId?: string;
  emoji?: string;
  serving?: string;
  macros: FoodMacros;
  showMacros: boolean;
};

function emptyEntry(): DraftEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    macros: {},
    showMacros: false,
  };
}

function toFoodEntry(draft: DraftEntry): FoodEntry | null {
  const name = draft.name.trim();
  if (!name) return null;
  return {
    id: draft.id,
    name,
    macros: { ...draft.macros },
    foodDbId: draft.foodDbId,
  };
}

export function MealLogScreen({ onSubmit, onCancel }: Props) {
  const [entries, setEntries] = useState<DraftEntry[]>([emptyEntry()]);
  const [activeSuggest, setActiveSuggest] = useState<string | null>(null);

  const updateEntry = (id: string, patch: Partial<DraftEntry>) => {
    setEntries((list) =>
      list.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };

  const applyFoodDb = (entryId: string, food: FoodDbEntry) => {
    updateEntry(entryId, {
      name: food.name,
      foodDbId: food.id,
      emoji: food.emoji,
      serving: food.serving,
      macros: autofillMacros(food),
      showMacros: true,
    });
    setActiveSuggest(null);
  };

  const updateMacro = (
    entryId: string,
    key: keyof FoodMacros,
    value: string
  ) => {
    const num = value === "" ? undefined : Number(value);
    setEntries((list) =>
      list.map((e) =>
        e.id === entryId
          ? { ...e, macros: { ...e.macros, [key]: num } }
          : e
      )
    );
  };

  const handleSubmit = () => {
    const valid = entries.map(toFoodEntry).filter(Boolean) as FoodEntry[];
    if (valid.length === 0) return;
    onSubmit(valid);
  };

  const validCount = entries.filter((e) => e.name.trim()).length;

  return (
    <div className="meal-log">
      <header className="meal-log__header">
        <button type="button" className="back-btn" onClick={onCancel}>
          ← Back
        </button>
        <div>
          <h2>What did you eat today?</h2>
          <p>Add foods one at a time. Autofill nutrition or enter manually.</p>
        </div>
      </header>

      <div className="meal-log__entries">
        {entries.map((entry, index) => {
          const suggestions =
            activeSuggest === entry.id && entry.name.trim()
              ? searchFoods(entry.name)
              : [];

          return (
            <article key={entry.id} className="food-entry-card">
              <div className="food-entry-card__head">
                <span className="food-entry-card__num">#{index + 1}</span>
                {entry.emoji && (
                  <span className="food-entry-card__emoji">{entry.emoji}</span>
                )}
                {entries.length > 1 && (
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() =>
                      setEntries((list) => list.filter((e) => e.id !== entry.id))
                    }
                    aria-label="Remove food"
                  >
                    ✕
                  </button>
                )}
              </div>

              <label className="field-label">Food name</label>
              <input
                type="text"
                className="text-field"
                placeholder="e.g. Oatmeal, salad, coffee…"
                value={entry.name}
                onChange={(e) => {
                  updateEntry(entry.id, {
                    name: e.target.value,
                    foodDbId: undefined,
                    emoji: undefined,
                    serving: undefined,
                  });
                  setActiveSuggest(entry.id);
                }}
                onFocus={() => setActiveSuggest(entry.id)}
              />

              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((food) => (
                    <li key={food.id}>
                      <button
                        type="button"
                        onClick={() => applyFoodDb(entry.id, food)}
                      >
                        <span>{food.emoji}</span>
                        <span>{food.name}</span>
                        <span className="suggestions__meta">
                          {food.serving} · {food.macros.calories} cal
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="food-entry-card__actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    updateEntry(entry.id, { showMacros: !entry.showMacros })
                  }
                >
                  {entry.showMacros ? "Hide nutrition" : "Add nutrition details"}
                </button>
                {entry.name.trim() && !entry.foodDbId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      const match = searchFoods(entry.name, 1)[0];
                      if (match) applyFoodDb(entry.id, match);
                    }}
                  >
                    Try autofill
                  </button>
                )}
              </div>

              {entry.showMacros && (
                <div className="macros-grid">
                  {entry.serving && (
                    <p className="macros-grid__serving">Serving: {entry.serving}</p>
                  )}
                  {(
                    [
                      ["calories", "Calories", "kcal"],
                      ["protein", "Protein", "g"],
                      ["carbs", "Carbs", "g"],
                      ["fat", "Fat", "g"],
                      ["fiber", "Fiber", "g"],
                    ] as const
                  ).map(([key, label, unit]) => (
                    <label key={key} className="macro-field">
                      <span>{label}</span>
                      <input
                        type="number"
                        min={0}
                        step={key === "calories" ? 1 : 0.1}
                        placeholder="—"
                        value={entry.macros[key] ?? ""}
                        onChange={(e) =>
                          updateMacro(entry.id, key, e.target.value)
                        }
                      />
                      <span className="macro-field__unit">{unit}</span>
                    </label>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className="secondary-btn meal-log__add"
        onClick={() => setEntries((list) => [...list, emptyEntry()])}
      >
        + Add another food
      </button>

      <button
        type="button"
        className="primary-btn meal-log__submit"
        disabled={validCount === 0}
        onClick={handleSubmit}
      >
        Log meal ({validCount} item{validCount === 1 ? "" : "s"})
      </button>
    </div>
  );
}
