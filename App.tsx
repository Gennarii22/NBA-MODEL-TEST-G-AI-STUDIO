import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  ChevronDown, 
  Trophy,
  Target,
  ShieldAlert
} from 'lucide-react';
import { PLAYERS, TEAMS, getPlayerLogs } from './services/dataService';
import { createPlayerProfile, runSimulation } from './services/simulationEngine';
import { Player, Team, SimulationResult, StatCategory } from './types';
import StatCard from './components/StatCard';
import DistributionChart from './components/DistributionChart';
import ProbabilityWidget from './components/ProbabilityWidget';

function App() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(PLAYERS[0].id);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(TEAMS[0].id);
  const [simulationData, setSimulationData] = useState<SimulationResult[]>([]);
  const [activeCategory, setActiveCategory] = useState<StatCategory>(StatCategory.PTS);
  const [bettingLine, setBettingLine] = useState<number>(25.5);

  const selectedPlayer = PLAYERS.find(p => p.id === selectedPlayerId)!;
  const selectedOpponent = TEAMS.find(t => t.id === selectedTeamId)!;

  // Run Simulation when inputs change
  useEffect(() => {
    const logs = getPlayerLogs(selectedPlayerId);
    const profile = createPlayerProfile(logs);
    const results = runSimulation(selectedPlayer, profile, selectedOpponent);
    setSimulationData(results);
    
    // Reset category default line when player changes
    if (activeCategory === StatCategory.PTS) setBettingLine(25.5);
  }, [selectedPlayerId, selectedTeamId]); // Intentionally omitting activeCategory to keep data stable

  // Calculate Aggregates from Simulation
  const stats = useMemo(() => {
    if (simulationData.length === 0) return null;
    
    const mean = (key: keyof SimulationResult) => 
      simulationData.reduce((acc, curr) => acc + curr[key], 0) / simulationData.length;

    return {
      pts: mean('pts'),
      reb: mean('reb'),
      ast: mean('ast'),
      fg3m: mean('fg3m'),
      minutes: mean('minutes'),
    };
  }, [simulationData]);

  // Determine Defensive Context Color
  const getDefRating = () => {
    let rating = selectedOpponent.defensiveRating.overall;
    // Simple mapping for display
    if (selectedPlayer.position === 'PG') rating = selectedOpponent.defensiveRating.vsPG;
    if (selectedPlayer.position === 'SG') rating = selectedOpponent.defensiveRating.vsSG;
    if (selectedPlayer.position === 'SF') rating = selectedOpponent.defensiveRating.vsSF;
    if (selectedPlayer.position === 'PF') rating = selectedOpponent.defensiveRating.vsPF;
    if (selectedPlayer.position === 'C') rating = selectedOpponent.defensiveRating.vsC;
    return rating;
  };
  
  const defRating = getDefRating();
  const matchupStatus = defRating > 1.05 ? 'Favorable' : defRating < 0.95 ? 'Tough' : 'Neutral';
  const matchupColor = defRating > 1.05 ? 'text-emerald-400' : defRating < 0.95 ? 'text-rose-400' : 'text-yellow-400';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Court<span className="text-emerald-400">Vision</span> AI</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span className="hidden sm:inline">v2.0 Model Architecture</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="flex items-center gap-1 text-emerald-400"><Target className="w-4 h-4" /> 94% Reliability</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Controls Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          
          {/* Player Select */}
          <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Select Player</label>
            <div className="relative">
              <select 
                value={selectedPlayerId} 
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                {PLAYERS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.team}) - {p.position}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="mt-4 flex items-center gap-3">
              <img src={selectedPlayer.image} alt={selectedPlayer.name} className="w-12 h-12 rounded-full border-2 border-slate-700" />
              <div>
                <div className="font-bold text-white">{selectedPlayer.name}</div>
                <div className="text-xs text-slate-400">{selectedPlayer.team} • {selectedPlayer.position}</div>
              </div>
            </div>
          </div>

          {/* Opponent Select */}
          <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Select Opponent</label>
            <div className="relative">
              <select 
                value={selectedTeamId} 
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                {TEAMS.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.abbreviation})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            <div className="mt-4 flex items-center justify-between bg-slate-800 rounded-lg p-3">
               <div className="flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-slate-400" />
                 <div>
                   <div className="text-xs text-slate-400 uppercase font-bold">Def Rating vs {selectedPlayer.position}</div>
                   <div className={`font-mono font-bold ${matchupColor}`}>{defRating.toFixed(2)}</div>
                 </div>
               </div>
               <div className={`text-xs font-bold uppercase px-2 py-1 rounded bg-slate-900 ${matchupColor}`}>
                 {matchupStatus} Matchup
               </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="md:col-span-4 flex flex-col justify-center bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-900/50 rounded-xl p-6">
            <h2 className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Projected Performance
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Based on 1,000 Monte Carlo simulations using {selectedPlayer.name}'s per-minute volatility profile adjusted for {selectedOpponent.name}'s defensive efficiency against {selectedPlayer.position}s.
            </p>
          </div>
        </section>

        {/* Projections Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Projected Averages</h3>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              {[StatCategory.PTS, StatCategory.REB, StatCategory.AST].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeCategory === cat 
                      ? 'bg-emerald-500 text-slate-900 shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              label="Points" 
              value={stats?.pts || 0} 
              trend={defRating > 1 ? 'up' : 'down'}
              color={activeCategory === StatCategory.PTS ? 'text-emerald-400' : 'text-white'}
            />
            <StatCard 
              label="Rebounds" 
              value={stats?.reb || 0} 
              color={activeCategory === StatCategory.REB ? 'text-emerald-400' : 'text-white'}
            />
            <StatCard 
              label="Assists" 
              value={stats?.ast || 0} 
              color={activeCategory === StatCategory.AST ? 'text-emerald-400' : 'text-white'}
            />
            <StatCard 
              label="3PM" 
              value={stats?.fg3m || 0} 
            />
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <div className="lg:col-span-2">
            <DistributionChart 
              data={simulationData} 
              category={activeCategory} 
              bettingLine={bettingLine}
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs font-bold uppercase">Floor (10%)</div>
                <div className="text-white font-mono text-lg">
                  {simulationData.length > 0 
                    ? [...simulationData].sort((a,b) => a[activeCategory.toLowerCase() as keyof SimulationResult] - b[activeCategory.toLowerCase() as keyof SimulationResult])[100][activeCategory.toLowerCase() as keyof SimulationResult].toFixed(1)
                    : '-'}
                </div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs font-bold uppercase">Ceiling (90%)</div>
                <div className="text-white font-mono text-lg">
                  {simulationData.length > 0 
                    ? [...simulationData].sort((a,b) => a[activeCategory.toLowerCase() as keyof SimulationResult] - b[activeCategory.toLowerCase() as keyof SimulationResult])[900][activeCategory.toLowerCase() as keyof SimulationResult].toFixed(1)
                    : '-'}
                </div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs font-bold uppercase">Avg Mins</div>
                <div className="text-white font-mono text-lg">{stats?.minutes.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:col-span-1">
            <ProbabilityWidget 
              data={simulationData} 
              category={activeCategory}
              onLineChange={setBettingLine}
            />
            
            <div className="mt-6 p-4 bg-slate-900/30 rounded-lg border border-slate-800">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-emerald-400 mt-1" />
                <div className="text-sm text-slate-400">
                  <span className="text-slate-300 font-bold block mb-1">Model Insight</span>
                  {selectedPlayer.name} has exceeded this line in <span className="text-white font-bold">{(simulationData.filter(d => d[activeCategory.toLowerCase() as keyof SimulationResult] > bettingLine).length / 10).toFixed(1)}%</span> of simulated scenarios against {selectedOpponent.abbreviation}.
                </div>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;