import { useMemo } from 'react';
import { useOnboardingStore } from './useOnboardingStore';
import { calculateGrowthProjection } from '@/services/calculator';
import { COUNTRY_CONFIGS } from '@/constants/countries';
import type { WealthReport } from '@/types';

type MilestoneStatus = 'completed' | 'upcoming' | 'pending';

function milestoneStatus(completed: boolean, upcoming: boolean): MilestoneStatus {
  if (completed) return 'completed';
  if (upcoming) return 'upcoming';
  return 'pending';
}

function buildProgressMilestones(fundedPercent: number) {
  return [
    {
      title: 'Start Saving',
      description: 'Begin your education savings journey',
      status: milestoneStatus(fundedPercent > 0, true),
    },
    {
      title: '25% Funded',
      description: 'Quarter of your goal reached',
      status: milestoneStatus(fundedPercent >= 25, fundedPercent > 0),
    },
    {
      title: '50% Funded',
      description: 'Halfway to your education goal',
      status: milestoneStatus(fundedPercent >= 50, fundedPercent >= 25),
    },
    {
      title: 'Apply for Scholarships',
      description: 'Research and apply for education grants',
      status: milestoneStatus(fundedPercent >= 75, fundedPercent >= 50),
    },
    {
      title: '100% Funded',
      description: 'Education fully funded!',
      status: milestoneStatus(fundedPercent >= 100, fundedPercent >= 50),
    },
  ];
}

export function useMonthlyGoal(): number {
  return useOnboardingStore((s) => s.savingsResult?.totalMonthly ?? 0);
}

export function useAdjustedMonthlyGoal(): {
  baseline: number;
  adjusted: number;
  aheadOfSchedule: boolean;
} {
  const savingsResult = useOnboardingStore((s) => s.savingsResult);
  const savingsLog = useOnboardingStore((s) => s.savingsLog);

  return useMemo(() => {
    const baseline = savingsResult?.totalMonthly ?? 0;
    const projectedTotal = savingsResult?.projectedTotal ?? 0;
    const targetYear = savingsResult?.targetYear ?? new Date().getFullYear();

    const totalSaved = savingsLog.reduce((sum, e) => sum + e.amount, 0);
    const remainingMonths = Math.max(1, (targetYear - new Date().getFullYear()) * 12);
    const adjusted = Math.max(0, (projectedTotal - totalSaved) / remainingMonths);

    return { baseline, adjusted: Math.round(adjusted), aheadOfSchedule: adjusted < baseline };
  }, [savingsResult, savingsLog]);
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

export function useTotalSaved(): number {
  const savingsLog = useOnboardingStore((s) => s.savingsLog);
  return useMemo(() => savingsLog.reduce((sum, e) => sum + e.amount, 0), [savingsLog]);
}

export function useSavingsProgress(): {
  totalSaved: number;
  monthlyGoal: number;
  monthsTracked: number;
  monthlyAverage: number;
  onTrack: boolean;
} {
  const savingsLog = useOnboardingStore((s) => s.savingsLog);
  const monthlyGoal = useOnboardingStore((s) => s.savingsResult?.totalMonthly ?? 0);

  return useMemo(() => {
    const totalSaved = savingsLog.reduce((sum, e) => sum + e.amount, 0);

    // Count distinct months tracked
    const months = new Set(savingsLog.map((e) => e.date.slice(0, 7)));
    const monthsTracked = months.size;

    const monthlyAverage = monthsTracked > 0 ? totalSaved / monthsTracked : 0;
    const onTrack = monthlyAverage >= monthlyGoal * 0.9; // within 90% of goal

    return { totalSaved, monthlyGoal, monthsTracked, monthlyAverage, onTrack };
  }, [savingsLog, monthlyGoal]);
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
  const savingsLog = useOnboardingStore((s) => s.savingsLog);
  const projections = useGrowthProjection();

  return useMemo(() => {
    const totalLogged = savingsLog.reduce((sum, e) => sum + e.amount, 0);
    const totalPersonal = currentSavings + totalLogged;
    const finalProjection = projections.length > 0 ? projections[projections.length - 1].amount : 0;
    const marketGrowth = Math.max(0, finalProjection - totalPersonal);
    const potentialGrants = Math.round(finalProjection * 0.05);

    return {
      personalSavings: totalPersonal,
      marketGrowth: Math.round(marketGrowth),
      potentialGrants,
    };
  }, [currentSavings, savingsLog, projections]);
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

    const childGoals = savingsResult.perChild.map((c) => ({
      childId: c.childId,
      childName: c.childName,
      classOf: c.classOf,
      adjustedCost: c.projectedCost,
      progressPercent: c.projectedCost > 0 ? (savingsPerChild / c.projectedCost) * 100 : 0,
    }));

    const avgFunded = childGoals.length > 0
      ? childGoals.reduce((s, c) => s + c.progressPercent, 0) / childGoals.length
      : 0;

    return {
      growthProjection: {
        projectedTotal: finalProjection,
        targetYear: savingsResult.targetYear,
        milestones: projections,
      },
      fundingSources,
      childGoals,
      milestones: buildProgressMilestones(avgFunded),
    };
  }, [savingsResult, children, currentSavings, projections, fundingSources]);
}
