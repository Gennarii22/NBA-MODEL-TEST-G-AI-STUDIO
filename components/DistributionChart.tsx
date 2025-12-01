import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SimulationResult, StatCategory } from '../types';

interface DistributionChartProps {
  data: SimulationResult[];
  category: StatCategory;
  bettingLine?: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, category, bettingLine }) => {
  const chartData = useMemo(() => {
    // Create a histogram/frequency distribution
    const values = data.map(d => d[category.toLowerCase() as keyof SimulationResult]);
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    const binCount = 20;
    const binSize = (max - min) / binCount;
    
    const bins = Array.from({ length: binCount }, (_, i) => {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      return {
        range: Math.floor(binStart + binSize / 2), // Label as center of bin
        count: 0,
        fullRange: `${binStart.toFixed(1)} - ${binEnd.toFixed(1)}`
      };
    });

    values.forEach(v => {
      const binIndex = Math.min(
        Math.floor((v - min) / binSize),
        binCount - 1
      );
      if (binIndex >= 0) bins[binIndex].count++;
    });

    return bins;
  }, [data, category]);

  return (
    <div className="w-full h-64 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
      <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
        Monte Carlo Distribution: {category}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="range" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
            itemStyle={{ color: '#10b981' }}
            cursor={{ stroke: '#334155', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
          {bettingLine !== undefined && (
            <ReferenceLine 
              x={bettingLine} 
              stroke="#ef4444" 
              strokeDasharray="3 3"
              label={{ position: 'top', value: 'Line', fill: '#ef4444', fontSize: 10 }} 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;