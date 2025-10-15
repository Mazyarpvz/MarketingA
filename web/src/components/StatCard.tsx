import React from 'react';
import { LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  gradient?: string;
  onClick?: () => void;
  loading?: boolean;
  description?: string;
}

const gradientPresets = {
  blue: 'from-blue-600 via-blue-500 to-indigo-600',
  green: 'from-green-600 via-emerald-500 to-teal-600',
  purple: 'from-purple-600 via-violet-500 to-indigo-600',
  pink: 'from-pink-600 via-rose-500 to-red-600',
  yellow: 'from-yellow-600 via-amber-500 to-orange-600',
  cyan: 'from-cyan-600 via-sky-500 to-blue-600',
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change,
  color = 'blue',
  gradient = gradientPresets.blue,
  onClick,
  loading = false,
  description
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
      toast.success(`جزئیات ${title} نمایش داده شد`, { icon: '📊', duration: 2000 });
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        group relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        rounded-2xl p-7
        border-2 border-white/10
        transition-all duration-500 ease-out
        hover:border-white/30
        hover:-translate-y-2 hover:scale-[1.02]
        hover:shadow-2xl hover:shadow-${color}-500/20
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Decorative Circle */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          {/* Icon Container */}
          <div className={`
            relative
            w-14 h-14 
            bg-gradient-to-br ${gradient}
            rounded-2xl 
            flex items-center justify-center
            shadow-lg shadow-${color}-500/30
            transition-all duration-500
            group-hover:scale-110 group-hover:rotate-6
            transform-gpu
          `}>
            <Icon className="w-7 h-7 text-white drop-shadow-lg" />
            
            {/* Pulse Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl animate-ping opacity-20`} />
          </div>

          {/* Change Indicator */}
          {change && (
            <div className={`
              flex items-center gap-1.5
              px-3 py-1.5 
              rounded-full
              text-xs font-bold
              backdrop-blur-sm
              transition-all duration-300
              hover:scale-105
              ${change.isPositive 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }
            `}>
              <span className="text-base">{change.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            {title}
          </p>
          
          {loading ? (
            <div className="space-y-2">
              <div className="h-10 w-32 bg-white/10 animate-pulse rounded-lg" />
              {description && <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />}
            </div>
          ) : (
            <>
              <p className="text-4xl font-black text-white leading-none transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">
                {value}
              </p>
              
              {description && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Shine Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
      
      {/* Corner Accent */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-br-full" />
    </div>
  );
};
