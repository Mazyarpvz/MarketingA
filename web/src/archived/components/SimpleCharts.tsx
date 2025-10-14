import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SimpleChartsProps {
  statusData: Array<{ status: string; count: number }>;
  ownerData: Array<{ owner: string; count: number }>;
}

const statusColors: Record<string, string> = {
  'Open': '#3b82f6',
  'In Progress': '#f59e0b',
  'Review': '#8b5cf6',
  'On Hold': '#6b7280',
  'Blocked': '#ef4444',
  'Done': '#10b981',
};

export const SimpleCharts: React.FC<SimpleChartsProps> = ({ statusData, ownerData }) => {
  const topOwners = ownerData.slice(0, 4);
  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-semibold text-white">توزیع وضعیت‌ها</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
            >
              {statusData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={statusColors[entry.status] || pieColors[index % pieColors.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {statusData.map((entry, index) => (
            <div key={entry.status} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: statusColors[entry.status] || pieColors[index % pieColors.length] }}
              ></div>
              <span className="text-sm text-slate-300">{entry.status}</span>
              <span className="text-sm text-slate-400">({entry.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl">👥</span>
          <h3 className="text-lg font-semibold text-white">برترین مشارکت‌کنندگان</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topOwners} layout="horizontal">
            <XAxis type="number" hide />
            <YAxis dataKey="owner" type="category" width={100} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{topOwners.reduce((sum, owner) => sum + owner.count, 0)}</div>
            <div className="text-xs text-slate-400">کل تسک‌ها</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{topOwners.length}</div>
            <div className="text-xs text-slate-400">مشارکت‌کننده فعال</div>
          </div>
        </div>
      </div>
    </div>
  );
};
