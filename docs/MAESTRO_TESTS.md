# EduCal — Maestro Test Flows for QA

Reference test flows for KA to use with Maestro + Claude MCP.

## Setup

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify
maestro --version

# Run a flow
maestro test flows/onboarding-happy-path.yaml
```

## Flow Files Structure

```
e2e/
  flows/
    onboarding-happy-path.yaml
    onboarding-two-children.yaml
    step1-validation.yaml
    step2-location.yaml
    step3-tier-selection.yaml
    step4-result.yaml
    navigation-tabs.yaml
```

---

## Happy Path: Full Onboarding

```yaml
# flows/onboarding-happy-path.yaml
appId: com.educal.app
---
- launchApp

# Step 1: Add a child
- assertVisible: "Build Your Family Profile"
- tapOn:
    id: "child-name-input"
- inputText: "Leo"
- tapOn:
    id: "child-age-input"
- inputText: "4"
- tapOn:
    id: "child-target-level"
- tapOn: "University"
- tapOn:
    id: "step1-next-button"

# Step 2: Financial Snapshot
- assertVisible: "Your Financial Snapshot"
- tapOn:
    id: "income-input"
- inputText: "8500"
- tapOn:
    id: "savings-input"
- inputText: "15000"
- tapOn:
    id: "step2-next-button"

# Step 3: Select Education Goal
- assertVisible: "Select Education Goal"
- tapOn:
    id: "tier-card-private"
- assertVisible:
    id: "cost-projection-card"
- tapOn:
    id: "step3-next-button"

# Step 4: Savings Goal
- assertVisible: "Your Monthly Savings Goal"
- assertVisible:
    id: "savings-goal-amount"
- assertVisible:
    id: "savings-target-year"

# Navigate to dashboard
- tapOn:
    id: "step4-next-button"
- assertVisible:
    id: "horizon-screen"
```

---

## Step 1: Add Two Children

```yaml
# flows/onboarding-two-children.yaml
appId: com.educal.app
---
- launchApp

# Add first child
- tapOn:
    id: "child-name-input"
- inputText: "Leo"
- tapOn:
    id: "child-age-input"
- inputText: "4"
- tapOn:
    id: "child-target-level"
- tapOn: "Primary"

# Save and add another
- tapOn:
    id: "add-another-child"

# Verify first child card appears
- assertVisible:
    id: "child-card-0"
- assertVisible: "Leo"

# Add second child
- tapOn:
    id: "child-name-input"
- inputText: "Maya"
- tapOn:
    id: "child-age-input"
- inputText: "7"
- tapOn:
    id: "child-target-level"
- tapOn: "University"
- tapOn:
    id: "save-child-button"

# Verify both children visible
- assertVisible:
    id: "child-card-0"
- assertVisible:
    id: "child-card-1"

- tapOn:
    id: "step1-next-button"
- assertVisible: "Your Financial Snapshot"
```

---

## Step 1: Validation — Empty Name

```yaml
# flows/step1-validation.yaml
appId: com.educal.app
---
- launchApp
- assertVisible: "Build Your Family Profile"

# Try to proceed without entering data
# Next button should be disabled
- assertVisible:
    id: "step1-next-button"
# Tap next — should not navigate
- tapOn:
    id: "step1-next-button"
- assertVisible: "Build Your Family Profile"
```

---

## Step 3: Tier Selection

```yaml
# flows/step3-tier-selection.yaml
appId: com.educal.app
---
# Assumes we're already on Step 3 (use runFlow to chain from earlier steps)
- assertVisible: "Select Education Goal"

# Select Public
- tapOn:
    id: "tier-card-public"
- assertVisible:
    id: "cost-projection-card"

# Switch to International
- tapOn:
    id: "tier-card-international"
- assertVisible:
    id: "cost-projection-card"

# Proceed
- tapOn:
    id: "step3-next-button"
- assertVisible: "Your Monthly Savings Goal"
```

---

## Tab Navigation

```yaml
# flows/navigation-tabs.yaml
appId: com.educal.app
---
# Assumes onboarding is complete and user is on Horizon tab
- assertVisible:
    id: "horizon-screen"

# Navigate to Insights
- tapOn: "Insights"
- assertVisible:
    id: "insights-screen"

# Navigate to Funding
- tapOn: "Funding"
- assertVisible:
    id: "funding-screen"

# Navigate to Profile
- tapOn: "Profile"

# Navigate back to Horizon
- tapOn: "Horizon"
- assertVisible:
    id: "horizon-screen"
```

---

## Tips for KA

1. **Use `runFlow` to compose**: Chain common setup flows instead of repeating steps.
   ```yaml
   - runFlow: flows/onboarding-happy-path.yaml
   - tapOn: "Insights"
   ```

2. **Screenshots on assertion failure**: Maestro captures screenshots automatically on failure.

3. **Use Claude + MCP to generate flows**: Open the codebase in Claude Code with Maestro MCP. Ask: "Look at step2.tsx and generate a Maestro flow testing all input fields and the location button."

4. **Run all flows**: `maestro test flows/` runs everything in the directory.

5. **Record for demo**: `maestro record flows/onboarding-happy-path.yaml` creates a video recording — great for the hackathon presentation.
