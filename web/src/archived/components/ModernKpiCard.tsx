import React from 'react';

interface ModernKpiCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/10'
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
    border: 'border-green-500/20',
    icon: 'bg-gradient-to-br from-green-500 to-green-600',
    text: 'text-green-400',
    glow: 'shadow-green-500/10'
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5',
    border: 'border-yellow-500/20',
    icon: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/10'
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500/10 to-red-600/5',
    border: 'border-red-500/20',
    icon: 'bg-gradient-to-br from-red-500 to-red-600',
    text: 'text-red-400',
    glow: 'shadow-red-500/10'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
    icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/10'
  },
  gray: {
    bg: 'bg-gradient-to-br from-slate-500/10 to-slate-600/5',
    border: 'border-slate-500/20',
    icon: 'bg-gradient-to-br from-slate-500 to-slate-600',
    text: 'text-slate-400',
    glow: 'shadow-slate-500/10'
  },
};

export const ModernKpiCard: React.FC<ModernKpiCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
  trend,
}) => {
  const colors = colorClasses[color];
  
  return (
    <div className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${colors.bg} ${colors.border} ${colors.glow}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
      </div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend.isPositive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <svg className={`w-3 h-3 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {trend.value}%
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
            )}
          </div>
          
          {icon && (
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${colors.icon}`}>
              <div className="text-white text-xl">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r ${colors.icon} transition-all duration-1000 group-hover:w-full`} 
               style={{ width: '65%' }}></div>
        </div>
      </div>
    </div>
  );
};
