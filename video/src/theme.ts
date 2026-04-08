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
export const TOTAL_DURATION = 1500; // 50s @ 30fps

// Scene durations (in frames)
export const SCENE_HOOK = { duration: 240 }; // 0-8s
export const SCENE_PROBLEM = { duration: 240 }; // 8-16s
export const SCENE_SOLUTION = { duration: 180 }; // 16-22s
export const SCENE_FEATURES = { duration: 480 }; // 22-38s
export const SCENE_DASHBOARD = { duration: 240 }; // 38-46s
export const SCENE_CTA = { duration: 205 }; // extended to fill composition (accounts for transition overlaps)

export const TRANSITION_DURATION = 15; // 0.5s overlap

export const fontFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
