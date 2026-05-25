# Tummy-Gotchi

A virtual pet web app to track GI health. Complete a 5-question welcome chat with the **Tummy Guide** (conversational AI-style onboarding), get **3 personalized gut-health goals**, and hatch a unique **pixel-art Tummy-Gotchi** based on your answers.

## Run locally

### WSL (Ubuntu-24.04) — recommended on Windows

```bash
cd /mnt/c/Users/madis/.cursor/projects/empty-window/tummy-gotchi
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open **http://localhost:5173** from Windows (WSL forwards the port).

From PowerShell:

```powershell
wsl -d Ubuntu-24.04 -- bash -lc "cd /mnt/c/Users/madis/.cursor/projects/empty-window/tummy-gotchi && npm run dev -- --host 0.0.0.0 --port 5173"
```

WSL already includes Node **v18.19.1** and npm **9.2.0**.

### Native (any OS)

```bash
npm install
npm run dev
```

## Flow

1. **Welcome chat** — Tummy Guide asks 5 survey questions with reflective follow-ups.
2. **Reveal** — See your 3 primary goals and newly hatched pixel pet.
3. **Home** — Care for your Tummy-Gotchi and log meals, BMs, symptoms, and water (UI stubs for now).

Progress is saved in `localStorage`. Use **Start over** to retake the survey and hatch a new pet.

## Stack

- React 19 + TypeScript + Vite
- Canvas-rendered procedural pixel pets (no sprite sheets)
- Goal scoring from weighted survey answers
