import type { Child, ChildSavingsBreakdown, GrowthProjection, SavingsResult, SchoolTier, WhatIfResult } from '@/types';

export function calculateProjectedCost(
  annualTuition: number,
  inflationRate: number,
  yearsUntilEnrollment: number,
): number {
  return annualTuition * Math.pow(1 + inflationRate, yearsUntilEnrollment);
}

export function calculateFourYearTotal(
  annualTuition: number,
  inflationRate: number,
  enrollmentYear: number,
): number {
  const currentYear = new Date().getFullYear();
  const yearsOut = enrollmentYear - currentYear;
  return [0, 1, 2, 3].reduce(
    (sum, i) => sum + annualTuition * Math.pow(1 + inflationRate, yearsOut + i),
    0,
  );
}

export function calculateMonthlySavings(
  children: Child[],
  currentSavings: number,
  tier: SchoolTier,
  inflationRate = 0.042,
): SavingsResult {

  const perChild: ChildSavingsBreakdown[] = children.map((child) => {
    const yearsToSave = child.targetAge - child.currentAge;
    const monthsToSave = yearsToSave * 12;
    const projectedCost =
      tier.midpointCost * Math.pow(1 + inflationRate, yearsToSave);
    const savingsShare = currentSavings / children.length;
    const netCost = projectedCost - savingsShare;
    const monthlyShare = monthsToSave > 0 ? Math.max(0, netCost / monthsToSave) : 0;

    return {
      childId: child.id,
      childName: child.name,
      monthlyShare,
      yearsToSave,
      projectedCost,
      classOf: new Date().getFullYear() + yearsToSave,
    };
  });

  const totalMonthly = perChild.reduce((sum, c) => sum + c.monthlyShare, 0);
  const projectedTotal = perChild.reduce((sum, c) => sum + c.projectedCost, 0);
  const targetYear =
    new Date().getFullYear() + Math.max(...perChild.map((c) => c.yearsToSave));
  const currentFunded = projectedTotal > 0 ? (currentSavings / projectedTotal) * 100 : 0;

  return { totalMonthly, targetYear, perChild, projectedTotal, currentFunded };
}

export function calculateGrowthProjection(
  monthlySavings: number,
  growthRate: number,
  years: number,
): GrowthProjection[] {
  const annualContribution = monthlySavings * 12;
  const currentYear = new Date().getFullYear();
  const milestones: GrowthProjection[] = [];

  for (let y = 0; y <= years; y++) {
    if (y === 0 || y === 5 || y === 10 || y === years) {
      const amount =
        growthRate > 0
          ? annualContribution *
            ((Math.pow(1 + growthRate, y) - 1) / growthRate)
          : annualContribution * y;
      milestones.push({ year: currentYear + y, amount: Math.round(amount) });
    }
  }

  return milestones;
}

export function calculateFromAnnualCost(
  children: Child[],
  currentSavings: number,
  annualCost: number,
  inflationRate = 0.042,
): SavingsResult {
  const perChild: ChildSavingsBreakdown[] = children.map((child) => {
    const yearsToSave = child.targetAge - child.currentAge;
    const monthsToSave = yearsToSave * 12;
    const projectedCost =
      annualCost * Math.pow(1 + inflationRate, yearsToSave);
    const savingsShare = currentSavings / children.length;
    const netCost = projectedCost - savingsShare;
    const monthlyShare = monthsToSave > 0 ? Math.max(0, netCost / monthsToSave) : 0;

    return {
      childId: child.id,
      childName: child.name,
      monthlyShare,
      yearsToSave,
      projectedCost,
      classOf: new Date().getFullYear() + yearsToSave,
    };
  });

  const totalMonthly = perChild.reduce((sum, c) => sum + c.monthlyShare, 0);
  const projectedTotal = perChild.reduce((sum, c) => sum + c.projectedCost, 0);
  const targetYear =
    new Date().getFullYear() + Math.max(...perChild.map((c) => c.yearsToSave));
  const currentFunded = projectedTotal > 0 ? (currentSavings / projectedTotal) * 100 : 0;

  return { totalMonthly, targetYear, perChild, projectedTotal, currentFunded };
}

export function calculateWhatIf(
  monthlySavings: number,
  annualCost: number,
  inflationRate: number,
  children: Child[],
  currentSavings: number,
): WhatIfResult {
  // Total projected cost across all children (inflation-adjusted)
  let totalProjectedCost = 0;
  let maxYears = 0;
  for (const child of children) {
    const years = child.targetAge - child.currentAge;
    if (years > maxYears) maxYears = years;
    totalProjectedCost += annualCost * Math.pow(1 + inflationRate, years);
  }

  // Total saved over the saving period
  const totalSaved = currentSavings + monthlySavings * maxYears * 12;

  const fundedPercent = totalProjectedCost > 0
    ? Math.min((totalSaved / totalProjectedCost) * 100, 100)
    : 100;
  const shortfall = Math.max(0, totalProjectedCost - totalSaved);
  const fullyFunded = totalSaved >= totalProjectedCost;

  // How many years until fully funded (if ever)
  let yearsToGoal: number | null = null;
  if (monthlySavings > 0) {
    const annualSavings = monthlySavings * 12;
    const needed = totalProjectedCost - currentSavings;
    if (needed <= 0) {
      yearsToGoal = 0;
    } else {
      const years = Math.ceil(needed / annualSavings);
      yearsToGoal = years;
    }
  }

  return { fundedPercent, shortfall, yearsToGoal, fullyFunded };
}

export function calculatePerChildBreakdown(
  children: Child[],
  currentSavings: number,
  tier: SchoolTier,
): ChildSavingsBreakdown[] {
  const result = calculateMonthlySavings(children, currentSavings, tier);
  return result.perChild;
}
