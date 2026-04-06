import { useMemo } from 'react';
import { useOnboardingStore } from './useOnboardingStore';
import { calculateGrowthProjection } from '@/services/calculator';
import { COUNTRY_CONFIGS } from '@/constants/countries';
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
  const countryCode = useOnboardingStore((s) => s.countryCode);
  const growthRate = COUNTRY_CONFIGS[countryCode].growthRate;

  return useMemo(() => {
    const years = targetYear - new Date().getFullYear();
    if (years <= 0 || monthlyGoal <= 0) return [];
    return calculateGrowthProjection(monthlyGoal, growthRate, years);
  }, [monthlyGoal, targetYear, growthRate]);
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
      fundingSources,
      childGoals: savingsResult.perChild.map((c) => ({
        childId: c.childId,
        childName: c.childName,
        classOf: c.classOf,
        adjustedCost: c.projectedCost,
        progressPercent: c.projectedCost > 0 ? (savingsPerChild / c.projectedCost) * 100 : 0,
      })),
      milestones: [
        { title: 'Annual Review', description: 'Review and adjust your savings plan', status: 'upcoming' as const },
        { title: 'Savings Milestone', description: 'Reach your next savings target', status: 'pending' as const },
        { title: 'Scholarship Applications', description: 'Apply for education grants and scholarships', status: 'pending' as const },
      ],
    };
  }, [savingsResult, children, currentSavings, projections, fundingSources]);
}
