import React from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'indigo' | 'pink' | 'teal';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-600/20 to-blue-800/20',
    border: 'border-blue-500/50',
    text: 'text-blue-300',
    glow: 'hover:shadow-blue-500/30',
    icon: 'text-blue-400'
  },
  green: {
    bg: 'from-green-600/20 to-emerald-800/20',
    border: 'border-green-500/50',
    text: 'text-green-300',
    glow: 'hover:shadow-green-500/30',
    icon: 'text-green-400'
  },
  yellow: {
    bg: 'from-yellow-600/20 to-amber-800/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-300',
    glow: 'hover:shadow-yellow-500/30',
    icon: 'text-yellow-400'
  },
  red: {
    bg: 'from-red-600/20 to-rose-800/20',
    border: 'border-red-500/50',
    text: 'text-red-300',
    glow: 'hover:shadow-red-500/30',
    icon: 'text-red-400'
  },
  purple: {
    bg: 'from-purple-600/20 to-violet-800/20',
    border: 'border-purple-500/50',
    text: 'text-purple-300',
    glow: 'hover:shadow-purple-500/30',
    icon: 'text-purple-400'
  },
  indigo: {
    bg: 'from-indigo-600/20 to-indigo-800/20',
    border: 'border-indigo-500/50',
    text: 'text-indigo-300',
    glow: 'hover:shadow-indigo-500/30',
    icon: 'text-indigo-400'
  },
  pink: {
    bg: 'from-pink-600/20 to-rose-800/20',
    border: 'border-pink-500/50',
    text: 'text-pink-300',
    glow: 'hover:shadow-pink-500/30',
    icon: 'text-pink-400'
  },
  teal: {
    bg: 'from-teal-600/20 to-cyan-800/20',
    border: 'border-teal-500/50',
    text: 'text-teal-300',
    glow: 'hover:shadow-teal-500/30',
    icon: 'text-teal-400'
  },
  gray: {
    bg: 'from-slate-700/20 to-slate-900/20',
    border: 'border-slate-500/50',
    text: 'text-slate-300',
    glow: 'hover:shadow-slate-500/30',
    icon: 'text-slate-400'
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
  trend,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      import('react-hot-toast').then(({ default: toast }) => {
        toast(
          <div className="text-right">
            <div className="font-bold mb-1">جزئیات KPI</div>
            <div className="text-sm">{title}: <span className="font-bold">{value}</span></div>
            {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
          </div>,
          { icon: '📊', duration: 3500 }
        );
      });
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`
        group relative overflow-hidden
        bg-gradient-to-br ${colors.bg}
        backdrop-blur-xl
        rounded-2xl shadow-xl
        border-2 ${colors.border}
        p-6
        transition-all duration-500 ease-out
        hover:-translate-y-2 hover:scale-[1.02]
        hover:shadow-2xl ${colors.glow}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      role="article"
      aria-label={`${title}: ${value}`}
      onClick={handleClick}
      tabIndex={0}
      onKeyPress={e => (e.key === 'Enter' ? handleClick() : undefined)}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold opacity-80 tracking-wide uppercase">
            {title}
          </p>
          
          <div className="flex items-baseline gap-3">
            <p className={`text-4xl font-black ${colors.text} transition-all duration-300 group-hover:scale-110 transform-gpu`}>
              {value}
            </p>
            
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                trend.isPositive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {subtitle && (
            <p className="text-xs opacity-70 mt-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className={`
            ${colors.icon} 
            text-5xl opacity-40
            transition-all duration-500
            group-hover:opacity-100 
            group-hover:scale-125 
            group-hover:rotate-12
            transform-gpu
          `}>
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Shine Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  );
};
