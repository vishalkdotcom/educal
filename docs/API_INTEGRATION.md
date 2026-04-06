# EduCal — API Integration: Gemini with Google Grounding

## Overview

EduCal uses Google's Gemini API with two grounding tools:
1. **Google Maps Grounding** — finds nearby schools based on user location
2. **Google Search Grounding** — retrieves current tuition pricing and school details

These are combined in a single API call to Step 3 (Select Education Goal) and the Funding tab (school search).

---

## Setup

### Dependencies

```bash
npx expo install expo-location
npm install @google/genai
# OR use REST API directly — simpler for hackathon
```

### Environment Variables

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

Store in `.env` and access via `process.env.EXPO_PUBLIC_GEMINI_API_KEY`. For production, move to a backend proxy — but for the hackathon, client-side is fine.

### Model Selection

Use `gemini-2.5-flash` for speed + cost efficiency during the hackathon. It supports both Maps and Search grounding.

---

## Service Layer: `src/services/gemini.ts`

```typescript
import { SchoolResult } from '../types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GeminiSchoolSearchParams {
  latitude: number;
  longitude: number;
  tier: 'public' | 'private' | 'international';
  childAges: number[];
  targetLevels: string[];
}

export async function searchSchoolsWithGemini(
  params: GeminiSchoolSearchParams
): Promise<SchoolResult[]> {
  const { latitude, longitude, tier, childAges, targetLevels } = params;

  const tierDescriptions = {
    public: 'public government-funded schools',
    private: 'private academy or independent schools',
    international: 'international schools with IB or international curriculum',
  };

  const prompt = `Find ${tierDescriptions[tier]} near coordinates ${latitude}, ${longitude} suitable for children aged ${childAges.join(' and ')}. For each school, provide: school name, estimated annual tuition in USD, school type, and a brief description. Return ONLY a JSON array with no additional text, markdown, or explanation. Each object in the array should have: "name" (string), "annualTuition" (number), "type" (string: public/private/international), "description" (string). Return maximum 5 schools.`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [
          { google_search: {} },
          {
            google_maps: {
              enable_widget: false,
            },
          },
        ],
        tool_config: {
          retrieval_config: {
            lat_lng: { latitude, longitude },
          },
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();

    // Extract text content from response
    const textContent = data.candidates?.[0]?.content?.parts
      ?.filter((p: any) => p.text)
      ?.map((p: any) => p.text)
      ?.join('') || '';

    // Parse JSON from response (strip markdown fences if present)
    const cleanJson = textContent.replace(/```json\n?|```\n?/g, '').trim();
    const schools: any[] = JSON.parse(cleanJson);

    return schools.map((s) => ({
      name: s.name || 'Unknown School',
      annualTuition: typeof s.annualTuition === 'number' ? s.annualTuition : 0,
      type: s.type || tier,
      address: s.address,
      rating: s.rating,
      source: 'gemini' as const,
    }));
  } catch (error) {
    console.warn('Gemini search failed, using fallback data:', error);
    return getFallbackSchools(tier);
  }
}

// Search for a specific school's tuition (used in School Detail screen)
export async function searchSchoolTuition(schoolName: string): Promise<{
  annualTuition: number;
  inflationRate: number;
} | null> {
  const prompt = `What is the current annual tuition for ${schoolName}? Also provide the average annual education inflation rate for this type of institution. Return ONLY a JSON object with: "annualTuition" (number in USD), "inflationRate" (number as decimal, e.g. 0.052 for 5.2%). No additional text.`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
      }),
    });

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts
      ?.filter((p: any) => p.text)
      ?.map((p: any) => p.text)
      ?.join('') || '';

    const cleanJson = textContent.replace(/```json\n?|```\n?/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn('Gemini tuition search failed:', error);
    return null;
  }
}
```

---

## Fallback Data

When Gemini is unavailable, rate-limited, or returns bad data, use these hardcoded fallbacks. This also serves as the data source when no location is provided.

```typescript
// src/constants/schools.ts

import { SchoolTier } from '../types';

export const SCHOOL_TIERS: SchoolTier[] = [
  {
    id: 'public',
    label: 'Public Schools (Local)',
    description: 'High-quality government-funded education with community focus.',
    costRange: { min: 12000, max: 45000 },
    midpointCost: 28500,
    icon: 'account-balance',
    schools: [
      { name: 'Local Public School', annualTuition: 2500, type: 'public', source: 'fallback' },
      { name: 'District High School', annualTuition: 3000, type: 'public', source: 'fallback' },
    ],
  },
  {
    id: 'private',
    label: 'Private Academy',
    description: 'Specialized curricula and smaller class sizes for personalized growth.',
    costRange: { min: 180000, max: 320000 },
    midpointCost: 250000,
    icon: 'school',
    schools: [
      { name: 'Private Day School', annualTuition: 18000, type: 'private', source: 'fallback' },
      { name: 'College Prep Academy', annualTuition: 25000, type: 'private', source: 'fallback' },
    ],
  },
  {
    id: 'international',
    label: 'International School',
    description: 'Global IB standards with multi-language immersion and overseas networks.',
    costRange: { min: 450000, max: 800000 },
    midpointCost: 625000,
    icon: 'public',
    schools: [
      { name: 'International Academy', annualTuition: 45000, type: 'international', source: 'fallback' },
      { name: 'Global IB School', annualTuition: 55000, type: 'international', source: 'fallback' },
    ],
  },
];

export const DEFAULT_INFLATION_RATE = 0.042; // 4.2% annual
export const DEFAULT_GROWTH_RATE = 0.07;     // 7% annual ROI assumption
export const TAX_ADVANTAGE_RATE = 0.165;     // ~16.5% estimated 529 tax benefit
```

---

## When to Call Gemini

| Trigger | API Call | Fallback |
|---------|----------|----------|
| Step 3 screen mounts (location available) | `searchSchoolsWithGemini()` for all 3 tiers | Use `SCHOOL_TIERS` constants |
| Step 3 screen mounts (no location) | Skip Gemini | Use `SCHOOL_TIERS` constants |
| School Detail screen opens | `searchSchoolTuition(schoolName)` | Use tuition from store |
| Funding tab search | `searchSchoolsWithGemini()` with search query | Show "No results" |

---

## Loading & Error UX

### Loading State (Step 3)

While Gemini is fetching:
- Show skeleton cards (3 shimmer placeholders matching tier card dimensions)
- Display: "Finding schools in your area..." text with location pin animation
- Tier cards render with cost ranges immediately (from constants), school names populate when Gemini responds

### Error State

- On Gemini failure: silently fall back to constants
- Show subtle badge on tier cards: "Estimated data" in muted text
- Log error for debugging but don't block the user

### Rate Limiting

- Gemini free tier: 15 RPM, 1M tokens/day — plenty for a hackathon demo
- Cache results in Zustand store so navigating back to Step 3 doesn't re-fetch
- Cache key: `${lat}_${lng}_${tier}`

---

## Response Parsing Safety

Gemini can return malformed JSON. Always wrap parsing in try/catch:

```typescript
function safeParseSchools(raw: string): SchoolResult[] {
  try {
    // Strip markdown code fences
    const clean = raw.replace(/```json\n?|```\n?/g, '').trim();
    
    // Try parsing as array
    const parsed = JSON.parse(clean);
    
    if (!Array.isArray(parsed)) {
      // Sometimes Gemini wraps in an object like { schools: [...] }
      if (parsed.schools && Array.isArray(parsed.schools)) return parsed.schools;
      return [];
    }
    
    // Validate each entry has required fields
    return parsed.filter(
      (s: any) => s.name && typeof s.annualTuition === 'number'
    );
  } catch {
    return [];
  }
}
```

---

## Cost Notes

- Gemini 2.5 Flash: free tier is generous (check current limits)
- With Maps grounding on Gemini 3 models: billed per search query, not per prompt
- For the hackathon: stick to 2.5 Flash to avoid billing surprises
- Total expected calls per demo: ~5-10 (very minimal cost)
