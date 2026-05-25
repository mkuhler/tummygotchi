import type { UserProfile } from "../types";

const KEY = "tummy-gotchi-profile";

function migrateProfile(raw: UserProfile): UserProfile {
  return {
    ...raw,
    xp: raw.xp ?? 0,
    fridge: raw.fridge ?? [],
    meals: raw.meals ?? [],
    symptoms: raw.symptoms ?? [],
    waterLogs: raw.waterLogs ?? [],
    bmLogs: raw.bmLogs ?? [],
  };
}

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return migrateProfile(JSON.parse(raw) as UserProfile);
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEY, JSON.stringify(migrateProfile(profile)));
}

export function clearProfile(): void {
  localStorage.removeItem(KEY);
}

export function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}
