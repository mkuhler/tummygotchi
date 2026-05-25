import { getFoodById } from "../lib/foodLookup";
import type { MealLog, MealXpReason } from "../types";

type Props = {
  meal: MealLog;
  previousXp: number;
  onContinue: () => void;
};

function groupReasonsByFood(reasons: MealXpReason[]) {
  const map = new Map<string, { name: string; reasons: MealXpReason[]; xp: number }>();

  for (const r of reasons) {
    const existing = map.get(r.entryId);
    if (existing) {
      existing.reasons.push(r);
      existing.xp += r.xp;
    } else {
      map.set(r.entryId, {
        name: r.entryName,
        reasons: [r],
        xp: r.xp,
      });
    }
  }

  return [...map.values()];
}

export function XpResultScreen({ meal, previousXp, onContinue }: Props) {
  const grouped = groupReasonsByFood(meal.reasons);
  const isGain = meal.totalXp >= 0;

  return (
    <div className="xp-result">
      <header className="xp-result__header">
        <p className="xp-result__eyebrow">Meal logged!</p>
        <h2 className={`xp-result__total ${isGain ? "xp-result__total--gain" : "xp-result__total--loss"}`}>
          {isGain ? "+" : ""}
          {meal.totalXp} XP
        </h2>
        <p className="xp-result__level">
          Total: {previousXp + meal.totalXp} XP
        </p>
      </header>

      <section className="xp-result__foods">
        <h3>Why your Tummy-Gotchi reacted</h3>
        {grouped.map((group) => {
          const db = meal.entries.find((e) => e.name === group.name);
          const emoji =
            (db?.foodDbId && getFoodById(db.foodDbId)?.emoji) || "🍽️";

          return (
            <article key={group.name} className="xp-food-block">
              <div className="xp-food-block__head">
                <span>{emoji}</span>
                <strong>{group.name}</strong>
                <span className={`xp-food-block__xp ${group.xp >= 0 ? "pos" : "neg"}`}>
                  {group.xp >= 0 ? "+" : ""}
                  {group.xp} XP
                </span>
              </div>
              <ul>
                {group.reasons.map((r, i) => (
                  <li key={i} className={r.xp >= 0 ? "reason--pos" : "reason--neg"}>
                    {r.reason}
                    {r.xp !== 0 && (
                      <span className="reason__xp">
                        ({r.xp >= 0 ? "+" : ""}
                        {r.xp})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <p className="xp-result__hint">
        Your foods are now in the fridge 🧊
      </p>

      <button type="button" className="primary-btn" onClick={onContinue}>
        Back to home
      </button>
    </div>
  );
}
