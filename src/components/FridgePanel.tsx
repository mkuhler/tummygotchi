import { getFoodById } from "../lib/foodLookup";
import type { FridgeItem } from "../types";

type Props = {
  items: FridgeItem[];
  petName: string;
  embedded?: boolean;
};

export function FridgePanel({ items, petName, embedded = false }: Props) {
  const recent = [...items]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, 8);

  return (
    <section className={`fridge ${embedded ? "fridge--embedded" : ""}`}>
      {!embedded && <h3>🧊 {petName}'s fridge</h3>}
      {recent.length === 0 ? (
        <p className="fridge__empty">No foods yet — log a meal to stock up!</p>
      ) : (
        <ul className="fridge__grid">
          {recent.map((item) => {
            const emoji =
              (item.foodDbId && getFoodById(item.foodDbId)?.emoji) || "🍽️";
            return (
              <li key={`${item.id}-${item.addedAt}`} className="fridge__item">
                <span className="fridge__emoji">{emoji}</span>
                <span className="fridge__name">{item.name}</span>
                <span className={`fridge__xp ${item.xpEarned >= 0 ? "pos" : "neg"}`}>
                  {item.xpEarned >= 0 ? "+" : ""}
                  {item.xpEarned}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
