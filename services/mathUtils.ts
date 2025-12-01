/**
 * Generates a random number from a Normal (Gaussian) Distribution 
 * using the Box-Muller transform.
 * Equivalent to Excel's =NORM.INV(RAND(), mean, stdDev)
 */
export const generateGaussian = (mean: number, stdDev: number): number => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  
  // Standard Normal variant (Z-score)
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  
  // Scale to distribution
  return z * stdDev + mean;
};

/**
 * Calculates the Median of an array of numbers
 */
export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculates the Standard Deviation (Population) of an array
 */
export const calculateStdDev = (values: number[], mean?: number): number => {
  if (values.length === 0) return 0;
  const avg = mean ?? values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

/**
 * Calculates the Defensive Rating (efficiency ratio).
 * Rating = TeamStatsAllowed / LeagueAverage
 * > 1.0 = Team allows MORE than average (Bad Defense / Good for Opponent)
 * < 1.0 = Team allows LESS than average (Good Defense / Bad for Opponent)
 */
export const calculateDefensiveRating = (teamAllowed: number, leagueAvg: number): number => {
  if (leagueAvg === 0) return 1.0;
  return teamAllowed / leagueAvg;
};