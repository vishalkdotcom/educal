import { COUNTRY_CONFIGS, DEFAULT_COUNTRY } from '@/constants/countries';

const usConfig = COUNTRY_CONFIGS[DEFAULT_COUNTRY];

// Re-exports from US config for backward compatibility
export const DEFAULT_INFLATION_RATE = usConfig.inflationRate;
export const DEFAULT_GROWTH_RATE = usConfig.growthRate;
export const SCHOOL_TIERS = usConfig.schoolTiers;
