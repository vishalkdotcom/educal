# EduCal - Claude Code Project Instructions

## What is this?

EduCal is a mobile financial planning app that helps families calculate and save for their children's education costs. It uses AI-powered school search (Gemini API with Google Maps + Search grounding) to provide localized cost estimates, then calculates a personalized monthly savings goal.

## Tech Stack

- **Framework:** Expo SDK 55, React Native
- **Routing:** Expo Router (file-based routing)
- **State Management:** Zustand
- **Styling:** NativeWind (Tailwind CSS for React Native) — if unavailable, use StyleSheet with design tokens
- **Language:** TypeScript (strict mode)
- **AI Integration:** Google Gemini API with Maps + Search grounding for school data
- **Icons:** @expo/vector-icons (MaterialIcons, MaterialCommunityIcons)
- **Charts:** react-native-svg + victory-native or expo-chart (for growth projections)

## Project Structure (Expo Router)

```
app/
  _layout.tsx                # Root layout (fonts, providers, Zustand)
  index.tsx                  # Entry — redirect to onboarding or tabs
  onboarding/
    _layout.tsx              # Stack navigator for wizard (no tab bar)
    step1.tsx                # Step 1: Family Profile
    step2.tsx                # Step 2: Financial Snapshot
    step3.tsx                # Step 3: Select Education Goal
    step4.tsx                # Step 4: Monthly Savings Goal
  (tabs)/
    _layout.tsx              # Bottom tab navigator
    horizon.tsx              # Horizon tab — savings overview dashboard
    insights.tsx             # Insights tab — Education Wealth Report
    funding.tsx              # Funding tab — school search & projections
    profile.tsx              # Profile tab — family & settings
  school/
    [id].tsx                 # Specific School Projection detail screen
src/
  components/
    ui/                      # Reusable UI primitives (Button, Card, Input, ProgressBar)
    onboarding/              # Step-specific components (ChildCard, SchoolTierCard, SavingsResult)
    dashboard/               # Dashboard widgets (GrowthChart, FundingBreakdown, MilestoneCard)
  stores/
    useOnboardingStore.ts    # Zustand store for wizard state
    useDashboardStore.ts     # Zustand store for dashboard/report data
  services/
    gemini.ts                # Gemini API client (Maps + Search grounding)
    calculator.ts            # Savings calculation engine
  types/
    index.ts                 # All TypeScript types
  constants/
    theme.ts                 # Design system tokens (colors, typography, spacing)
    schools.ts               # Fallback school tier data
  utils/
    format.ts                # Currency, percentage formatters
    validation.ts            # Form validation helpers
```

## Key Architectural Decisions

1. **Onboarding is a stack, not tabs.** The 4-step wizard lives under `app/onboarding/` with its own `_layout.tsx` that hides the tab bar. After Step 4, navigate to `(tabs)/horizon`.

2. **Zustand store persists onboarding data.** Use `zustand/middleware` with `AsyncStorage` so data survives app restarts during the sprint.

3. **Gemini calls go through a service layer.** Never call the API directly from components. `services/gemini.ts` handles all grounding requests and returns typed results.

4. **Calculation logic is pure functions.** `services/calculator.ts` has no side effects — takes inputs, returns savings goals. This makes it testable.

5. **TestIDs on every interactive element.** KA is using Maestro for E2E testing. Every touchable, input, and assertion target needs a `testID` prop. See docs/SCREENS.md for the complete testID map.

## Design System Quick Reference

- **Primary:** #2196F3 (Azure Blue)
- **Primary Container:** #E3F2FD
- **Surface:** #F8FAFC
- **On Surface:** #1E293B
- **On Surface Variant:** #64748B (muted text)
- **Border Radius:** 8px everywhere (the "Round Eight" system)
- **Font:** System default (Inter if available via expo-font)
- **Progress bar:** Azure blue on #E3F2FD track

## Read These Docs Before Building

- `docs/SPEC.md` — Full screen-by-screen specification with testIDs, data flow, and behavior
- `docs/DESIGN_SYSTEM.md` — Complete design tokens, component patterns, spacing
- `docs/API_INTEGRATION.md` — Gemini API setup, prompt templates, response parsing

## Build Order (Priority for April 10 deadline)

1. Project scaffold + navigation structure + Zustand stores
2. Step 1 (Family Profile) — form + add child flow
3. Step 2 (Financial Snapshot) — income, savings, location
4. Step 3 (Education Goal) — school tier cards with Gemini integration
5. Step 4 (Savings Goal) — calculation result + per-child breakdown
6. Horizon tab (dashboard overview)
7. Insights tab (Education Wealth Report) — if time permits
8. School detail screen — if time permits

## Testing Notes

- Add `testID` props matching the IDs in docs/SPEC.md
- KA will generate Maestro YAML flows from the source code using Claude + Maestro MCP
- Ensure all navigation transitions complete before asserting (no manual delays needed — Maestro handles waiting)
