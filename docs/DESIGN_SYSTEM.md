# EduCal — Design System: "Azure Growth Ledger"

## Color Palette

### Primary

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#2196F3` | Headings, buttons, links, active states, progress bars |
| `primaryDark` | `#1976D2` | Text on primary containers, hover/pressed states |
| `primaryLight` | `#90CAF9` | Secondary accents, chart lines |
| `primaryContainer` | `#E3F2FD` | Info cards ("Why this matters"), selected backgrounds, progress bar track |

### Surface & Text

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#F8FAFC` | Screen background |
| `surfaceWhite` | `#FFFFFF` | Card backgrounds |
| `surfaceContainerHighest` | `#F1F5F9` | Input field backgrounds |
| `onSurface` | `#1E293B` | Primary text (headings, body) |
| `onSurfaceVariant` | `#64748B` | Secondary/muted text (labels, descriptions) |
| `outline` | `#CBD5E1` | Borders, dividers |
| `outlineLight` | `#E2E8F0` | Subtle borders, card borders |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#10B981` | Positive indicators, "on track" states, growth arrows |
| `warning` | `#F59E0B` | Attention states |
| `error` | `#EF4444` | Validation errors, required fields |
| `info` | `#3B82F6` | Informational badges |

### Chart Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `chartPrimary` | `#2196F3` | Primary chart bars/lines |
| `chartSecondary` | `#90CAF9` | Secondary chart elements |
| `chartAccent` | `#E3F2FD` | Chart backgrounds, unfilled areas |

### Special Cards

| Context | Background | Text Color |
|---------|-----------|------------|
| International School card | `#2196F3` | `#FFFFFF` |
| CTA "Ready to Start?" card | `#2196F3` | `#FFFFFF` |
| Growth Projection card | `#F8FAFC` with blue gradient top | `#1E293B` |
| Tax Savings card | `#EFF6FF` (blue-50 tint) | `#1E293B` |

---

## Typography

**Font Family:** System default. Load "Inter" via `expo-font` if available; fall back to system sans-serif.

| Element | Size | Weight | Color | Line Height |
|---------|------|--------|-------|-------------|
| Screen title | 32-36 | 800 (ExtraBold) | `primary` | 1.1 |
| Section heading | 20-22 | 700 (Bold) | `onSurface` | 1.2 |
| Card heading | 18 | 700 (Bold) | `onSurface` | 1.3 |
| Body text | 15-16 | 400 (Regular) | `onSurface` | 1.5 |
| Muted/description text | 14 | 400 (Regular) | `onSurfaceVariant` | 1.5 |
| Label (uppercase) | 11-12 | 600-700 (SemiBold/Bold) | `primary` | 1.2 |
| Large stat number | 40-48 | 800 (ExtraBold) | `onSurface` or `primary` | 1.0 |
| Small stat label | 10 | 600 (SemiBold) | `onSurfaceVariant` | 1.2 |
| Button text | 13-14 | 600-700 | `#FFFFFF` (on primary) | 1.0 |
| Input text | 16 | 400 | `onSurface` | 1.5 |
| Input placeholder | 16 | 400 | `onSurfaceVariant` | 1.5 |

### Label Convention

Field labels are UPPERCASE, tracking-wide (letter spacing ~1.5), semibold, primary color.
Example: "CHILD'S NAME", "CURRENT AGE", "MONTHLY HOUSEHOLD INCOME"

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps (icon-to-text inline) |
| `sm` | 8px | Internal padding tweaks |
| `md` | 16px | Standard gap between elements |
| `lg` | 24px | Section gaps, card internal padding |
| `xl` | 32px | Major section dividers |
| `2xl` | 48px | Screen top/bottom padding |

### Screen Padding

- Horizontal: 24px (px-6)
- Top: 40px from header
- Bottom: 128px (to clear fixed bottom bar)

---

## Border Radius

**Everything uses 8px.** This is the "Round Eight" system.

| Element | Radius |
|---------|--------|
| Cards | 8px |
| Buttons | 8px |
| Input fields | 8px |
| Progress bar (track + fill) | 9999px (full round) |
| Avatars / icon circles | 9999px (full round) |
| Bottom sheet / bottom bar | 8px (top corners only) |

---

## Elevation & Shadows

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Flat (inputs, info cards) | none |
| 1 | Cards | `0 1px 3px rgba(0,0,0,0.06)` |
| 2 | Hero result card, CTAs | `0 4px 12px rgba(0,0,0,0.08)` |
| 3 | Bottom nav bar | `0 -4px 24px rgba(0,0,0,0.05)` (upward shadow) |

React Native equivalent:
```typescript
const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
};
```

---

## Component Patterns

### Primary Button

```
Background: primary (#2196F3)
Text: white, 13-14px, semibold, uppercase, tracking-wide
Padding: 16px vertical, 48px horizontal
Radius: 8px
Shadow: sm
Active state: opacity 0.9 + scale(0.98)
Disabled: opacity 0.5
```

### Outlined Button

```
Background: transparent
Border: 2px solid primary
Text: primary, 13-14px, semibold
Same dimensions as primary button
```

### Input Field

```
Background: surfaceContainerHighest (#F1F5F9)
Border: none (borderless style)
Radius: 8px
Padding: 16px vertical, 20px horizontal
Text: 16px, onSurface
Placeholder: onSurfaceVariant
Focus state: 2px ring in primary with 20% opacity
```

### Card

```
Background: white
Border: 1px solid outlineLight (#E2E8F0) — OR no border with shadow
Radius: 8px
Padding: 24-32px
```

### Progress Bar

```
Track: primaryContainer (#E3F2FD), full round, height 8px
Fill: primary (#2196F3), full round, animated width
```

### School Tier Card (unselected)

```
Background: white
Border: 1px solid outlineLight
Radius: 8px
Padding: 24px
Icon: 48x48 circle with primaryContainer bg, primary icon
```

### School Tier Card (selected)

```
Background: white
Border: 2px solid primary
Radius: 8px
Left accent bar: 4px wide, primary color (optional)
```

### Bottom Navigation Bar

```
Background: white with 90% opacity + backdrop blur
Border top: 1px solid outlineLight
Shadow: upward (level 3)
Radius: 8px top corners
Padding: 16px top, 32px bottom (safe area)
Active tab: primary color icon + label
Inactive tab: onSurfaceVariant icon + label
```

---

## Icon System

Use `@expo/vector-icons` — MaterialIcons and MaterialCommunityIcons.

| Context | Icon Name | Library |
|---------|-----------|---------|
| Child/baby | `child-care` | MaterialIcons |
| School/institution | `account-balance` | MaterialIcons |
| Private/graduation | `school` | MaterialIcons |
| International/globe | `public` | MaterialIcons |
| Location | `location-on` | MaterialIcons |
| Add | `add-circle` | MaterialIcons |
| Lightbulb (info) | `lightbulb` | MaterialIcons |
| Trending up | `trending-up` | MaterialIcons |
| Back arrow | `arrow-back` | MaterialIcons |
| Forward arrow | `arrow-forward` | MaterialIcons |
| Calculator | `calculate` | MaterialIcons |
| Savings/piggybank | `savings` | MaterialIcons |
| Notification bell | `notifications` | MaterialIcons |
| Person/profile | `person` | MaterialIcons |
| Crosshair/location | `my-location` | MaterialIcons |
| Home (tab) | `home` | MaterialIcons |
| Insights (tab) | `insights` | MaterialIcons |
| Funding (tab) | `account-balance-wallet` | MaterialIcons |

Icons in circles: 48x48 circle background (primaryContainer), icon 24px (primary color).

---

## Animation Notes

Keep animations subtle and fast — this is a financial app, not a game.

- Screen transitions: default Expo Router stack animations (slide from right)
- Progress bar: animate width with 300ms ease-out on mount
- Number reveals (Step 4 savings goal): count-up animation from 0 to target over 800ms
- Card selection: border color transition 200ms
- Button press: scale(0.98) + opacity(0.9) for 100ms
