export type CountryCode = 'US' | 'IN' | 'ID';

export type CostSource = 'user' | 'tier' | 'gemini';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  currency: { code: string; locale: string; symbol: string };
  inflationRate: number;
  growthRate: number;
  schoolTiers: SchoolTier[];
}

export type TargetLevel = 'primary' | 'high_school' | 'university';

export const TARGET_AGES: Record<TargetLevel, number> = {
  primary: 6,
  high_school: 14,
  university: 18,
};

export interface Child {
  id: string;
  name: string;
  currentAge: number;
  targetLevel: TargetLevel;
  targetAge: number;
}

export type SchoolTierId = 'public' | 'private' | 'international';

export interface SchoolTier {
  id: SchoolTierId;
  label: string;
  description: string;
  costRange: { min: number; max: number };
  midpointCost: number;
  icon: string;
  schools: SchoolResult[];
}

export interface SchoolResult {
  name: string;
  annualTuition: number;
  type: SchoolTierId;
  address?: string;
  rating?: number;
  source: 'gemini' | 'fallback';
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface SavingsResult {
  totalMonthly: number;
  targetYear: number;
  perChild: ChildSavingsBreakdown[];
  projectedTotal: number;
  currentFunded: number;
}

export interface ChildSavingsBreakdown {
  childId: string;
  childName: string;
  monthlyShare: number;
  yearsToSave: number;
  projectedCost: number;
  classOf: number;
}

export interface WhatIfResult {
  fundedPercent: number;
  shortfall: number;
  yearsToGoal: number | null;
  fullyFunded: boolean;
}

export interface GrowthProjection {
  year: number;
  amount: number;
}

export interface WealthReport {
  growthProjection: {
    projectedTotal: number;
    targetYear: number;
    milestones: GrowthProjection[];
  };
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

export interface CalculationFactors {
  inflationRate: number;
  growthRate: number;
}
