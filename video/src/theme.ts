export const colors = {
  primary: "#2196F3",
  primaryDark: "#1976D2",
  primaryLight: "#90CAF9",
  primaryContainer: "#E3F2FD",
  bgDark: "#0F172A",
  bgDarkLight: "#1E293B",
  bgDeep: "#080E1A",
  surface: "#F8FAFC",
  white: "#FFFFFF",
  onSurface: "#1E293B",
  onSurfaceVariant: "#64748B",
  success: "#10B981",
  amber: "#F59E0B",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
// 50s promo + 1.5s pause breath + 56s "How we built it" outro
// (OutroTitle + OutroFade extended to 3s each)
export const TOTAL_DURATION = 3105;

// Scene durations (in frames)
export const SCENE_HOOK = { duration: 240 }; // 0-8s
export const SCENE_PROBLEM = { duration: 240 }; // 8-16s
export const SCENE_SOLUTION = { duration: 180 }; // 16-22s
export const SCENE_FEATURES = { duration: 480 }; // 22-38s
export const SCENE_DASHBOARD = { duration: 240 }; // 38-46s
export const SCENE_CTA = { duration: 205 }; // extended to fill composition (accounts for transition overlaps)

// A brief breath between CTA and the outro so the pivot doesn't feel like a hard cut
export const SCENE_PAUSE_BREAK = { duration: 45 }; // 1.5s dark breath

// Outro scenes (Session 3 — "How we built it" segment)
// Lengths chosen so on-screen text gets enough static read time;
// see docs/PRESENTATION_PLAN.md Session 3 for the timing rationale.
export const SCENE_OUTRO_TITLE = { duration: 90 }; // 3s — title card (entry delay +15f, exit fade last 15f)
export const SCENE_OUTRO_PROBLEM = { duration: 150 }; // 5s — headline + subhead need ~3.7s readable
export const SCENE_OUTRO_TOOLS = { duration: 300 }; // 10s — 5-node pipeline with stamps, ~5s readable
export const SCENE_OUTRO_OUTPUT = { duration: 180 }; // 6s — 3 tiles + tagline
export const SCENE_OUTRO_LEARNINGS = { duration: 570 }; // 19s — 3 quote cards (~5s/3.7s/5.8s)
export const SCENE_OUTRO_NEXT = { duration: 300 }; // 10s — 3 bullets, ~7.6s readable
export const SCENE_OUTRO_FADE = { duration: 90 }; // 3s — logo stamp, hold, then fade to black over last 25f

export const TRANSITION_DURATION = 15; // 0.5s overlap

export const fontFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
