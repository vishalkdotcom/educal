import type { CountryCode } from '@/types';
import { COUNTRY_CONFIGS } from '@/constants/countries';

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(countryCode: CountryCode, compact: boolean): Intl.NumberFormat {
  const key = `${countryCode}-${compact ? 'compact' : 'full'}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    const { locale, code } = COUNTRY_CONFIGS[countryCode].currency;
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: compact ? 1 : 0,
      ...(compact ? { notation: 'compact' as const } : {}),
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export function formatCurrency(amount: number, countryCode: CountryCode = 'US'): string {
  return getFormatter(countryCode, false).format(Math.round(amount));
}

export function formatCurrencyCompact(amount: number, countryCode: CountryCode = 'US'): string {
  return getFormatter(countryCode, true).format(amount);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatAge(age: number): string {
  return age === 1 ? '1 year old' : `${age} years old`;
}
