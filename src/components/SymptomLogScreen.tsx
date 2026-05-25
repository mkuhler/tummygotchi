import { useState } from "react";
import type { SymptomType } from "../types";

type Props = {
  onSubmit: (type: SymptomType, severity: number, notes?: string) => void;
  onCancel: () => void;
};

const SYMPTOMS: { id: SymptomType; label: string; emoji: string }[] = [
  { id: "bloating", label: "Bloating", emoji: "🎈" },
  { id: "cramping", label: "Cramping", emoji: "😣" },
  { id: "reflux", label: "Heartburn / reflux", emoji: "🔥" },
  { id: "nausea", label: "Nausea", emoji: "🤢" },
  { id: "gas", label: "Gas", emoji: "💨" },
  { id: "urgency", label: "Urgency", emoji: "🏃" },
  { id: "fatigue", label: "Gut fatigue", emoji: "😴" },
];

export function SymptomLogScreen({ onSubmit, onCancel }: Props) {
  const [selected, setSelected] = useState<SymptomType | null>(null);
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(selected, severity, notes.trim() || undefined);
  };

  return (
    <div className="symptom-log">
      <header className="symptom-log__header">
        <button type="button" className="back-btn" onClick={onCancel}>
          ← Back
        </button>
        <h2>Log a symptom</h2>
        <p>How is your tummy feeling? This helps your Tummy Guide find patterns.</p>
      </header>

      <section className="symptom-log__grid">
        {SYMPTOMS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`symptom-chip ${selected === s.id ? "symptom-chip--active" : ""}`}
            onClick={() => setSelected(s.id)}
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </section>

      {selected && (
        <section className="symptom-log__severity">
          <label className="field-label">Severity (1 = mild, 5 = severe)</label>
          <div className="severity-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`severity-btn ${severity === n ? "severity-btn--active" : ""}`}
                onClick={() => setSeverity(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </section>
      )}

      {selected && (
        <section className="symptom-log__notes">
          <label className="field-label">Notes (optional)</label>
          <textarea
            className="symptom-notes"
            placeholder="Anything else? e.g. after lunch, stressed…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={200}
            rows={2}
          />
        </section>
      )}

      <button
        type="button"
        className="primary-btn symptom-log__submit"
        disabled={!selected}
        onClick={handleSubmit}
      >
        Save symptom
      </button>
    </div>
  );
}
