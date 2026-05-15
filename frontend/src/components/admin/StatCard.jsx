import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const colorStyles = {
    blue: 'bg-slate-50 text-primary-600',
    green: 'bg-slate-50 text-success-500',
    amber: 'bg-slate-50 text-warning-500',
    red: 'bg-slate-50 text-error-500',
    purple: 'bg-slate-50 text-primary-700',
    cyan: 'bg-slate-50 text-primary-500',
    slate: 'bg-slate-50 text-slate-600',
  };

  return (
    <div className="card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded ${colorStyles[color] || colorStyles.blue} border border-slate-100`}>
          {Icon ? React.createElement(Icon, { size: 20 }) : null}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold ${trend > 0 ? 'text-success-500' : 'text-error-500'}`}>
            {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
