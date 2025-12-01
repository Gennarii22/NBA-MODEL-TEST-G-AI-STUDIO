import { GameLog, PerMinuteProfile, Player, SimulationResult, Team, StatCategory } from '../types';
import { calculateMedian, calculateStdDev, generateGaussian, clamp, calculateDefensiveRating } from './mathUtils';

const SIMULATION_COUNT = 1000;

/**
 * Phase 2 & 3: Profiling
 * Convert absolute game stats to per-minute metrics and extract median/stdDev.
 */
export const createPlayerProfile = (logs: GameLog[]): PerMinuteProfile => {
  // Filter out games with 0 minutes or invalid data to avoid Infinity/NaN
  const validLogs = logs.filter(l => l.minutes > 0);

  if (validLogs.length === 0) {
    // Fallback profile if no valid logs exist
    return {
      minutes: { median: 0, stdDev: 0 },
      ptsPerMin: { median: 0, stdDev: 0 },
      rebPerMin: { median: 0, stdDev: 0 },
      astPerMin: { median: 0, stdDev: 0 },
      stlPerMin: { median: 0, stdDev: 0 },
      blkPerMin: { median: 0, stdDev: 0 },
      tovPerMin: { median: 0, stdDev: 0 },
      fg3mPerMin: { median: 0, stdDev: 0 },
    };
  }

  const minutes = validLogs.map(l => l.minutes);
  const ptsPerMin = validLogs.map(l => l.pts / l.minutes);
  const rebPerMin = validLogs.map(l => l.reb / l.minutes);
  const astPerMin = validLogs.map(l => l.ast / l.minutes);
  const stlPerMin = validLogs.map(l => l.stl / l.minutes);
  const blkPerMin = validLogs.map(l => l.blk / l.minutes);
  const tovPerMin = validLogs.map(l => l.tov / l.minutes);
  const fg3mPerMin = validLogs.map(l => l.fg3m / l.minutes);

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
export const runSimulation = (
  player: Player, 
  profile: PerMinuteProfile, 
  opponent: Team,
  leagueAverages: Record<StatCategory, number>
): SimulationResult[] => {
  const results: SimulationResult[] = [];

  // Phase 1: Contextual Analysis - Calculate dynamic modifiers per category
  // Safety check: ensure opponent stats exist, otherwise default to 1.0 (average)
  const getMod = (val: number | undefined, league: number) => {
    return val !== undefined ? calculateDefensiveRating(val, league) : 1.0;
  }

  const modifiers = {
    [StatCategory.PTS]: getMod(opponent.statsAllowed.PTS, leagueAverages.PTS),
    [StatCategory.REB]: getMod(opponent.statsAllowed.REB, leagueAverages.REB),
    [StatCategory.AST]: getMod(opponent.statsAllowed.AST, leagueAverages.AST),
    [StatCategory.STL]: getMod(opponent.statsAllowed.STL, leagueAverages.STL),
    [StatCategory.BLK]: getMod(opponent.statsAllowed.BLK, leagueAverages.BLK),
    [StatCategory.TOV]: getMod(opponent.statsAllowed.TOV, leagueAverages.TOV),
    [StatCategory.FG3M]: getMod(opponent.statsAllowed.FG3M, leagueAverages.FG3M),
  };

  for (let i = 0; i < SIMULATION_COUNT; i++) {
    // 1. Simulate Minutes (cannot be negative, cap at 48)
    const simMinutes = clamp(generateGaussian(profile.minutes.median, profile.minutes.stdDev), 10, 48);

    // 2. Simulate Rates
    const simPtsRate = Math.max(0, generateGaussian(profile.ptsPerMin.median, profile.ptsPerMin.stdDev));
    const simRebRate = Math.max(0, generateGaussian(profile.rebPerMin.median, profile.rebPerMin.stdDev));
    const simAstRate = Math.max(0, generateGaussian(profile.astPerMin.median, profile.astPerMin.stdDev));
    const simStlRate = Math.max(0, generateGaussian(profile.stlPerMin.median, profile.stlPerMin.stdDev));
    const simBlkRate = Math.max(0, generateGaussian(profile.blkPerMin.median, profile.blkPerMin.stdDev));
    const simTovRate = Math.max(0, generateGaussian(profile.tovPerMin.median, profile.tovPerMin.stdDev));
    const simFg3mRate = Math.max(0, generateGaussian(profile.fg3mPerMin.median, profile.fg3mPerMin.stdDev));

    // 3. Calculate Final Projections with Contextual Modifiers
    results.push({
      simId: i,
      minutes: simMinutes,
      pts: simMinutes * simPtsRate * modifiers.PTS,
      reb: simMinutes * simRebRate * modifiers.REB, 
      ast: simMinutes * simAstRate * modifiers.AST,
      stl: simMinutes * simStlRate * modifiers.STL, 
      blk: simMinutes * simBlkRate * modifiers.BLK,
      tov: simMinutes * simTovRate * modifiers.TOV, 
      fg3m: simMinutes * simFg3mRate * modifiers.FG3M,
    });
  }

  return results;
};