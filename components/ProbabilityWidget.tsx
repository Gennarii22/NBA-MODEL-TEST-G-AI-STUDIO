import React, { useState, useEffect } from 'react';
import { SimulationResult, StatCategory } from '../types';

interface ProbabilityWidgetProps {
  data: SimulationResult[];
  category: StatCategory;
  onLineChange: (line: number) => void;
}

const ProbabilityWidget: React.FC<ProbabilityWidgetProps> = ({ data, category, onLineChange }) => {
  const [line, setLine] = useState<string>('25.5');
  const [probOver, setProbOver] = useState(0);

  useEffect(() => {
    const numLine = parseFloat(line);
    if (isNaN(numLine)) return;

    onLineChange(numLine);

    const countOver = data.filter(d => d[category.toLowerCase() as keyof SimulationResult] > numLine).length;
    setProbOver((countOver / data.length) * 100);
  }, [line, data, category, onLineChange]);

  const probUnder = 100 - probOver;
  
  // Determine color based on "value" (simple heuristic: > 55% is green)
  const overColor = probOver > 55 ? 'text-emerald-400' : probOver < 45 ? 'text-rose-400' : 'text-slate-300';
  const underColor = probUnder > 55 ? 'text-emerald-400' : probUnder < 45 ? 'text-rose-400' : 'text-slate-300';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
        Probability Calculator
      </h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Market Line ({category})</label>
          <div className="relative">
            <input 
              type="number" 
              step="0.5"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 font-mono text-lg transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Over {line}</div>
              <div className={`text-2xl font-bold font-mono ${overColor}`}>{probOver.toFixed(1)}%</div>
            </div>
            {/* Progress bar background */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500" 
              style={{ width: `${probOver}%` }}
            ></div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center relative overflow-hidden">
             <div className="relative z-10">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Under {line}</div>
              <div className={`text-2xl font-bold font-mono ${underColor}`}>{probUnder.toFixed(1)}%</div>
            </div>
             <div 
              className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500" 
              style={{ width: `${probUnder}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityWidget;