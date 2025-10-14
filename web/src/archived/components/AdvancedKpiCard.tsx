import React, { useState, useEffect } from 'react';

interface AdvancedKpiCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
  delay?: number;
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    accent: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
    border: 'border-green-500/20',
    text: 'text-green-400',
    accent: 'from-green-500 to-green-600',
    glow: 'shadow-green-500/20',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    accent: 'from-yellow-500 to-yellow-600',
    glow: 'shadow-yellow-500/20',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500/10 to-red-600/5',
    border: 'border-red-500/20',
    text: 'text-red-400',
    accent: 'from-red-500 to-red-600',
    glow: 'shadow-red-500/20',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    accent: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/20',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    accent: 'from-indigo-500 to-indigo-600',
    glow: 'shadow-indigo-500/20',
  },
};

export const AdvancedKpiCard: React.FC<AdvancedKpiCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
  trend,
  loading = false,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedValue(typeof value === 'number' ? value : parseFloat(value) || 0);
    }
  }, [isVisible, value]);

  const colors = colorClasses[color];

  if (loading) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
              <div className="h-4 bg-slate-700 rounded w-24"></div>
            </div>
            <div className="h-8 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
      ${colors.bg} ${colors.border}
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl shadow-lg ${colors.glow} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`
                w-10 h-10 rounded-xl bg-gradient-to-br ${colors.accent} flex items-center justify-center
                shadow-lg group-hover:scale-110 transition-transform duration-300
              `}>
                <span className="text-white text-lg">{icon}</span>
              </div>
              <h3 className="text-body-small font-medium text-slate-300 group-hover:text-white transition-colors">
                {title}
              </h3>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
              {typeof value === 'number' ? animatedValue.toLocaleString('fa-IR') : value}
            </div>
            
            {subtitle && (
              <p className="text-caption text-slate-400 group-hover:text-slate-300 transition-colors">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <div className={`
                  flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  ${trend.direction === 'up' ? 'bg-green-500/20 text-green-400' : 
                    trend.direction === 'down' ? 'bg-red-500/20 text-red-400' : 
                    'bg-slate-500/20 text-slate-400'}
                `}>
                  {trend.direction === 'up' && <span>↗</span>}
                  {trend.direction === 'down' && <span>↘</span>}
                  {trend.direction === 'neutral' && <span>→</span>}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className={`
        absolute inset-0 rounded-2xl border-2 border-transparent
        bg-gradient-to-r ${colors.accent} opacity-0 group-hover:opacity-20
        transition-opacity duration-500
      `} style={{
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'xor',
        WebkitMaskComposite: 'xor',
      }}></div>
    </div>
  );
};
