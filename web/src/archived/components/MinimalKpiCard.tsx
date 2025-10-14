import React from 'react';

interface MinimalKpiCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  subtitle?: string;
}

const colorClasses = {
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  green: 'bg-green-500/10 border-green-500/20 text-green-400',
  yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  red: 'bg-red-500/10 border-red-500/20 text-red-400',
};

export const MinimalKpiCard: React.FC<MinimalKpiCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
}) => {
  return (
    <div className={`
      group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
      ${colorClasses[color]}
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-sm font-medium text-slate-300">{title}</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{value}</div>
            {subtitle && (
              <p className="text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
