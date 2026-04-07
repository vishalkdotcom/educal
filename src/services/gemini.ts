import type { CountryCode, SchoolResult, SchoolTierId } from '@/types';
import { COUNTRY_CONFIGS } from '@/constants/countries';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'gemini-3-flash' },
  { id: 'gemini-3.1-flash-lite-preview', name: 'gemini-3.1-flash-lite' },
  { id: 'gemini-2.5-flash', name: 'gemini-2.5-flash' },
];

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function logGemini(event: string, data?: Record<string, unknown>) {
  console.log(`[Gemini] ${event}`, data ? JSON.stringify(data) : '');
}

logGemini('init', { hasKey: !!GEMINI_API_KEY, keyPrefix: GEMINI_API_KEY?.slice(0, 8) });

/** Try models in order with one 503 retry each, then fall back to the next model. */
async function geminiRequest(body: object, label: string): Promise<string | null> {
  for (const { id, name } of GEMINI_MODELS) {
    const url = `${GEMINI_BASE}/${id}:generateContent?key=${GEMINI_API_KEY}`;
    const fetchOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) await delay(1500);

        const response = await fetch(url, fetchOpts);

        if (response.status === 503) {
          logGemini('503_retry', { label, model: name, attempt });
          if (attempt === 0) continue; // retry once
          break; // move to next model
        }

        if (!response.ok) {
          const errorBody = await response.text();
          logGemini('api_error', { label, model: name, status: response.status, body: errorBody.slice(0, 500) });
          break; // non-503 error, skip to next model
        }

        const data = await response.json();
        const textContent =
          data.candidates?.[0]?.content?.parts
            ?.filter((p: any) => p.text)
            ?.map((p: any) => p.text)
            ?.join('') || '';

        logGemini('response', { label, model: name, textLength: textContent.length, preview: textContent.slice(0, 200) });

        if (textContent) return textContent;
        break; // empty response, try next model
      } catch (error) {
        logGemini('fetch_error', { label, model: name, error: String(error) });
        break;
      }
    }
  }

  return null;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface CacheEntry {
  results: SchoolResult[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

interface GeminiSchoolSearchParams {
  latitude: number;
  longitude: number;
  tier: SchoolTierId;
  childAges: number[];
  targetLevels: string[];
  countryCode?: CountryCode;
}

export async function searchSchoolsWithGemini(
  params: GeminiSchoolSearchParams,
): Promise<SchoolResult[]> {
  const { latitude, longitude, tier, childAges, countryCode = 'US' } = params;
  const currencyCode = COUNTRY_CONFIGS[countryCode].currency.code;

  // Round to ~1km precision to avoid GPS jitter cache misses
  const cacheKey = `${countryCode}_${latitude.toFixed(2)}_${longitude.toFixed(2)}_${tier}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    logGemini('cache_hit', { tier, cacheKey });
    return cached.results;
  }

  if (!GEMINI_API_KEY) {
    logGemini('using_fallback', { tier, reason: 'no_api_key' });
    return getFallbackSchools(tier, countryCode);
  }

  const tierDescriptions: Record<SchoolTierId, string> = {
    public: 'public government-funded schools',
    private: 'private academy or independent schools',
    international: 'international schools with IB or international curriculum',
  };

  const prompt = `Find ${tierDescriptions[tier]} near coordinates ${latitude}, ${longitude} suitable for children aged ${childAges.join(' and ')}. For each school, provide: school name, estimated annual tuition in ${currencyCode}, school type, and a brief description. Return ONLY a JSON array with no additional text, markdown, or explanation. Each object in the array should have: "name" (string), "annualTuition" (number in ${currencyCode}), "type" (string: public/private/international), "description" (string). Return maximum 5 schools.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  };

  const textContent = await geminiRequest(body, tier);
  if (!textContent) {
    logGemini('using_fallback', { tier, reason: 'api_failed' });
    return getFallbackSchools(tier, countryCode);
  }

  const schools = safeParseSchools(textContent);
  logGemini('parsed', { tier, count: schools.length });

  if (schools.length === 0) {
    logGemini('using_fallback', { tier, reason: 'empty_parse' });
    return getFallbackSchools(tier, countryCode);
  }

  const results: SchoolResult[] = schools.map((s: any) => ({
    name: s.name || 'Unknown School',
    annualTuition: typeof s.annualTuition === 'number' ? s.annualTuition : 0,
    type: s.type || tier,
    address: s.address,
    rating: s.rating,
    source: 'gemini' as const,
  }));

  cache.set(cacheKey, { results, timestamp: Date.now() });
  return results;
}

export async function searchSchoolTuition(
  schoolName: string,
): Promise<{ annualTuition: number; inflationRate: number } | null> {
  if (!GEMINI_API_KEY) return null;

  const prompt = `What is the current annual tuition for ${schoolName}? Also provide the average annual education inflation rate for this type of institution. Return ONLY a JSON object with: "annualTuition" (number in local currency), "inflationRate" (number as decimal, e.g. 0.052 for 5.2%). No additional text.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
  };

  const textContent = await geminiRequest(body, 'tuition');
  if (!textContent) return null;

  try {
    const cleanJson = textContent.replace(/```json\n?|```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (typeof parsed.annualTuition !== 'number') return null;
    return {
      annualTuition: parsed.annualTuition,
      inflationRate: parsed.inflationRate ?? 0.042,
    };
  } catch (error) {
    logGemini('tuition_parse_error', { error: String(error) });
    return null;
  }
}

function getFallbackSchools(tier: SchoolTierId, countryCode: CountryCode = 'US'): SchoolResult[] {
  const tierData = COUNTRY_CONFIGS[countryCode].schoolTiers.find((t) => t.id === tier);
  return tierData?.schools ?? [];
}

/**
 * Searches all three school tiers in parallel via Gemini.
 * Returns results grouped by tier. Falls back per-tier on failure.
 */
export async function searchAllSchoolTiers(
  latitude: number,
  longitude: number,
  countryCode: CountryCode,
  childAges: number[],
  targetLevels: string[],
): Promise<{ public: SchoolResult[]; private: SchoolResult[]; international: SchoolResult[] }> {
  const tiers: SchoolTierId[] = ['public', 'private', 'international'];
  const results = await Promise.allSettled(
    tiers.map((tier) =>
      searchSchoolsWithGemini({
        latitude,
        longitude,
        tier,
        childAges,
        targetLevels,
        countryCode,
      }),
    ),
  );

  return {
    public: results[0].status === 'fulfilled' ? results[0].value : getFallbackSchools('public', countryCode),
    private: results[1].status === 'fulfilled' ? results[1].value : getFallbackSchools('private', countryCode),
    international: results[2].status === 'fulfilled' ? results[2].value : getFallbackSchools('international', countryCode),
  };
}

function validSchool(s: any): boolean {
  return s && typeof s.name === 'string' && s.name.length > 0 && typeof s.annualTuition === 'number';
}

function safeParseSchools(raw: string): any[] {
  try {
    const clean = raw.replace(/```json\n?|```\n?/g, '').trim();

    // Try direct parse first
    try {
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed)) return parsed.filter(validSchool);
      if (parsed.schools && Array.isArray(parsed.schools)) return parsed.schools.filter(validSchool);
    } catch { /* fall through to regex extraction */ }

    // Extract JSON array from mixed text (Gemini with grounding often wraps JSON in prose)
    const arrayMatch = clean.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) return parsed.filter(validSchool);
    }

    logGemini('parse_failed', { preview: clean.slice(0, 300) });
    return [];
  } catch {
    logGemini('parse_exception', { preview: raw.slice(0, 300) });
    return [];
  }
}
