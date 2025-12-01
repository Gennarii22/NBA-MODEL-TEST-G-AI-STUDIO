import React from 'react';
import { StatCategory } from '../types';
import { X, Save, RotateCcw } from 'lucide-react';
import { LEAGUE_AVERAGES } from '../services/dataService';

interface LeagueSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  averages: Record<StatCategory, number>;
  onUpdate: (newAverages: Record<StatCategory, number>) => void;
}

const LeagueSettings: React.FC<LeagueSettingsProps> = ({ isOpen, onClose, averages, onUpdate }) => {
  if (!isOpen) return null;

  const handleChange = (category: StatCategory, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      onUpdate({
        ...averages,
        [category]: num
      });
    }
  };

  const handleReset = () => {
    onUpdate({ ...LEAGUE_AVERAGES });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-white font-bold flex items-center gap-2">
            Configure League Benchmarks
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400 mb-4">
            Adjust the 2025/2026 projected league averages. These values serve as the baseline for calculating opponent defensive ratings.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(averages).map((key) => {
              const cat = key as StatCategory;
              return (
                <div key={cat} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">{cat} (Per Game)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={averages[cat]}
                    onChange={(e) => handleChange(cat, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 font-mono text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-between">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors px-3 py-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeagueSettings;