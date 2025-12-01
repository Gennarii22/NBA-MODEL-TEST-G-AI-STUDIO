import { Player, Team, GameLog } from '../types';

export const PLAYERS: Player[] = [
  { id: '1', name: 'Luka Doncic', position: 'PG', team: 'DAL', image: 'https://picsum.photos/200/200?random=1' },
  { id: '2', name: 'LeBron James', position: 'SF', team: 'LAL', image: 'https://picsum.photos/200/200?random=2' },
  { id: '3', name: 'Nikola Jokic', position: 'C', team: 'DEN', image: 'https://picsum.photos/200/200?random=3' },
  { id: '4', name: 'Stephen Curry', position: 'PG', team: 'GSW', image: 'https://picsum.photos/200/200?random=4' },
  { id: '5', name: 'Jayson Tatum', position: 'PF', team: 'BOS', image: 'https://picsum.photos/200/200?random=5' },
];

export const TEAMS: Team[] = [
  {
    id: 'bos', name: 'Boston Celtics', abbreviation: 'BOS',
    defensiveRating: { overall: 0.95, vsPG: 0.92, vsSG: 0.94, vsSF: 0.96, vsPF: 0.98, vsC: 0.99 }
  },
  {
    id: 'was', name: 'Washington Wizards', abbreviation: 'WAS',
    defensiveRating: { overall: 1.15, vsPG: 1.12, vsSG: 1.14, vsSF: 1.18, vsPF: 1.16, vsC: 1.15 }
  },
  {
    id: 'min', name: 'Minnesota Timberwolves', abbreviation: 'MIN',
    defensiveRating: { overall: 0.92, vsPG: 0.95, vsSG: 0.93, vsSF: 0.90, vsPF: 0.92, vsC: 0.88 }
  },
  {
    id: 'sas', name: 'San Antonio Spurs', abbreviation: 'SAS',
    defensiveRating: { overall: 1.10, vsPG: 1.08, vsSG: 1.12, vsSF: 1.10, vsPF: 1.09, vsC: 1.11 }
  },
];

// Helper to generate realistic-ish logs
const generateLogs = (playerId: string): GameLog[] => {
  const logs: GameLog[] = [];
  // Random variance base
  const baseMinutes = playerId === '1' ? 36 : 34;
  
  for (let i = 0; i < 25; i++) {
    // Random minutes between base-5 and base+4, or blowout (28)
    let min = baseMinutes + (Math.random() * 10 - 5);
    if (Math.random() > 0.9) min = 28; // Blowout scenario

    // Base efficiency stats
    const ptsFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 efficiency
    
    logs.push({
      gameId: `g-${i}`,
      date: new Date(2023, 10, i + 1).toISOString(),
      minutes: min,
      pts: Math.floor(min * ptsFactor * (playerId === '1' ? 0.9 : 0.75) * 1.5), // Scale for Luka vs others
      reb: Math.floor(min * 0.25 + Math.random() * 5),
      ast: Math.floor(min * 0.25 + Math.random() * 4),
      stl: Math.floor(Math.random() * 3),
      blk: Math.floor(Math.random() * 2),
      tov: Math.floor(Math.random() * 5),
      fg3m: Math.floor(Math.random() * 5),
      fta: 0, ftm: 0, fga: 0, fgm: 0 // Not using these for the simplified model currently
    });
  }
  return logs;
};

// Simple cache for logs
const LOGS_CACHE: Record<string, GameLog[]> = {};

export const getPlayerLogs = (playerId: string): GameLog[] => {
  if (!LOGS_CACHE[playerId]) {
    LOGS_CACHE[playerId] = generateLogs(playerId);
  }
  return LOGS_CACHE[playerId];
};