import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change }) => {
  const isPositive = change !== undefined && change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeIcon = isPositive ? '▲' : '▼';

  return (
    <div className="flex-1 min-w-[150px] bg-slate-50 rounded-lg p-4 border border-slate-200">
      <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {change !== undefined && (
        <div className={`flex items-center text-sm font-semibold mt-1 ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;