import type { CountryCode, SchoolResult, SchoolTierId } from '@/types';
import { COUNTRY_CONFIGS } from '@/constants/countries';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const cache = new Map<string, SchoolResult[]>();

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

  const cacheKey = `${latitude}_${longitude}_${tier}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  if (!GEMINI_API_KEY) {
    return getFallbackSchools(tier, countryCode);
  }

  const tierDescriptions: Record<SchoolTierId, string> = {
    public: 'public government-funded schools',
    private: 'private academy or independent schools',
    international: 'international schools with IB or international curriculum',
  };

  const prompt = `Find ${tierDescriptions[tier]} near coordinates ${latitude}, ${longitude} suitable for children aged ${childAges.join(' and ')}. For each school, provide: school name, estimated annual tuition in ${currencyCode}, school type, and a brief description. Return ONLY a JSON array with no additional text, markdown, or explanation. Each object in the array should have: "name" (string), "annualTuition" (number in ${currencyCode}), "type" (string: public/private/international), "description" (string). Return maximum 5 schools.`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [
          { google_search: {} },
          { google_maps: { enable_widget: false } },
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

    const textContent =
      data.candidates?.[0]?.content?.parts
        ?.filter((p: any) => p.text)
        ?.map((p: any) => p.text)
        ?.join('') || '';

    const schools = safeParseSchools(textContent);
    if (schools.length === 0) {
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

    cache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.warn('Gemini search failed, using fallback data:', error);
    return getFallbackSchools(tier, countryCode);
  }
}

export async function searchSchoolTuition(
  schoolName: string,
): Promise<{ annualTuition: number; inflationRate: number } | null> {
  if (!GEMINI_API_KEY) return null;

  const prompt = `What is the current annual tuition for ${schoolName}? Also provide the average annual education inflation rate for this type of institution. Return ONLY a JSON object with: "annualTuition" (number in local currency), "inflationRate" (number as decimal, e.g. 0.052 for 5.2%). No additional text.`;

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
    const textContent =
      data.candidates?.[0]?.content?.parts
        ?.filter((p: any) => p.text)
        ?.map((p: any) => p.text)
        ?.join('') || '';

    const cleanJson = textContent.replace(/```json\n?|```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (typeof parsed.annualTuition !== 'number') return null;
    return {
      annualTuition: parsed.annualTuition,
      inflationRate: parsed.inflationRate ?? 0.042,
    };
  } catch (error) {
    console.warn('Gemini tuition search failed:', error);
    return null;
  }
}

function getFallbackSchools(tier: SchoolTierId, countryCode: CountryCode = 'US'): SchoolResult[] {
  const tierData = COUNTRY_CONFIGS[countryCode].schoolTiers.find((t) => t.id === tier);
  return tierData?.schools ?? [];
}

function safeParseSchools(raw: string): any[] {
  try {
    const clean = raw.replace(/```json\n?|```\n?/g, '').trim();
    const parsed = JSON.parse(clean);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (s: any) => s.name && typeof s.annualTuition === 'number',
      );
    }

    if (parsed.schools && Array.isArray(parsed.schools)) {
      return parsed.schools.filter(
        (s: any) => s.name && typeof s.annualTuition === 'number',
      );
    }

    return [];
  } catch {
    return [];
  }
}
