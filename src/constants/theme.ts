import { Platform } from 'react-native';

// ── Colors ──────────────────────────────────────────────────────────────────

export const Colors = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#90CAF9',
  primaryContainer: '#E3F2FD',

  surface: '#F8FAFC',
  surfaceWhite: '#FFFFFF',
  surfaceContainerHighest: '#F1F5F9',

  onSurface: '#1E293B',
  onSurfaceVariant: '#64748B',

  outline: '#CBD5E1',
  outlineLight: '#E2E8F0',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  chartPrimary: '#2196F3',
  chartSecondary: '#90CAF9',
  chartAccent: '#E3F2FD',

  // Legacy light/dark sub-objects (template compat, remove in Phase 4)
  light: {
    text: '#1E293B',
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E3F2FD',
    textSecondary: '#64748B',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

// ── Typography ──────────────────────────────────────────────────────────────

export const Typography = {
  screenTitle: {
    fontSize: 34,
    fontWeight: '800' as const,
    lineHeight: 34 * 1.1,
    color: Colors.primary,
  },
  heading: {
    fontSize: 21,
    fontWeight: '700' as const,
    lineHeight: 21 * 1.2,
    color: Colors.onSurface,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 18 * 1.3,
    color: Colors.onSurface,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 16 * 1.5,
    color: Colors.onSurface,
  },
  muted: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 14 * 1.5,
    color: Colors.onSurfaceVariant,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 12 * 1.2,
    color: Colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  stat: {
    fontSize: 44,
    fontWeight: '800' as const,
    lineHeight: 44,
    color: Colors.primary,
  },
  smallStat: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 12,
    color: Colors.onSurfaceVariant,
  },
  button: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  input: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 16 * 1.5,
    color: Colors.onSurface,
  },
} as const;

// ── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  // Legacy aliases (used by template screens, remove in Phase 4)
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// ── Layout ──────────────────────────────────────────────────────────────────

export const Layout = {
  screenPaddingHorizontal: 24,
  screenPaddingTop: 40,
  screenPaddingBottom: 128,
  maxContentWidth: 800,
} as const;

// ── Border Radius ───────────────────────────────────────────────────────────

export const Radius = {
  default: 8,
  full: 9999,
} as const;

// ── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
  nav: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;

// ── Backward Compat (for template screens until Phase 4 replaces them) ──────

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'var(--font-display)', serif: 'var(--font-serif)', rounded: 'var(--font-rounded)', mono: 'var(--font-mono)' },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = Layout.maxContentWidth;

export type ThemeColor = keyof typeof Colors.light;
