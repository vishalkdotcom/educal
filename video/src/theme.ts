export const colors = {
  primary: "#2196F3",
  primaryDark: "#1976D2",
  primaryLight: "#90CAF9",
  primaryContainer: "#E3F2FD",
  bgDark: "#0F172A",
  bgDarkLight: "#1E293B",
  surface: "#F8FAFC",
  white: "#FFFFFF",
  onSurface: "#1E293B",
  onSurfaceVariant: "#64748B",
  success: "#10B981",
} as const;

export const FPS = 30;
export const TOTAL_DURATION = 720; // 24s @ 30fps

// Scene frame ranges
export const SCENE_HOOK = { start: 0, duration: 120 }; // 0-4s
export const SCENE_ONBOARDING = { start: 0, duration: 300 }; // 4-14s (10s)
export const SCENE_DASHBOARD = { start: 0, duration: 180 }; // 14-20s (6s)
export const SCENE_CTA = { start: 0, duration: 120 }; // 20-24s (4s)

export const TRANSITION_DURATION = 10; // 0.33s overlap
