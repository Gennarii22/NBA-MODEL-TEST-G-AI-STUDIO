import { GameLog, PerMinuteProfile, Player, SimulationResult, Team } from '../types';
import { calculateMedian, calculateStdDev, generateGaussian, clamp } from './mathUtils';

const SIMULATION_COUNT = 1000;

/**
 * Phase 2 & 3: Profiling
 * Convert absolute game stats to per-minute metrics and extract median/stdDev.
 */
export const createPlayerProfile = (logs: GameLog[]): PerMinuteProfile => {
  const minutes = logs.map(l => l.minutes);
  const ptsPerMin = logs.map(l => l.minutes > 0 ? l.pts / l.minutes : 0);
  const rebPerMin = logs.map(l => l.minutes > 0 ? l.reb / l.minutes : 0);
  const astPerMin = logs.map(l => l.minutes > 0 ? l.ast / l.minutes : 0);
  const stlPerMin = logs.map(l => l.minutes > 0 ? l.stl / l.minutes : 0);
  const blkPerMin = logs.map(l => l.minutes > 0 ? l.blk / l.minutes : 0);
  const tovPerMin = logs.map(l => l.minutes > 0 ? l.tov / l.minutes : 0);
  const fg3mPerMin = logs.map(l => l.minutes > 0 ? l.fg3m / l.minutes : 0);

  return {
    minutes: { median: calculateMedian(minutes), stdDev: calculateStdDev(minutes) },
    ptsPerMin: { median: calculateMedian(ptsPerMin), stdDev: calculateStdDev(ptsPerMin) },
    rebPerMin: { median: calculateMedian(rebPerMin), stdDev: calculateStdDev(rebPerMin) },
    astPerMin: { median: calculateMedian(astPerMin), stdDev: calculateStdDev(astPerMin) },
    stlPerMin: { median: calculateMedian(stlPerMin), stdDev: calculateStdDev(stlPerMin) },
    blkPerMin: { median: calculateMedian(blkPerMin), stdDev: calculateStdDev(blkPerMin) },
    tovPerMin: { median: calculateMedian(tovPerMin), stdDev: calculateStdDev(tovPerMin) },
    fg3mPerMin: { median: calculateMedian(fg3mPerMin), stdDev: calculateStdDev(fg3mPerMin) },
  };
};

/**
 * Phase 4 & 5: Monte Carlo Engine & Contextualization
 */
export const runSimulation = (player: Player, profile: PerMinuteProfile, opponent: Team): SimulationResult[] => {
  const results: SimulationResult[] = [];

  // Determine opponent defensive modifier based on player position
  // > 1.0 means the opponent is bad at defending this position (boost stats)
  // < 1.0 means the opponent is good (reduce stats)
  let defModifier = 1.0;
  switch (player.position) {
    case 'PG': defModifier = opponent.defensiveRating.vsPG; break;
    case 'SG': defModifier = opponent.defensiveRating.vsSG; break;
    case 'SF': defModifier = opponent.defensiveRating.vsSF; break;
    case 'PF': defModifier = opponent.defensiveRating.vsPF; break;
    case 'C': defModifier = opponent.defensiveRating.vsC; break;
    default: defModifier = opponent.defensiveRating.overall;
  }

  for (let i = 0; i < SIMULATION_COUNT; i++) {
    // 1. Simulate Minutes (cannot be negative, cap at 48)
    // Using simple Gaussian. In reality, minutes might be bimodal, but PDF asks for Normal.
    const simMinutes = clamp(generateGaussian(profile.minutes.median, profile.minutes.stdDev), 10, 48);

    // 2. Simulate Rates
    const simPtsRate = Math.max(0, generateGaussian(profile.ptsPerMin.median, profile.ptsPerMin.stdDev));
    const simRebRate = Math.max(0, generateGaussian(profile.rebPerMin.median, profile.rebPerMin.stdDev));
    const simAstRate = Math.max(0, generateGaussian(profile.astPerMin.median, profile.astPerMin.stdDev));
    const simStlRate = Math.max(0, generateGaussian(profile.stlPerMin.median, profile.stlPerMin.stdDev));
    const simBlkRate = Math.max(0, generateGaussian(profile.blkPerMin.median, profile.blkPerMin.stdDev));
    const simTovRate = Math.max(0, generateGaussian(profile.tovPerMin.median, profile.tovPerMin.stdDev));
    const simFg3mRate = Math.max(0, generateGaussian(profile.fg3mPerMin.median, profile.fg3mPerMin.stdDev));

    // 3. Calculate Raw Totals
    // 4. Apply Opponent Context (Phase 5 formula: SimTotal * DefRating)
    // Note: PDF implies Rate * Minutes * Rating.
    
    results.push({
      simId: i,
      minutes: simMinutes,
      pts: simMinutes * simPtsRate * defModifier,
      reb: simMinutes * simRebRate * defModifier, // Assuming usage/pace scales similarly for non-scoring stats or simplified for this model
      ast: simMinutes * simAstRate * defModifier,
      stl: simMinutes * simStlRate * defModifier, // Steals might inversely correlate to opponent ball security, but using generalized DefRating for simplicity
      blk: simMinutes * simBlkRate * defModifier,
      tov: simMinutes * simTovRate * (2 - defModifier), // TOV inverse: Good defense (0.9) => More TOV (1.1)
      fg3m: simMinutes * simFg3mRate * defModifier,
    });
  }

  return results;
};