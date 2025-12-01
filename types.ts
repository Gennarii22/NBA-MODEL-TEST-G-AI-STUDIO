export enum StatCategory {
  PTS = 'PTS',
  REB = 'REB',
  AST = 'AST',
  STL = 'STL',
  BLK = 'BLK',
  TOV = 'TOV',
  FG3M = 'FG3M'
}

export interface Player {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  team: string;
  image: string;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  // Rating > 1.0 means bad defense (good for opponent), < 1.0 means elite defense
  defensiveRating: {
    overall: number;
    vsPG: number;
    vsSG: number;
    vsSF: number;
    vsPF: number;
    vsC: number;
  };
}

export interface GameLog {
  gameId: string;
  date: string;
  minutes: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fg3m: number;
  fta: number;
  ftm: number;
  fga: number;
  fgm: number;
}

// Derived per-minute stats for profiling
export interface PerMinuteProfile {
  minutes: { median: number; stdDev: number };
  ptsPerMin: { median: number; stdDev: number };
  rebPerMin: { median: number; stdDev: number };
  astPerMin: { median: number; stdDev: number };
  stlPerMin: { median: number; stdDev: number };
  blkPerMin: { median: number; stdDev: number };
  tovPerMin: { median: number; stdDev: number };
  fg3mPerMin: { median: number; stdDev: number };
}

export interface SimulationResult {
  simId: number;
  minutes: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fg3m: number;
}

export interface ProjectionSummary {
  category: StatCategory;
  projectedValue: number; // Mean of simulations
  floor: number; // 10th percentile
  ceiling: number; // 90th percentile
}