import type { CountryCode, CountryConfig } from '@/types';

export const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    currency: { code: 'USD', locale: 'en-US', symbol: '$' },
    inflationRate: 0.042,
    growthRate: 0.07,
    schoolTiers: [
      {
        id: 'public',
        label: 'Public Schools (Local)',
        description:
          'High-quality government-funded education with community focus.',
        costRange: { min: 12000, max: 45000 },
        midpointCost: 28500,
        icon: 'account-balance',
        schools: [
          { name: 'Local Public School', annualTuition: 2500, type: 'public', source: 'fallback' },
          { name: 'District High School', annualTuition: 3000, type: 'public', source: 'fallback' },
          { name: 'Community Elementary', annualTuition: 2000, type: 'public', source: 'fallback' },
        ],
      },
      {
        id: 'private',
        label: 'Private Academy',
        description:
          'Specialized curricula and smaller class sizes for personalized growth.',
        costRange: { min: 180000, max: 320000 },
        midpointCost: 250000,
        icon: 'school',
        schools: [
          { name: 'Private Academy', annualTuition: 18000, type: 'private', source: 'fallback' },
          { name: 'Preparatory School', annualTuition: 22000, type: 'private', source: 'fallback' },
          { name: 'Independent School', annualTuition: 25000, type: 'private', source: 'fallback' },
        ],
      },
      {
        id: 'international',
        label: 'International School',
        description:
          'Global IB standards with multi-language immersion and overseas networks.',
        costRange: { min: 450000, max: 800000 },
        midpointCost: 625000,
        icon: 'public',
        schools: [
          { name: 'International Academy', annualTuition: 35000, type: 'international', source: 'fallback' },
          { name: 'Global IB School', annualTuition: 42000, type: 'international', source: 'fallback' },
          { name: 'World School', annualTuition: 50000, type: 'international', source: 'fallback' },
        ],
      },
    ],
  },
  IN: {
    code: 'IN',
    name: 'India',
    currency: { code: 'INR', locale: 'en-IN', symbol: '₹' },
    inflationRate: 0.1,
    growthRate: 0.12,
    schoolTiers: [
      {
        id: 'public',
        label: 'Government School',
        description:
          'Affordable government-run schools with standard national curriculum.',
        costRange: { min: 30000, max: 100000 },
        midpointCost: 50000,
        icon: 'account-balance',
        schools: [
          { name: 'Kendriya Vidyalaya', annualTuition: 25000, type: 'public', source: 'fallback' },
          { name: 'State Government School', annualTuition: 15000, type: 'public', source: 'fallback' },
          { name: 'Navodaya Vidyalaya', annualTuition: 20000, type: 'public', source: 'fallback' },
        ],
      },
      {
        id: 'private',
        label: 'Private (CBSE/ICSE)',
        description:
          'Private schools following CBSE or ICSE curriculum with better facilities.',
        costRange: { min: 100000, max: 500000 },
        midpointCost: 200000,
        icon: 'school',
        schools: [
          { name: 'DPS School', annualTuition: 150000, type: 'private', source: 'fallback' },
          { name: 'Ryan International', annualTuition: 120000, type: 'private', source: 'fallback' },
          { name: 'DAV Public School', annualTuition: 80000, type: 'private', source: 'fallback' },
        ],
      },
      {
        id: 'international',
        label: 'International School',
        description:
          'IB/Cambridge curriculum schools with global standards and exposure.',
        costRange: { min: 500000, max: 2500000 },
        midpointCost: 1200000,
        icon: 'public',
        schools: [
          { name: 'American Embassy School', annualTuition: 2000000, type: 'international', source: 'fallback' },
          { name: 'Pathways World School', annualTuition: 1500000, type: 'international', source: 'fallback' },
          { name: 'Oberoi International', annualTuition: 1200000, type: 'international', source: 'fallback' },
        ],
      },
    ],
  },
  ID: {
    code: 'ID',
    name: 'Indonesia',
    currency: { code: 'IDR', locale: 'id-ID', symbol: 'Rp' },
    inflationRate: 0.08,
    growthRate: 0.09,
    schoolTiers: [
      {
        id: 'public',
        label: 'Sekolah Negeri',
        description:
          'Government-funded public schools with national curriculum (Kurikulum Merdeka).',
        costRange: { min: 2000000, max: 10000000 },
        midpointCost: 5000000,
        icon: 'account-balance',
        schools: [
          { name: 'SDN Menteng', annualTuition: 3000000, type: 'public', source: 'fallback' },
          { name: 'SMPN 1 Jakarta', annualTuition: 5000000, type: 'public', source: 'fallback' },
          { name: 'SMAN 8 Jakarta', annualTuition: 7000000, type: 'public', source: 'fallback' },
        ],
      },
      {
        id: 'private',
        label: 'Sekolah Swasta',
        description:
          'Private national-curriculum schools with enhanced programs and facilities.',
        costRange: { min: 15000000, max: 80000000 },
        midpointCost: 40000000,
        icon: 'school',
        schools: [
          { name: 'Binus School', annualTuition: 35000000, type: 'private', source: 'fallback' },
          { name: 'Penabur School', annualTuition: 30000000, type: 'private', source: 'fallback' },
          { name: 'Al Azhar School', annualTuition: 25000000, type: 'private', source: 'fallback' },
        ],
      },
      {
        id: 'international',
        label: 'Sekolah Internasional',
        description:
          'IB/Cambridge international schools with global standards.',
        costRange: { min: 100000000, max: 400000000 },
        midpointCost: 200000000,
        icon: 'public',
        schools: [
          { name: 'Jakarta Intercultural School', annualTuition: 350000000, type: 'international', source: 'fallback' },
          { name: 'British School Jakarta', annualTuition: 300000000, type: 'international', source: 'fallback' },
          { name: 'SPH Lippo Village', annualTuition: 200000000, type: 'international', source: 'fallback' },
        ],
      },
    ],
  },
};

export const DEFAULT_COUNTRY: CountryCode = 'US';

export function getCountryConfig(code: CountryCode): CountryConfig {
  return COUNTRY_CONFIGS[code];
}
