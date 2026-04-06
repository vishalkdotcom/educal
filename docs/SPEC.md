# EduCal — Full Application Specification

## 1. Application Overview

EduCal is a 4-step onboarding wizard that collects family, financial, and education goal data, then produces a personalized monthly savings target. After onboarding, users access a dashboard with growth projections, funding analysis, and school-specific drill-downs.

---

## 2. Navigation Architecture

### Onboarding Flow (Stack Navigator — no tab bar visible)

```
app/onboarding/_layout.tsx → Stack
  ├── step1.tsx   (Family Profile)
  ├── step2.tsx   (Financial Snapshot)
  ├── step3.tsx   (Select Education Goal)
  └── step4.tsx   (Monthly Savings Goal)
```

Header: "EduCal" left-aligned in primary blue, "Step X of 4" right-aligned.
Back button on Steps 2-4. No back button on Step 1.
Bottom bar: Back (text, left) + Next (primary button, right). Step 1 has only Next.

### Main App (Bottom Tab Navigator)

```
app/(tabs)/_layout.tsx → Tabs
  ├── horizon.tsx     (icon: home)
  ├── insights.tsx    (icon: insights/analytics)
  ├── funding.tsx     (icon: school/account_balance)
  └── profile.tsx     (icon: person)
```

### Modal/Detail Screens

```
app/school/[id].tsx  → Specific School Projection (pushed from funding tab)
```

### Navigation Trigger

After Step 4, the "See Detailed Plan" or "Next" button navigates to `/(tabs)/horizon` and replaces the navigation stack (user cannot go back to onboarding via back gesture).

---

## 3. Screen Specifications

---

### STEP 1: Family Profile

**Route:** `app/onboarding/step1.tsx`
**Title:** "Build Your Family Profile" (alt from mockup: "Who are we planning for?")
**Subtitle:** "Tell us more about your children to personalize their education trajectory."
**Progress:** 25%

#### Layout (top to bottom)

1. **Header** — EduCal logo + "Step 1 of 4"
2. **Hero Image** — Family illustration/photo (bundled local asset, not remote URL)
3. **Progress Bar** — 25% filled, label "ONBOARDING PROGRESS" left, "25%" right
4. **Heading + Subtitle**
5. **Child Cards** — List of already-added children (empty on first visit)
   - Each card shows: avatar icon, name, age, target level, "ACTIVE" badge
6. **Add Child Form Card**
   - Child's Name (text input, placeholder "e.g. Sophia")
   - Current Age (number input, placeholder "5", min 0 max 17)
   - Target Level (dropdown: "University", "High School", "Primary")
   - "Save Child Details" button (only shown when adding 2nd+ child)
7. **"+ Add another child"** link button (appears after first child saved)
8. **"Why this matters" info card** — Light blue background, lightbulb icon, explains why age matters for inflation-adjusted costs
9. **Bottom Bar** — "NEXT →" button (disabled until at least 1 child added)

#### State & Behavior

- First visit: form is inline (no saved children). User fills name/age/level, taps Next.
- Adding the first child: data saved to store, card appears above, form clears for optional Child 2.
- "Add another child" shows a new blank form below existing child cards.
- Minimum 1 child required. Maximum: no hard limit (3 is practical for demo).
- Next navigates to Step 2.

#### Validation

- Name: required, min 1 character
- Age: required, integer 0-17
- Target Level: required (default to "University" pre-selected)

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `step1-screen` |
| Hero image | `step1-hero-image` |
| Progress bar | `step1-progress-bar` |
| Child name input | `child-name-input` |
| Child age input | `child-age-input` |
| Target level dropdown | `child-target-level` |
| Save child button | `save-child-button` |
| Add another child link | `add-another-child` |
| Child card (per child) | `child-card-{index}` |
| Why this matters card | `step1-info-card` |
| Next button | `step1-next-button` |

---

### STEP 2: Financial Snapshot

**Route:** `app/onboarding/step2.tsx`
**Title:** "Your Financial Snapshot"
**Subtitle:** "Help us personalize your education plan by providing a few financial details and your location for local cost accuracy."
**Progress:** 50%

#### Layout (top to bottom)

1. **Header** — EduCal + "STEP 2 OF 4" + back arrow
2. **Progress Bar** — 50%, label "SETUP PROGRESS"
3. **Heading + Subtitle**
4. **Monthly Household Income** — Currency input, prefix "$", placeholder "0.00", helper text "Combined after-tax income from all sources."
5. **Current Education Savings** — Currency input, prefix "$", placeholder "0.00"
6. **Local School Costs Card** — Rounded card containing:
   - Location pin icon + "Local School Costs" heading
   - "Find average tuition in your current area." subtext
   - "Use Current Location" button (primary, with crosshair icon)
   - Map placeholder/thumbnail (shows static map after location granted)
7. **Bottom Bar** — "< BACK" (text) + "NEXT →" (primary button)

#### State & Behavior

- Income and savings are stored as numbers (cents precision).
- "Use Current Location" triggers `expo-location` permission request.
  - On grant: stores lat/lng in Zustand, shows success state (green check or location name).
  - On deny: show inline message "Location helps us find local schools. You can enter manually in the next step."
- Location is optional — user can proceed without it (Step 3 will show national averages instead).
- Next navigates to Step 3.

#### Validation

- Income: required, must be > 0
- Savings: optional, defaults to 0
- Location: optional

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `step2-screen` |
| Progress bar | `step2-progress-bar` |
| Income input | `income-input` |
| Savings input | `savings-input` |
| Use location button | `use-location-button` |
| Location status | `location-status` |
| Map thumbnail | `location-map` |
| Back button | `step2-back-button` |
| Next button | `step2-next-button` |

---

### STEP 3: Select Education Goal

**Route:** `app/onboarding/step3.tsx`
**Title:** "Select Education Goal"
**Progress:** 75%

#### Layout (top to bottom)

1. **Header** — EduCal + "STEP 3 OF 4" + back arrow
2. **Progress Bar** — 75%
3. **Heading** + "75%" right-aligned
4. **Nearby Schools Banner** — Blue/dark card with map background: "Nearby Schools in {District Name}" + "We've identified {N} institutions matching your financial profile."
   - If no location: "Schools matching your profile" (generic)
5. **School Tier Cards** (scrollable list, 3 cards):

   **a) Public Schools (Local)**
   - Icon: institution/school icon in circle
   - School names from Gemini (e.g. "ST. ANDREWS HIGH", "NORTHSIDE COLLEGIATE") or fallback placeholders
   - Description: "High-quality government-funded education with community focus."
   - "EST. TOTAL COST" label + range in primary blue: "$12k — $45k"
   - Card style: white bg, subtle border, unselected state
   - Selected state: primary blue left border or blue outline

   **b) Private Academy**
   - Icon: graduation cap in circle
   - Description: "Specialized curricula and smaller class sizes for personalized growth."
   - Cost range: "$180k — $320k"

   **c) International School** (highlighted/featured card)
   - Icon: globe in circle
   - Blue background card (stands out from others)
   - Description: "Global IB standards with multi-language immersion and overseas networks."
   - Cost range: "$450k — $800k"

6. **Cost Projection Impact Card** — Appears after selection:
   - "Based on your current savings rate, a {selected tier} goal would require a {X}% increase in monthly contributions."
   - Growth Forecast: "+8.2%" with small bar chart
7. **Bottom Bar** — Back + Next

#### State & Behavior

- User taps a tier card to select it. Only one tier selected at a time (radio behavior).
- On selection: Cost Projection Impact card updates dynamically.
- School names within each tier come from Gemini grounded search (if location available) or fallback data.
- The Gemini call fires when this screen mounts (if location is available from Step 2). Show a loading skeleton while fetching.
- Cost ranges are either from Gemini search results or hardcoded fallbacks per tier.
- Next navigates to Step 4. Requires a tier selection.

#### Gemini Integration (this screen)

See `docs/API_INTEGRATION.md` for the full prompt template. Summary:
- Input: lat/lng + selected tier + child ages
- Output: school names, estimated annual tuition, school type
- Fallback: hardcoded tier ranges if Gemini fails or no location

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `step3-screen` |
| Progress bar | `step3-progress-bar` |
| Nearby schools banner | `nearby-schools-banner` |
| Public tier card | `tier-card-public` |
| Private tier card | `tier-card-private` |
| International tier card | `tier-card-international` |
| Cost projection card | `cost-projection-card` |
| Growth forecast value | `growth-forecast-value` |
| Loading skeleton | `step3-loading` |
| Back button | `step3-back-button` |
| Next button | `step3-next-button` |

---

### STEP 4: Monthly Savings Goal

**Route:** `app/onboarding/step4.tsx`
**Title:** "Your Monthly Savings Goal"
**Supertitle:** "EDUCATION WEALTH REPORT"
**Progress:** This screen does NOT show the standard progress bar — it's a results screen.

#### Layout (top to bottom)

1. **Header** — EduCal + back arrow + profile avatar icon (right)
2. **Supertitle** — "EDUCATION WEALTH REPORT" in muted uppercase
3. **Main Heading** — "Your Monthly Savings Goal" in primary blue, centered
4. **Hero Result Card** — Large card with gradient/elevated style:
   - "Target Reached by {year}" with trending-up icon
   - **$X,XXX/mo** — Large display number (48-60pt equivalent), primary color
   - Description: "This target ensures full coverage for tuition, boarding, and annual inflation adjustments for {all/both} children."
   - "See Detailed Plan →" button (primary)
5. **Progress Ring** — Circular progress indicator showing "100% PROJECTED" (or actual percentage)
6. **Per-Child Breakdown Cards** — One card per child:
   - Avatar + Name
   - "Age {X} • {Y} Years to Save"
   - "Monthly Share" + **${amount}** right-aligned
7. **Calculation Factors Section** — Icon + "Calculation Factors" heading:
   - Inflation Indexing: "Adjusted for a {X}% annual increase in education costs."
   - Selected Schools: "Based on {tier} averages & {specific school} trends."
   - Growth Assumptions: "Conservative {X}% annual ROI on investment vehicle."
8. **CTA Card** — Blue background:
   - "Ready to Start?"
   - "Lock in these rates by opening a tax-advantaged 529 plan today."
   - Two buttons: "Get Started" (outlined) + "Talk to Advisor" (filled)
9. **Bottom Bar** — Back + Next (Next goes to dashboard)

#### Calculation Logic

```typescript
function calculateMonthlySavings(children: Child[], financials: Financials, selectedTier: SchoolTier): SavingsResult {
  const results = children.map(child => {
    const yearsToEnrollment = child.targetAge - child.currentAge;
    const monthsToEnrollment = yearsToEnrollment * 12;
    const baseCost = selectedTier.midpointCost; // midpoint of tier range
    const inflationRate = 0.042; // 4.2% annual education inflation
    const projectedCost = baseCost * Math.pow(1 + inflationRate, yearsToEnrollment);
    const netCost = projectedCost - (financials.currentSavings / children.length);
    const monthlyAmount = Math.max(0, netCost / monthsToEnrollment);
    return { childName: child.name, monthlyShare: monthlyAmount, yearsToSave: yearsToEnrollment, projectedCost };
  });
  const totalMonthly = results.reduce((sum, r) => sum + r.monthlyShare, 0);
  const targetYear = new Date().getFullYear() + Math.max(...results.map(r => r.yearsToSave));
  return { totalMonthly, perChild: results, targetYear };
}
```

Target ages by level: Primary = 6, High School = 14, University = 18.

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `step4-screen` |
| Monthly goal amount | `savings-goal-amount` |
| Target year | `savings-target-year` |
| Progress ring | `savings-progress-ring` |
| See detailed plan button | `see-detailed-plan` |
| Child breakdown card | `child-breakdown-{index}` |
| Child monthly share | `child-share-{index}` |
| Calculation factors section | `calculation-factors` |
| Get started button | `cta-get-started` |
| Talk to advisor button | `cta-talk-advisor` |
| Back button | `step4-back-button` |
| Next button | `step4-next-button` |

---

### HORIZON TAB (Dashboard Home)

**Route:** `app/(tabs)/horizon.tsx`
**Purpose:** Post-onboarding landing screen. Shows the savings goal summary and quick actions.

#### Layout

This is a simplified version of Step 4's result that acts as a persistent dashboard. Shows:
1. Greeting: "Your Education Plan"
2. Monthly savings goal card (compact version of Step 4 hero)
3. Per-child progress bars (compact)
4. Quick action buttons: "Update Plan", "View Full Report"

Keep this screen lightweight — it's the tab landing page.

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `horizon-screen` |
| Monthly goal card | `horizon-goal-card` |
| Child progress bars | `horizon-child-{index}` |
| Update plan button | `horizon-update-plan` |
| View report button | `horizon-view-report` |

---

### INSIGHTS TAB (Education Wealth Report)

**Route:** `app/(tabs)/insights.tsx`
**Title:** "Education Wealth Report"
**Subtitle:** "Your horizon is clearing. Based on current contributions and projected growth, you are on track to fund {X}% of total estimated university costs for {children names}."

#### Layout (top to bottom, scrollable)

1. **Header** — EduCal logo (left) + notification bell (right)
2. **Title** — "Education Wealth Report" + "QUARTERLY ANALYSIS" label
3. **Narrative Subtitle** — Personalized progress summary
4. **Growth Projection Card** — Green/blue gradient card:
   - "Growth Projection" label + projected total: "$412,850" (large)
   - "PROJECTED TOTAL" badge
   - "Target: 2038" pill
   - Growth curve line chart (simplified — Today → milestones → Final)
   - Timeline labels: "TODAY $124k", "2028 $210k", "2033 $305k", "FINAL $412k"
5. **Tax Savings Advantage Card** — Blue gradient:
   - "Tax Savings Advantage"
   - "Estimated federal & state tax benefits by using your 529 plan versus a standard brokerage."
   - "$68,400 LIFETIME PROJECTED BENEFIT"
6. **Funding Sources Section** — 3 rows:
   - Personal Savings: $85,000
   - 529 Market Growth: $290,000
   - Potential Grants: $37,850
7. **Child-by-Child Progress** — One card per child:
   - Name + "CLASS OF {year}"
   - "EST. FUTURE COST (ADJUSTED)" + amount
   - Progress bar with percentage
8. **Strategic Milestones** — "View Roadmap" link:
   - Portfolio Rebalance milestone
   - Max Contribution milestone
   - Grant Lock-in milestone

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `insights-screen` |
| Growth projection card | `growth-projection-card` |
| Growth projection amount | `growth-projection-amount` |
| Growth chart | `growth-chart` |
| Tax savings card | `tax-savings-card` |
| Tax savings amount | `tax-savings-amount` |
| Funding source row | `funding-source-{index}` |
| Child goal card | `child-goal-{index}` |
| Child progress bar | `child-goal-progress-{index}` |
| Milestones section | `milestones-section` |

---

### FUNDING TAB (School Search)

**Route:** `app/(tabs)/funding.tsx`
**Purpose:** Browse and search for specific schools. Tapping a school navigates to the school detail screen.

#### Layout

1. Search bar: "Search for a school..."
2. Saved/selected schools from onboarding
3. Suggested schools based on location + tier
4. Each school card: name, type badge, annual tuition, "View Projection →"

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `funding-screen` |
| School search input | `school-search-input` |
| School card | `school-card-{index}` |

---

### SCHOOL DETAIL (Specific School Projection)

**Route:** `app/school/[id].tsx`
**Title:** "Specific School Projection"

#### Layout (top to bottom)

1. **Header** — Back arrow + "Specific School Projection" + "EduCal"
2. **School Info Card:**
   - School Name (e.g. "Stanford University") with icon
   - "Current Annual Tuition" + "$55,000" input/display
   - "National average inflation rate applied: 5.2%"
3. **Future Cost Forecast** — 3 time horizon cards:
   - In 5 Years: $70,865 (+28.8%)
   - In 10 Years: $91,304 (+66.0%) — highlighted with blue left border
   - In 15 Years: $117,641 (+113.9%)
4. **Projected Tuition Path Chart** — Bar chart (2024, 2029, 2034, 2039, 2044) with highlighted target year
5. **4-Year Degree Total Card** — Blue/dark card:
   - "4-Year Degree Total"
   - "Projected for Class of {year}"
   - Total: "$391,420"
   - Base Cost vs Inflation Impact breakdown
6. **"+ Add to Savings Plan"** CTA button (full width)
7. **Bottom Tab Bar** visible

#### Calculation

```typescript
function projectSchoolCost(annualTuition: number, inflationRate: number, yearsOut: number): number {
  return annualTuition * Math.pow(1 + inflationRate, yearsOut);
}

function fourYearTotal(annualTuition: number, inflationRate: number, enrollmentYear: number): number {
  const currentYear = new Date().getFullYear();
  const yearsOut = enrollmentYear - currentYear;
  return [0, 1, 2, 3].reduce((sum, i) => {
    return sum + annualTuition * Math.pow(1 + inflationRate, yearsOut + i);
  }, 0);
}
```

#### TestIDs

| Element | testID |
|---------|--------|
| Screen container | `school-detail-screen` |
| School name | `school-name` |
| Annual tuition | `school-annual-tuition` |
| Inflation rate | `school-inflation-rate` |
| Forecast card 5yr | `forecast-5yr` |
| Forecast card 10yr | `forecast-10yr` |
| Forecast card 15yr | `forecast-15yr` |
| Tuition path chart | `tuition-path-chart` |
| Degree total card | `degree-total-card` |
| Degree total amount | `degree-total-amount` |
| Add to plan button | `add-to-plan-button` |

---

## 4. Data Flow

```
Step 1 (children[]) 
  → Step 2 (income, savings, location?)
    → Step 3 (selectedTier, schoolNames[] via Gemini)
      → Step 4 (calculated savingsGoal)
        → Dashboard tabs (all data from store)
```

All data flows through a single Zustand store (`useOnboardingStore`). Dashboard screens read from the same store plus a computed `useDashboardStore` that derives projections and report data.

---

## 5. Zustand Store Shape

```typescript
// useOnboardingStore.ts
interface OnboardingState {
  // Step 1
  children: Child[];
  addChild: (child: Child) => void;
  removeChild: (index: number) => void;
  
  // Step 2
  monthlyIncome: number;
  setMonthlyIncome: (amount: number) => void;
  currentSavings: number;
  setCurrentSavings: (amount: number) => void;
  location: { lat: number; lng: number; name: string } | null;
  setLocation: (loc: { lat: number; lng: number; name: string }) => void;
  
  // Step 3
  selectedTier: 'public' | 'private' | 'international' | null;
  setSelectedTier: (tier: 'public' | 'private' | 'international') => void;
  schoolResults: SchoolResult[];
  setSchoolResults: (results: SchoolResult[]) => void;
  
  // Step 4 (computed/derived but cached)
  savingsResult: SavingsResult | null;
  setSavingsResult: (result: SavingsResult) => void;
  
  // Meta
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onboardingComplete: boolean;
  completeOnboarding: () => void;
  reset: () => void;
}
```

---

## 6. TypeScript Types

```typescript
interface Child {
  id: string;               // uuid
  name: string;
  currentAge: number;        // 0-17
  targetLevel: 'primary' | 'high_school' | 'university';
  targetAge: number;         // derived: primary=6, high_school=14, university=18
}

interface SchoolTier {
  id: 'public' | 'private' | 'international';
  label: string;
  description: string;
  costRange: { min: number; max: number };  // total projected cost
  midpointCost: number;
  icon: string;              // MaterialIcons name
  schools: SchoolResult[];   // populated by Gemini or fallback
}

interface SchoolResult {
  name: string;
  annualTuition: number;
  type: 'public' | 'private' | 'international';
  address?: string;
  rating?: number;
  source: 'gemini' | 'fallback';
}

interface SavingsResult {
  totalMonthly: number;
  targetYear: number;
  perChild: ChildSavingsBreakdown[];
  projectedTotal: number;
  currentFunded: number;     // percentage funded with current savings
}

interface ChildSavingsBreakdown {
  childId: string;
  childName: string;
  monthlyShare: number;
  yearsToSave: number;
  projectedCost: number;
  classOf: number;           // graduation year
}

interface GrowthProjection {
  year: number;
  amount: number;
}

interface WealthReport {
  growthProjection: {
    projectedTotal: number;
    targetYear: number;
    milestones: GrowthProjection[];
  };
  taxSavingsAdvantage: number;
  fundingSources: {
    personalSavings: number;
    marketGrowth: number;
    potentialGrants: number;
  };
  childGoals: {
    childId: string;
    childName: string;
    classOf: number;
    adjustedCost: number;
    progressPercent: number;
  }[];
  milestones: {
    title: string;
    description: string;
    status: 'completed' | 'upcoming' | 'pending';
  }[];
}
```

---

## 7. Error & Empty States

| Scenario | Behavior |
|----------|----------|
| No children added, tap Next | Next button disabled (greyed out) |
| Income = 0, tap Next | Show inline validation: "Please enter your household income" |
| Location denied | Show "Location helps us find local schools" message, allow proceeding |
| Gemini API fails | Fall back to hardcoded school tier data, show subtle "Using estimated data" badge |
| Gemini returns no schools | Show tier cards with generic names ("Local Public School", "Private Academy") |
| $0 savings goal calculated | Show "$0/mo — You're already on track!" with celebration state |
| Network offline | Cache last Gemini results; show "Offline — using cached data" toast |
