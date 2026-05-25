import type { BmQuality } from "../types";

type Props = {
  onSubmit: (quality: BmQuality) => void;
  onCancel: () => void;
};

const OPTIONS: { id: BmQuality; label: string; emoji: string }[] = [
  { id: "great", label: "Great", emoji: "😊" },
  { id: "ok", label: "OK", emoji: "😐" },
  { id: "poor", label: "Rough", emoji: "😣" },
];

export function BmLogScreen({ onSubmit, onCancel }: Props) {
  return (
    <div className="symptom-log">
      <header className="symptom-log__header">
        <button type="button" className="back-btn" onClick={onCancel}>
          ← Back
        </button>
        <h2>Log bathroom trip</h2>
        <p>Quick check-in — helps track regularity patterns.</p>
      </header>
      <div className="symptom-log__grid">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="symptom-chip"
            onClick={() => onSubmit(opt.id)}
          >
            <span>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
