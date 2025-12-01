import React from 'react';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, trend, color = "text-white" }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</span>
        {trend === 'up' && <ArrowUp className="w-4 h-4 text-emerald-400" />}
        {trend === 'down' && <ArrowDown className="w-4 h-4 text-rose-400" />}
        {trend === 'neutral' && <Activity className="w-4 h-4 text-slate-500" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${color} font-mono`}>{value.toFixed(1)}</span>
        {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
      </div>
    </div>
  );
};

export default StatCard;