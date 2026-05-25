import { useMemo } from "react";
import { generateInsights } from "../lib/insightsEngine";
import type { UserProfile } from "../types";

type Props = {
  profile: UserProfile;
  embedded?: boolean;
};

const CONFIDENCE_LABELS = {
  low: "Early signal",
  medium: "Likely pattern",
  high: "Strong pattern",
};

export function InsightsPanel({ profile, embedded = false }: Props) {
  const insights = useMemo(() => generateInsights(profile), [profile]);

  return (
    <section className={`insights ${embedded ? "insights--embedded" : ""}`}>
      {!embedded && (
        <>
          <div className="insights__header">
            <h3>✨ AI Insights</h3>
            <span className="insights__badge">Tummy Guide</span>
          </div>
          <p className="insights__subtitle">
            Patterns between your habits and symptoms
          </p>
        </>
      )}
      <ul className="insights__list">
        {insights.map((item) => (
          <li key={item.id} className="insight-card">
            <div className="insight-card__top">
              <span className="insight-card__emoji">{item.emoji}</span>
              <span
                className={`insight-card__confidence insight-card__confidence--${item.confidence}`}
              >
                {CONFIDENCE_LABELS[item.confidence]}
              </span>
            </div>
            <strong className="insight-card__title">{item.title}</strong>
            <p className="insight-card__body">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
