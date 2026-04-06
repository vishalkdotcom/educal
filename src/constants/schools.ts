import type { SchoolTier } from '@/types';

export const DEFAULT_INFLATION_RATE = 0.042;
export const DEFAULT_GROWTH_RATE = 0.07;
export const TAX_ADVANTAGE_RATE = 0.165;

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
      { name: 'Community Elementary', annualTuition: 2000, type: 'public', source: 'fallback' },
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
      { name: 'Private Academy', annualTuition: 18000, type: 'private', source: 'fallback' },
      { name: 'Preparatory School', annualTuition: 22000, type: 'private', source: 'fallback' },
      { name: 'Independent School', annualTuition: 25000, type: 'private', source: 'fallback' },
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
      { name: 'International Academy', annualTuition: 35000, type: 'international', source: 'fallback' },
      { name: 'Global IB School', annualTuition: 42000, type: 'international', source: 'fallback' },
      { name: 'World School', annualTuition: 50000, type: 'international', source: 'fallback' },
    ],
  },
];
