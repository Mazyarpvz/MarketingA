import React from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  subtitle?: string;
}

const colorClasses = {
  blue: 'bg-blue-900 border-blue-700 text-blue-300',
  green: 'bg-green-900 border-green-700 text-green-300',
  yellow: 'bg-yellow-900 border-yellow-700 text-yellow-300',
  red: 'bg-red-900 border-red-700 text-red-300',
  purple: 'bg-purple-900 border-purple-700 text-purple-300',
  gray: 'bg-slate-800 border-slate-600 text-slate-300',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
}) => {
  return (
    <div className={`card border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-60">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
