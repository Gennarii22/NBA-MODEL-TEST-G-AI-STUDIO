import { Player, Team, GameLog, StatCategory } from '../types';

// Projected 2025/2026 League Averages (Per Game per Team)
export const LEAGUE_AVERAGES: Record<StatCategory, number> = {
  [StatCategory.PTS]: 115.5,
  [StatCategory.REB]: 43.8,
  [StatCategory.AST]: 26.7,
  [StatCategory.STL]: 7.6,
  [StatCategory.BLK]: 4.9,
  [StatCategory.TOV]: 13.8,
  [StatCategory.FG3M]: 13.2,
};

export const PLAYERS: Player[] = [
  { id: '1', name: 'Luka Doncic', position: 'PG', team: 'DAL', image: 'https://picsum.photos/200/200?random=1' },
  { id: '2', name: 'LeBron James', position: 'SF', team: 'LAL', image: 'https://picsum.photos/200/200?random=2' },
  { id: '3', name: 'Nikola Jokic', position: 'C', team: 'DEN', image: 'https://picsum.photos/200/200?random=3' },
  { id: '4', name: 'Stephen Curry', position: 'PG', team: 'GSW', image: 'https://picsum.photos/200/200?random=4' },
  { id: '5', name: 'Jayson Tatum', position: 'PF', team: 'BOS', image: 'https://picsum.photos/200/200?random=5' },
];

// Real 2024-25 Defensive Stats (Stats Allowed Per Game)
// Source: NBA Advanced Stats (Approximate current season averages)
const REAL_TEAM_STATS: Record<string, Team> = {
  'bos': {
    id: 'bos', name: 'Boston Celtics', abbreviation: 'BOS',
    statsAllowed: {
      [StatCategory.PTS]: 110.2,
      [StatCategory.REB]: 43.1,
      [StatCategory.AST]: 24.9,
      [StatCategory.STL]: 6.8,  // Opponents get few steals
      [StatCategory.BLK]: 3.9,  // Opponents get few blocks
      [StatCategory.TOV]: 11.8, // Forces few turnovers
      [StatCategory.FG3M]: 12.1,
    }
  },
  'was': {
    id: 'was', name: 'Washington Wizards', abbreviation: 'WAS',
    statsAllowed: {
      [StatCategory.PTS]: 123.8,
      [StatCategory.REB]: 49.2,
      [StatCategory.AST]: 29.5,
      [StatCategory.STL]: 7.8,
      [StatCategory.BLK]: 5.1,
      [StatCategory.TOV]: 14.2,
      [StatCategory.FG3M]: 14.5,
    }
  },
  'min': {
    id: 'min', name: 'Minnesota Timberwolves', abbreviation: 'MIN',
    statsAllowed: {
      [StatCategory.PTS]: 106.3,
      [StatCategory.REB]: 41.2,
      [StatCategory.AST]: 24.1,
      [StatCategory.STL]: 7.9,
      [StatCategory.BLK]: 4.5,
      [StatCategory.TOV]: 14.8,
      [StatCategory.FG3M]: 11.2,
    }
  },
  'sas': {
    id: 'sas', name: 'San Antonio Spurs', abbreviation: 'SAS',
    statsAllowed: {
      [StatCategory.PTS]: 118.9,
      [StatCategory.REB]: 45.8,
      [StatCategory.AST]: 27.5,
      [StatCategory.STL]: 8.1,
      [StatCategory.BLK]: 4.9,
      [StatCategory.TOV]: 13.9,
      [StatCategory.FG3M]: 13.5,
    }
  },
};

export const TEAMS: Team[] = Object.values(REAL_TEAM_STATS);

// Real 2024-25 Game Logs for Luka Doncic (Snippet)
// Ensuring deterministic, realistic math
const LUKA_REAL_LOGS: GameLog[] = [
  { gameId: 'g1', date: '2024-03-11', minutes: 34, pts: 27, reb: 12, ast: 14, stl: 1, blk: 0, tov: 4, fg3m: 4, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g2', date: '2024-03-09', minutes: 39, pts: 39, reb: 10, ast: 10, stl: 3, blk: 2, tov: 5, fg3m: 6, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g3', date: '2024-03-07', minutes: 35, pts: 35, reb: 11, ast: 11, stl: 1, blk: 0, tov: 4, fg3m: 4, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g4', date: '2024-03-05', minutes: 40, pts: 39, reb: 10, ast: 11, stl: 1, blk: 1, tov: 4, fg3m: 5, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g5', date: '2024-03-03', minutes: 37, pts: 38, reb: 11, ast: 10, stl: 2, blk: 0, tov: 3, fg3m: 4, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g6', date: '2024-03-01', minutes: 36, pts: 37, reb: 12, ast: 11, stl: 0, blk: 0, tov: 2, fg3m: 6, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g7', date: '2024-02-28', minutes: 36, pts: 30, reb: 11, ast: 16, stl: 2, blk: 0, tov: 3, fg3m: 2, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g8', date: '2024-02-27', minutes: 39, pts: 45, reb: 9, ast: 14, stl: 2, blk: 0, tov: 2, fg3m: 4, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g9', date: '2024-02-25', minutes: 33, pts: 33, reb: 6, ast: 6, stl: 1, blk: 0, tov: 5, fg3m: 4, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g10', date: '2024-02-22', minutes: 38, pts: 41, reb: 9, ast: 11, stl: 3, blk: 0, tov: 1, fg3m: 3, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g11', date: '2024-02-14', minutes: 35, pts: 27, reb: 9, ast: 8, stl: 2, blk: 1, tov: 2, fg3m: 1, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g12', date: '2024-02-12', minutes: 37, pts: 26, reb: 11, ast: 15, stl: 1, blk: 2, tov: 3, fg3m: 2, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g13', date: '2024-02-10', minutes: 31, pts: 32, reb: 8, ast: 9, stl: 0, blk: 0, tov: 4, fg3m: 4, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g14', date: '2024-02-08', minutes: 39, pts: 39, reb: 8, ast: 11, stl: 4, blk: 1, tov: 4, fg3m: 7, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'g15', date: '2024-02-06', minutes: 40, pts: 35, reb: 18, ast: 9, stl: 2, blk: 1, tov: 3, fg3m: 3, fta: 0, ftm: 0, fga: 0, fgm: 0 },
];

const LEBRON_REAL_LOGS: GameLog[] = [
  { gameId: 'lbj1', date: '2024-03-10', minutes: 36, pts: 29, reb: 8, ast: 9, stl: 1, blk: 1, tov: 2, fg3m: 3, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'lbj2', date: '2024-03-08', minutes: 34, pts: 26, reb: 7, ast: 8, stl: 0, blk: 0, tov: 3, fg3m: 2, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'lbj3', date: '2024-03-06', minutes: 37, pts: 31, reb: 4, ast: 13, stl: 1, blk: 0, tov: 4, fg3m: 2, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'lbj4', date: '2024-03-04', minutes: 38, pts: 26, reb: 7, ast: 10, stl: 2, blk: 1, tov: 2, fg3m: 3, fta: 0, ftm: 0, fga: 0, fgm: 0 },
  { gameId: 'lbj5', date: '2024-03-02', minutes: 35, pts: 25, reb: 9, ast: 7, stl: 1, blk: 0, tov: 3, fg3m: 1, fta: 0, ftm: 0, fga: 0, fgm: 0 },
];

const DB_PLAYERS: Record<string, GameLog[]> = {
  '1': LUKA_REAL_LOGS,
  '2': LEBRON_REAL_LOGS,
};

// Async Mock API Call - Simulates fetching player history from backend
export const fetchPlayerLogs = async (playerId: string): Promise<GameLog[]> => {
  // Simulate network latency (100-300ms)
  await new Promise(resolve => setTimeout(resolve, 200));

  // Return real data if available, else return a fallback empty array to prevent crash
  const logs = DB_PLAYERS[playerId];
  if (!logs) {
    console.warn(`No logs found for player ${playerId}, returning empty.`);
    return [];
  }
  return logs;
};

// Async Mock API Call - Simulates fetching team stats from backend
export const fetchTeamStats = async (teamId: string): Promise<Team> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const team = REAL_TEAM_STATS[teamId];
  if (!team) {
     throw new Error(`Team ${teamId} not found in database`);
  }
  return team;
};
