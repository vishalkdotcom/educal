import type { Child, SchoolTierId } from '@/types';

export function validateChildName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Name is required';
  return null;
}

export function validateChildAge(age: number | string): string | null {
  const n = typeof age === 'string' ? parseInt(age, 10) : age;
  if (isNaN(n)) return 'Age is required';
  if (!Number.isInteger(n)) return 'Age must be a whole number';
  if (n < 0 || n > 17) return 'Age must be between 0 and 17';
  return null;
}

export function validateChild(
  child: Partial<Child>,
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const nameErr = validateChildName(child.name ?? '');
  if (nameErr) errors.name = nameErr;
  const ageErr = validateChildAge(child.currentAge ?? NaN);
  if (ageErr) errors.age = ageErr;
  if (!child.targetLevel) errors.targetLevel = 'Target level is required';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateIncome(income: number): string | null {
  if (!income || income <= 0) return 'Please enter your household income';
  return null;
}

export function validateStep1(children: Child[]): boolean {
  return children.length >= 1;
}

export function validateStep2(income: number): boolean {
  return income > 0;
}

export function validateStep3(selectedTier: SchoolTierId | null): boolean {
  return selectedTier !== null;
}
