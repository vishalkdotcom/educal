import { GoogleGenAI } from '@google/genai';
import { z, toJSONSchema } from 'zod';
import type { CountryCode, SchoolResult, SchoolTierId } from '@/types';
import { SCHOOL_TIER_IDS } from '@/types';
import { COUNTRY_CONFIGS } from '@/constants/countries';

const GeminiSchoolSchema = z.object({
  name: z.string().describe('Full official name of the school'),
  annualTuition: z.number().describe('Estimated total annual education cost in the requested currency, including tuition, fees, supplies, uniforms, and other mandatory expenses. For public/free schools, estimate the total out-of-pocket cost families actually pay.'),
  type: z.enum(SCHOOL_TIER_IDS).describe('School category'),
  address: z.string().optional().describe('Street address or locality of the school'),
  rating: z.number().optional().describe('School rating out of 5 if available'),
});

const SchoolSearchResponseSchema = z.array(GeminiSchoolSchema);

const TuitionResponseSchema = z.object({
  annualTuition: z.number().describe('Current total annual education cost in local currency, including tuition, fees, supplies, and other expenses families pay. For free/public schools, estimate total out-of-pocket cost.'),
  inflationRate: z.number().optional().describe('Average annual education cost inflation rate as decimal, e.g. 0.052 for 5.2%'),
});

const schoolSearchJsonSchema = toJSONSchema(SchoolSearchResponseSchema);
const tuitionJsonSchema = toJSONSchema(TuitionResponseSchema);

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

let _genai: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!_genai) _genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return _genai;
}

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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Try models in order with one retry each on transient errors, then fall back to the next model. */
async function geminiGenerate(
  prompt: string,
  config: { temperature: number; maxOutputTokens: number; responseJsonSchema?: unknown },
  label: string,
): Promise<string | null> {
  const genai = getGenAI();
  if (!genai) return null;

  const genConfig: Record<string, unknown> = {
    tools: [{ googleSearch: {} }],
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
  };
  if (config.responseJsonSchema) {
    genConfig.responseMimeType = 'application/json';
    genConfig.responseJsonSchema = config.responseJsonSchema;
  }

  for (const { id, name } of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) await delay(1500);

        const response = await genai.models.generateContent({
          model: id,
          contents: prompt,
          config: genConfig,
        });

        const text = response.text ?? '';
        logGemini('response', { label, model: name, textLength: text.length, preview: text.slice(0, 200) });

        if (text) return text;
        break; // empty response, try next model
      } catch (error: any) {
        const status = error?.status ?? error?.code;
        if (status === 503 && attempt === 0) {
          logGemini('503_retry', { label, model: name, attempt });
          continue; // retry once on 503
        }
        logGemini('fetch_error', { label, model: name, error: String(error) });
        break; // non-retryable error, skip to next model
      }
    }
  }

  return null;
}

interface CacheEntry {
  results: SchoolResult[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const TIER_DESCRIPTIONS: Record<SchoolTierId, string> = {
  public: 'public government-funded schools',
  private: 'private academy or independent schools',
  international: 'international schools with IB or international curriculum',
};

interface GeminiSchoolSearchParams {
  latitude: number;
  longitude: number;
  tier: SchoolTierId;
  childAges: number[];
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

  const prompt = `Search for real, currently operating ${TIER_DESCRIPTIONS[tier]} near latitude ${latitude}, longitude ${longitude}. The schools should be suitable for children aged ${childAges.join(' and ')}. For each school provide its official name, street address, and estimated total annual education cost in ${currencyCode}. For public or government-funded schools where tuition is free or subsidized, estimate the realistic total annual out-of-pocket cost families pay including registration fees, textbooks, supplies, uniforms, transportation, meals, and extracurricular activities — this should never be 0. Use current data from school websites or recent publications. Return up to 5 schools, prioritizing well-known institutions closest to the coordinates.`;

  const textContent = await geminiGenerate(
    prompt,
    {
      temperature: 0.3,
      maxOutputTokens: 8192,
      responseJsonSchema: schoolSearchJsonSchema,
    },
    tier,
  );
  if (!textContent) {
    logGemini('using_fallback', { tier, reason: 'api_failed' });
    return getFallbackSchools(tier, countryCode);
  }

  let schools: z.infer<typeof SchoolSearchResponseSchema>;
  try {
    schools = SchoolSearchResponseSchema.parse(JSON.parse(textContent));
  } catch (error) {
    logGemini('parse_error', { tier, error: String(error) });
    return getFallbackSchools(tier, countryCode);
  }

  logGemini('parsed', { tier, count: schools.length });

  if (schools.length === 0) {
    logGemini('using_fallback', { tier, reason: 'empty_result' });
    return getFallbackSchools(tier, countryCode);
  }

  // For public schools, if Gemini still returns 0, use the country's fallback minimum
  const fallbackSchools = getFallbackSchools(tier, countryCode);
  const fallbackMin = fallbackSchools.length > 0
    ? Math.min(...fallbackSchools.map((s) => s.annualTuition))
    : 0;

  const results: SchoolResult[] = schools.map((s) => ({
    name: s.name,
    annualTuition: s.annualTuition > 0 ? s.annualTuition : fallbackMin,
    type: s.type,
    address: s.address,
    rating: s.rating,
    source: 'gemini' as const,
  }));

  // Evict expired entries to prevent unbounded growth
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.timestamp >= CACHE_TTL_MS) cache.delete(key);
  }
  cache.set(cacheKey, { results, timestamp: now });
  return results;
}

export async function searchSchoolTuition(
  schoolName: string,
  countryCode: CountryCode = 'US',
): Promise<{ annualTuition: number; inflationRate: number } | null> {
  if (!GEMINI_API_KEY) return null;

  const prompt = `Look up the total annual education cost for "${schoolName}" using official school websites or recent publications. Include tuition, fees, supplies, uniforms, and other mandatory expenses families pay. If the school is public/free, estimate the realistic total out-of-pocket annual cost (not 0). Also estimate the average annual education cost inflation rate for this type of institution in its country. Use real, up-to-date figures.`;

  const textContent = await geminiGenerate(
    prompt,
    {
      temperature: 0.2,
      maxOutputTokens: 256,
      responseJsonSchema: tuitionJsonSchema,
    },
    'tuition',
  );
  if (!textContent) return null;

  try {
    const parsed = TuitionResponseSchema.parse(JSON.parse(textContent));
    return {
      annualTuition: parsed.annualTuition,
      inflationRate: parsed.inflationRate ?? COUNTRY_CONFIGS[countryCode].inflationRate,
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

/** Searches all three school tiers in parallel via Gemini. Falls back per-tier on failure. */
export async function searchAllSchoolTiers(
  params: Omit<GeminiSchoolSearchParams, 'tier'>,
): Promise<Record<SchoolTierId, SchoolResult[]>> {
  const countryCode = params.countryCode ?? 'US';
  const results = await Promise.allSettled(
    SCHOOL_TIER_IDS.map((tier) => searchSchoolsWithGemini({ ...params, tier })),
  );

  return Object.fromEntries(
    SCHOOL_TIER_IDS.map((tier, i) => [
      tier,
      results[i].status === 'fulfilled' ? results[i].value : getFallbackSchools(tier, countryCode),
    ]),
  ) as Record<SchoolTierId, SchoolResult[]>;
}

