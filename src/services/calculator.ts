import type { Child, ChildSavingsBreakdown, GrowthProjection, SavingsResult, SchoolTier } from '@/types';
import { DEFAULT_INFLATION_RATE } from '@/constants/schools';

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
): SavingsResult {
  const inflationRate = DEFAULT_INFLATION_RATE;

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

export function calculateTaxSavings(
  totalContributions: number,
  taxRate: number,
): number {
  return totalContributions * taxRate;
}

export function calculatePerChildBreakdown(
  children: Child[],
  currentSavings: number,
  tier: SchoolTier,
): ChildSavingsBreakdown[] {
  const result = calculateMonthlySavings(children, currentSavings, tier);
  return result.perChild;
}
