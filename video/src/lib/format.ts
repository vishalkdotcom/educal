/**
 * Format a number as USD currency (e.g., "$54,320").
 */
export function formatCurrency(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US");
}

/**
 * Format a number with commas (e.g., "1,234,567").
 */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
