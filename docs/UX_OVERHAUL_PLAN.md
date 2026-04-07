# EduCal UX Overhaul — Phased Implementation Plan

## Context

The current EduCal app works but has significant UX problems:
- **4-step onboarding feels like a form interrogation**, not a guided experience
- **Gemini AI school search is hidden** behind a toggle — most users never discover it
- **Country is selected via manual dropdown** when it should be auto-detected from location
- **Copy is jargon-heavy**: "Education Wealth Report", "Horizon", "Funding", "Confirm Plan"
- **Step 4 (savings goal)** dumps a number without explaining what it means or why
- **Child editing is clunky** — no inline edit, must delete and re-add
- **Tab names don't match their purpose**: "Funding" is school search, "Insights" is progress tracking
- **Income is collected in Step 2** before the user has context for why it matters

### Goal
Restructure onboarding from 4 steps to 3, make Gemini primary, auto-detect country, fix all copy, rename tabs, and improve child management — in 5 phases that each leave the app working.

---

## File Strategy: 4 Steps → 3 Steps

Since Expo Router uses filename-based routing, we keep `step1.tsx`, `step2.tsx`, `step3.tsx` as filenames (routes stay `/onboarding/step1`, etc.) and **rewrite their content**. `step4.tsx` gets deleted.

| File | Current Content | New Content |
|------|----------------|-------------|
| `step1.tsx` | Add children | Add children (improved inline editing) |
| `step2.tsx` | Income + Location + Country | Location → Gemini search → Pick school/cost |
| `step3.tsx` | Education cost + research toggle | Savings plan + income collection + what-if |
| `step4.tsx` | Savings goal + confirm | **DELETED** |

---

## Phase 1: Foundation — Store, Types, Tab Renames, Copy Fix
**Session time: ~2 hours | Leaves app fully working as 4 steps with updated labels**

### 1.1 Update Zustand store
**File: `src/stores/useOnboardingStore.ts`**
- Add `selectedSchool: SchoolResult | null` field + `setSelectedSchool` action
- Add `locationSource: 'gps' | 'city' | null` field (tracks how location was obtained)
- Update `setLocation` to accept optional `countryCode` param (auto-sets country when location detected)
- New fields default to `null` — safe for existing persisted state (Zustand ignores unknown keys gracefully)
- Change `completeOnboarding` from `currentStep: 5` to `currentStep: 4` (3 steps + complete)

### 1.2 Add location utility
**New file: `src/utils/location.ts`**
- `detectCountryFromCoordinates(lat, lng)` — calls `Location.reverseGeocodeAsync`, extracts `isoCountryCode`, maps to supported `CountryCode`
- `mapIsoToCountryCode(iso: string): CountryCode` — maps ISO codes to {US, IN, ID}, defaults to 'US' for unsupported
- `geocodeCityToLocation(city: string)` — extracts the geocoding logic currently duplicated in step2.tsx into a reusable function

### 1.3 Rename tabs
**File: `src/app/(tabs)/_layout.tsx`**
| Current | New | Icon (unchanged) |
|---------|-----|-------------------|
| Horizon | Home | home |
| Insights | Progress | insights |
| Funding | Schools | account-balance-wallet |
| Profile | Profile | person |

### 1.4 Fix copy across all screens (cosmetic only, no structural changes)
| File | Current Copy | New Copy |
|------|-------------|----------|
| `step1.tsx` | "Build Your Family Profile" | "Who are you saving for?" |
| `step1.tsx` | subtitle about "education trajectory" | "Tell us about your children so we can personalize their savings plan." |
| `step2.tsx` | "Your Financial Snapshot" | "Your Location & Costs" (temporary — rewritten in Phase 2) |
| `step4.tsx` | "EDUCATION WEALTH REPORT" | Remove supertitle |
| `step4.tsx` | "CONFIRM PLAN" button | "Start Tracking" |
| `insights.tsx` | "QUARTERLY ANALYSIS" | "YOUR PROGRESS" |
| `insights.tsx` | "Education Wealth Report" | "Your Progress" |
| `insights.tsx` | "Strategic Milestones" | "Your Milestones" |
| `horizon.tsx` | "View Report" button | "View Progress" |
| `funding.tsx` | "School Search" title | "Schools" |

### 1.5 Update Maestro tests for tab renames
**Files:**
- `.maestro/navigation/tab-switching.yaml` — update label assertions
- `.maestro/dashboard/horizon-tab.yaml` — update if references tab name
- `.maestro/dashboard/funding-tab.yaml` — update references
- `.maestro/dashboard/insights-tab.yaml` — update references

### Deliverables
- Store ready for new fields
- Location utility extracted
- All tab labels and copy updated
- App still works as 4-step onboarding
- Maestro tests pass with new tab names

---

## Phase 2: New Step 2 — "Where will they study?"
**Session time: ~3 hours | Biggest structural change**

### 2.1 Rewrite `src/app/onboarding/step2.tsx`

**New screen flow:**
```
Title: "Where will they study?"
Subtitle: "We'll find schools and costs near you."

┌─ Location Section ──────────────────────────┐
│ [Use my location]  or  [City: ____________] │
│                                             │
│ ✓ Mumbai, Maharashtra (auto: India 🇮🇳)     │
│   [Change]                                  │
└─────────────────────────────────────────────┘

── Finding schools near Mumbai... ── (auto-triggered)

┌─ Public Schools ────────────────────────────┐
│ ○ Delhi Public School         ₹1,20,000/yr  │
│ ○ Kendriya Vidyalaya           ₹45,000/yr  │
└─────────────────────────────────────────────┘
┌─ Private Schools ───────────────────────────┐
│ ● DPS International          ₹3,50,000/yr  │ ← selected
└─────────────────────────────────────────────┘

─── or enter your own ───
[Annual cost: ₹_______]

[← Back]                            [Next →]
```

**Key behaviors:**
- Location set → auto-detect country from coordinates (using `src/utils/location.ts`)
- Country detected → auto-set `countryCode` in store (no dropdown)
- Immediately trigger `searchAllSchoolTiers()` via Gemini (no toggle — this is primary)
- Results grouped by tier with radio-style selection
- User taps school → highlights it, auto-fills cost
- OR user types custom cost at bottom
- **If Gemini fails/returns empty:** show "We couldn't find schools near you" + manual cost input + optional static tier hints from `COUNTRY_CONFIGS` as reference
- **If location fails entirely:** city input as fallback (same as current)
- **If detected country unsupported:** show small inline country picker (rare edge case)
- Next enabled when: `customAnnualCost > 0` OR `selectedSchool !== null`

**What's removed from this screen vs old step2:**
- Country dropdown (auto-detected)
- Monthly income input (moves to step3)
- Current savings input (moves to step3)

### 2.2 Add Gemini helper
**File: `src/services/gemini.ts`**
- Add `searchAllSchoolTiers(lat, lng, countryCode, childAges, targetLevels)` — calls `searchSchoolsWithGemini` for all 3 tiers in parallel via `Promise.allSettled`, returns `{ public: SchoolResult[], private: SchoolResult[], international: SchoolResult[] }`
- Consolidates the `Promise.all` pattern currently duplicated in `step3.tsx` and `funding.tsx`

### 2.3 Update onboarding layout
**File: `src/app/onboarding/_layout.tsx`**
- Remove `<Stack.Screen name="step4" />`
- Change `OnboardingHeader` from `"STEP {step} OF 4"` to `"STEP {step} OF 3"`

### 2.4 Progress bar update
- Step 1: 33%, Step 2: 66%, Step 3: 100% (was 25/50/75/100)

### Deliverables
- New step2 works: location → country auto-detect → Gemini search → pick school
- No country dropdown in onboarding
- Gemini is now the primary school discovery path
- Old step3 and step4 still exist temporarily (step3 navigates to step4 which still works)
- Navigation: step2 "Next" → step3 (old content, still functional)

---

## Phase 3: New Step 3 — "Your Savings Plan"
**Session time: ~2.5 hours | Replaces old step4, absorbs income from old step2**

### 3.1 Rewrite `src/app/onboarding/step3.tsx`

**New screen flow:**
```
Title: "Your Savings Plan"

"To fund Aarav's education by 2038, you'll need
approximately ₹24,00,000 total."

┌─────────────────────────────────────────────┐
│         ₹12,500 / month                     │
│     covers 100% of projected costs          │
└─────────────────────────────────────────────┘

── How much can you contribute? ──

MONTHLY HOUSEHOLD INCOME
[₹ ____________]
"That's about 8% of your income"  ← contextual, shows after input

CURRENT EDUCATION SAVINGS
[₹ ____________]
"Great — that covers the first 2 years!" ← contextual

── Adjust to your reality ──

[−]  ₹10,000 /month  [+]
┌─────────────────────────────────────────────┐
│ At ₹10,000/mo → 80% funded by 2038         │
│ ████████████████░░░░  80%                   │
│ Shortfall: ₹4,80,000                        │
└─────────────────────────────────────────────┘
Color: green (≥100%) | amber (50-99%) | red (<50%)

Per-child breakdown cards...

Calculation factors (inflation, cost basis)...

[← Back]                    [Start Tracking →]
```

**Key behaviors:**
- On mount: calculate baseline from `customAnnualCost` (from step2) with income=0, savings=0
- As user enters income → recalculate, show "X% of income" context
- As user enters savings → recalculate, show "covers first N years" context
- What-if stepper adjusts monthly amount, real-time recalc
- Color-coded funding status (green/amber/red)
- "Start Tracking" → `completeOnboarding()` → navigate to `/(tabs)/horizon`
- Reuses `calculateFromAnnualCost`, `calculateWhatIf` from `src/services/calculator.ts`

### 3.2 Delete `src/app/onboarding/step4.tsx`

### 3.3 Update `src/components/onboarding/SavingsResult.tsx`
- Add narrative text format ("To fund X's education by Y...")
- Add income-as-percentage display
- Add color coding for funding status badge

### 3.4 Update navigation references
- `completeOnboarding()` in store: change `currentStep: 5` → `currentStep: 4`
- Verify `app/index.tsx` redirect still works (it checks `onboardingComplete`, not step number — should be fine)

### Deliverables
- Full 3-step onboarding works end to end
- Income/savings collected in step3 with contextual feedback
- Plan screen explains the numbers clearly
- step4.tsx deleted
- Test: add child → pick location/school → see plan → start tracking → Home tab

---

## Phase 4: Improved Child Add/Edit
**Session time: ~2 hours | Independent of Phases 2-3 but best done after**

### 4.1 Rewrite `src/components/onboarding/ChildCard.tsx`
- **Two modes:** viewing (default) and editing
- **Viewing mode:** name, age, target level displayed + pencil icon + X delete button
- **Editing mode:** inline inputs for name, age, target level + Save/Cancel buttons
- Tap card or pencil → enters edit mode
- X button → `Alert.alert` confirmation → remove child
- Uses existing `updateChild(id, updates)` store action

### 4.2 Rewrite `src/app/onboarding/step1.tsx`
- Title: "Who are you saving for?" (done in Phase 1)
- Remove the separate form Card and `showForm` toggle logic
- **"+ Add Child" button always visible** at bottom of list
- Tapping "+ Add Child" creates a new empty ChildCard in editing mode
- Children list: each child is an inline-editable `ChildCard`
- Validation on "Next": all children must be in viewing mode (saved), at least 1 child
- Single save mechanism: each card saves itself, "Next" just navigates

### Deliverables
- Children are inline-editable cards
- Add/remove is intuitive
- No more form toggle confusion
- testIDs preserved

---

## Phase 5: Tab Screens Polish + Maestro Tests
**Session time: ~2 hours | Final polish pass**

### 5.1 Update `src/app/(tabs)/insights.tsx` (Progress tab)
- Title: "Your Progress" (done in Phase 1)
- Improve narrative text (less jargon)
- "Potential Scholarships" → label as "Estimated grants (5%)" with note that this is a rough estimate
- Ensure `countryCode` works with auto-detected value

### 5.2 Update `src/app/(tabs)/funding.tsx` (Schools tab)
- Title: "Schools" (done in Phase 1)
- Use `searchAllSchoolTiers()` from Phase 2 instead of inline Promise.all
- Update subtitle: "Schools near [location]" or "Search for schools"
- "View Projection" → "See details"

### 5.3 Update `src/app/(tabs)/profile.tsx`
- Remove inline country picker pills
- Show "Location: Mumbai, India" (detected) with "Change" option
- Keep country change as escape hatch via Alert with options
- "Total Saved" vs "Current Savings" — clarify labels

### 5.4 Update `src/app/(tabs)/horizon.tsx` (Home tab)
- Add empty state for savings: "No savings logged yet — start tracking!" when `savingsLog` is empty
- "View Progress" button text (done in Phase 1)

### 5.5 Rewrite Maestro tests
| Test File | Action |
|-----------|--------|
| `.maestro/onboarding/step2-financial-snapshot.yaml` | Rewrite for new step2 (location + school) |
| `.maestro/onboarding/step3-select-tier.yaml` | Rewrite for new step3 (plan + income) |
| `.maestro/onboarding/step4-savings-result.yaml` | **Delete** |
| `.maestro/onboarding/full-onboarding-flow.yaml` | Rewrite for 3-step flow |
| `.maestro/full-e2e-flow.yaml` | Update step references |
| `.maestro/edge-cases/step2-income-required.yaml` | Move to step3 context |
| `.maestro/edge-cases/step3-tier-required.yaml` | Update for new step2 school selection |
| `.maestro/edge-cases/different-tiers.yaml` | Update for new step2 |
| `.maestro/navigation/tab-switching.yaml` | Verify tab names (done in Phase 1) |

### Deliverables
- All tab screens polished with new copy
- Empty states added where missing
- Profile handles auto-detected country
- All Maestro tests updated for 3-step flow
- Full app testable end to end

---

## Phase Dependency Chart
```
Phase 1 (Foundation)
   ↓
Phase 2 (New Step 2) ← depends on store changes + location utility
   ↓
Phase 3 (New Step 3) ← depends on step2 existing for navigation
   ↓
Phase 4 (Child Cards) ← independent, but best after flow is stable
   ↓
Phase 5 (Polish + Tests) ← depends on all prior phases
```

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Persisted store gains new fields | New fields default to `null` — Zustand handles gracefully; existing users unaffected |
| GPS permission denied on step2 | City input fallback already exists; reuse `locationDenied` state pattern |
| Gemini API fails or returns empty | Show clear message + manual cost input + static tier hints as reference |
| Detected country not in {US, IN, ID} | `mapIsoToCountryCode` defaults to US; show small inline picker as override |
| testID changes break Maestro | Phase 5 dedicated to test updates; keep `step2-screen`/`step3-screen` IDs since filenames unchanged |

## Verification (after all phases)

1. **Fresh install flow:** step1 (add child) → step2 (location → Gemini search → pick school) → step3 (see plan, enter income, adjust, start tracking) → Home tab
2. **Gemini failure flow:** step2 location works → Gemini returns nothing → user sees fallback message → enters custom cost → proceeds
3. **Location denied flow:** step2 GPS denied → city input → Gemini search → normal flow
4. **Edit child flow:** Home → Update Plan → step1 → tap child card → edit inline → save → next
5. **Tab navigation:** Home / Schools / Progress / Profile — correct names, icons, content
6. **Maestro:** Run `bun maestro test .maestro/` on Pixel_6a emulator
