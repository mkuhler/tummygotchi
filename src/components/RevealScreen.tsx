import { useEffect, useState } from "react";
import { PixelPet } from "./PixelPet";
import { suggestPetName } from "../lib/goalEngine";
import type { Goal, PetDNA } from "../types";

type Props = {
  goals: Goal[];
  pet: PetDNA;
  onNamePet: (name: string) => void;
  onContinue: () => void;
};

const ARCHETYPE_LABELS: Record<PetDNA["archetype"], string> = {
  sprout: "Sprout Tummy",
  droplet: "Droplet Tummy",
  cloud: "Cloud Tummy",
  ember: "Ember Tummy",
  moon: "Moon Tummy",
  star: "Star Tummy",
};

export function RevealScreen({ goals, pet, onNamePet, onContinue }: Props) {
  const [name, setName] = useState(pet.name);

  useEffect(() => {
    setName(pet.name);
  }, [pet.name]);

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onNamePet(trimmed);
    onContinue();
  };

  const handleShuffleName = () => {
    setName(suggestPetName(pet.archetype));
  };

  const displayName = name.trim() || pet.name;

  return (
    <div className="reveal">
      <p className="reveal__eyebrow">✨ Your Tummy-Gotchi has hatched!</p>
      <p className="reveal__type">{ARCHETYPE_LABELS[pet.archetype]}</p>

      <div className="reveal__pet-stage">
        <PixelPet dna={pet} scale={5} />
      </div>

      <section className="reveal__naming">
        <label className="reveal__naming-label" htmlFor="pet-name">
          Give your buddy a name
        </label>
        <div className="reveal__naming-row">
          <input
            id="pet-name"
            type="text"
            className="reveal__name-input"
            value={name}
            maxLength={24}
            placeholder="e.g. Mochi, Bloop, Pip…"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          />
          <button
            type="button"
            className="secondary-btn reveal__shuffle"
            onClick={handleShuffleName}
            title="Suggest another name"
          >
            🎲
          </button>
        </div>
      </section>

      <section className="reveal__goals">
        <h3>Your 3 primary goals</h3>
        <ul>
          {goals.map((g, i) => (
            <li key={g.id}>
              <span className="goal-rank">#{i + 1}</span>
              <span className="goal-emoji">{g.emoji}</span>
              <div>
                <strong>{g.title}</strong>
                <p>{g.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="reveal__hint">
        {displayName} will grow happier as you log meals, symptoms, and habits
        toward these goals.
      </p>

      <button
        type="button"
        className="primary-btn"
        disabled={!name.trim()}
        onClick={handleContinue}
      >
        Meet {displayName || "my Tummy-Gotchi"}
      </button>
    </div>
  );
}
