import { useMemo } from 'react';
import { useOnboardingStore } from './useOnboardingStore';
import {
  calculateGrowthProjection,
  calculateTaxSavings,
} from '@/services/calculator';
import { DEFAULT_GROWTH_RATE, TAX_ADVANTAGE_RATE } from '@/constants/schools';
import type { WealthReport } from '@/types';

export function useMonthlyGoal(): number {
  return useOnboardingStore((s) => s.savingsResult?.totalMonthly ?? 0);
}

export function useTotalProjectedCost(): number {
  return useOnboardingStore((s) => s.savingsResult?.projectedTotal ?? 0);
}

export function usePerChildProgress(): { childId: string; childName: string; percent: number }[] {
  const savingsResult = useOnboardingStore((s) => s.savingsResult);
  const currentSavings = useOnboardingStore((s) => s.currentSavings);
  const childCount = useOnboardingStore((s) => s.children.length);

  return useMemo(() => {
    if (!savingsResult) return [];
    const savingsPerChild = childCount > 0 ? currentSavings / childCount : 0;
    return savingsResult.perChild.map((c) => ({
      childId: c.childId,
      childName: c.childName,
      percent: c.projectedCost > 0 ? (savingsPerChild / c.projectedCost) * 100 : 0,
    }));
  }, [savingsResult, currentSavings, childCount]);
}

export function useGrowthProjection() {
  const monthlyGoal = useOnboardingStore((s) => s.savingsResult?.totalMonthly ?? 0);
  const targetYear = useOnboardingStore((s) => s.savingsResult?.targetYear ?? new Date().getFullYear());

  return useMemo(() => {
    const years = targetYear - new Date().getFullYear();
    if (years <= 0 || monthlyGoal <= 0) return [];
    return calculateGrowthProjection(monthlyGoal, DEFAULT_GROWTH_RATE, years);
  }, [monthlyGoal, targetYear]);
}

export function useTaxSavings(): number {
  const monthlyGoal = useOnboardingStore((s) => s.savingsResult?.totalMonthly ?? 0);
  const targetYear = useOnboardingStore((s) => s.savingsResult?.targetYear ?? new Date().getFullYear());

  return useMemo(() => {
    const years = targetYear - new Date().getFullYear();
    const totalContributions = monthlyGoal * 12 * years;
    return calculateTaxSavings(totalContributions, TAX_ADVANTAGE_RATE);
  }, [monthlyGoal, targetYear]);
}

export function useFundingSources(): {
  personalSavings: number;
  marketGrowth: number;
  potentialGrants: number;
} {
  const currentSavings = useOnboardingStore((s) => s.currentSavings);
  const projections = useGrowthProjection();

  return useMemo(() => {
    const finalProjection = projections.length > 0 ? projections[projections.length - 1].amount : 0;
    const marketGrowth = Math.max(0, finalProjection - currentSavings);
    const potentialGrants = Math.round(finalProjection * 0.05);

    return {
      personalSavings: currentSavings,
      marketGrowth: Math.round(marketGrowth),
      potentialGrants,
    };
  }, [currentSavings, projections]);
}

export function useWealthReport(): WealthReport | null {
  const savingsResult = useOnboardingStore((s) => s.savingsResult);
  const children = useOnboardingStore((s) => s.children);
  const currentSavings = useOnboardingStore((s) => s.currentSavings);
  const projections = useGrowthProjection();
  const taxSavings = useTaxSavings();
  const fundingSources = useFundingSources();

  return useMemo(() => {
    if (!savingsResult) return null;

    const finalProjection = projections.length > 0 ? projections[projections.length - 1].amount : 0;
    const childCount = children.length;
    const savingsPerChild = childCount > 0 ? currentSavings / childCount : 0;

    return {
      growthProjection: {
        projectedTotal: finalProjection,
        targetYear: savingsResult.targetYear,
        milestones: projections,
      },
      taxSavingsAdvantage: taxSavings,
      fundingSources,
      childGoals: savingsResult.perChild.map((c) => ({
        childId: c.childId,
        childName: c.childName,
        classOf: c.classOf,
        adjustedCost: c.projectedCost,
        progressPercent: c.projectedCost > 0 ? (savingsPerChild / c.projectedCost) * 100 : 0,
      })),
      milestones: [
        { title: 'Portfolio Rebalance', description: 'Annual portfolio review and rebalancing', status: 'upcoming' as const },
        { title: 'Max Contribution', description: 'Reach maximum annual 529 contribution', status: 'pending' as const },
        { title: 'Grant Lock-in', description: 'Apply for education grants and scholarships', status: 'pending' as const },
      ],
    };
  }, [savingsResult, children, currentSavings, projections, taxSavings, fundingSources]);
}
