/**
 * Deterministic seeded random — safe for Remotion (no flickering).
 * Uses a simple hash to produce stable values from an index/seed.
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * Generate a deterministic value in a range.
 */
export function randomInRange(
  seed: number,
  min: number,
  max: number,
): number {
  return min + seededRandom(seed) * (max - min);
}
