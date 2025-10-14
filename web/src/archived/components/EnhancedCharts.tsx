import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, Area, AreaChart
} from 'recharts';

interface EnhancedChartsProps {
  statusData: Array<{ status: string; count: number }>;
  ownerData: Array<{ owner: string; count: number }>;
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  'Open': '#3b82f6',
  'In Progress': '#f59e0b',
  'Review': '#8b5cf6',
  'On Hold': '#6b7280',
  'Blocked': '#ef4444',
  'Done': '#10b981',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium">{label}</p>
        <p className="text-blue-400">
          {`تعداد: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-blue-400">
          {`تعداد: ${data.value}`}
        </p>
        <p className="text-slate-400 text-sm">
          {`درصد: ${((data.value / data.payload.total) * 100).toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

export const EnhancedCharts: React.FC<EnhancedChartsProps> = ({ 
  statusData, 
  ownerData, 
  loading = false 
}) => {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const topOwners = ownerData.slice(0, 6);
  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  // Add total to each status for percentage calculation
  const totalStatus = statusData.reduce((sum, item) => sum + item.count, 0);
  const statusDataWithTotal = statusData.map(item => ({
    ...item,
    total: totalStatus,
    percentage: ((item.count / totalStatus) * 100).toFixed(1)
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-slate-700 rounded"></div>
              <div className="h-5 bg-slate-700 rounded w-32"></div>
            </div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 group hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
            <div>
              <h3 className="text-heading-3 text-white">توزیع وضعیت‌ها</h3>
              <p className="text-caption text-slate-400">نمای کلی وضعیت تسک‌ها</p>
            </div>
          </div>
          
          <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveChart('pie')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeChart === 'pie' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              دایره‌ای
            </button>
            <button
              onClick={() => setActiveChart('bar')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeChart === 'bar' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ستونی
            </button>
          </div>
        </div>
        
        <div className="h-64">
          {activeChart === 'pie' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDataWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  onMouseEnter={(data) => setHoveredItem(data.status)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {statusDataWithTotal.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={statusColors[entry.status] || pieColors[index % pieColors.length]}
                      stroke={hoveredItem === entry.status ? '#ffffff' : 'transparent'}
                      strokeWidth={hoveredItem === entry.status ? 2 : 0}
                      style={{ 
                        filter: hoveredItem === entry.status ? 'brightness(1.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDataWithTotal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(data) => setHoveredItem(data.status)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {statusDataWithTotal.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={statusColors[entry.status] || pieColors[index % pieColors.length]}
                      style={{ 
                        filter: hoveredItem === entry.status ? 'brightness(1.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">
          {statusDataWithTotal.map((entry, index) => (
            <div 
              key={entry.status} 
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                hoveredItem === entry.status ? 'bg-white/5' : ''
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full transition-all duration-200" 
                style={{ 
                  backgroundColor: statusColors[entry.status] || pieColors[index % pieColors.length],
                  transform: hoveredItem === entry.status ? 'scale(1.2)' : 'scale(1)'
                }}
              ></div>
              <span className="text-body-small text-slate-300 flex-1">{entry.status}</span>
              <span className="text-caption text-slate-400">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 group hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">👥</span>
          </div>
          <div>
            <h3 className="text-heading-3 text-white">برترین مشارکت‌کنندگان</h3>
            <p className="text-caption text-slate-400">توزیع تسک‌ها بر اساس مالک</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topOwners} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="owner" 
                type="category" 
                width={100} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={{ stroke: '#475569' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                onMouseEnter={(data) => setHoveredItem(data.owner)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {topOwners.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#barGradient${index})`}
                    style={{ 
                      filter: hoveredItem === entry.owner ? 'brightness(1.2)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Bar>
              <defs>
                {topOwners.map((_, index) => (
                  <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={pieColors[index % pieColors.length]} />
                    <stop offset="100%" stopColor={pieColors[(index + 1) % pieColors.length]} />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-heading-3 text-white">{topOwners.reduce((sum, owner) => sum + owner.count, 0)}</div>
            <div className="text-caption text-slate-400">کل تسک‌ها</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-heading-3 text-white">{topOwners.length}</div>
            <div className="text-caption text-slate-400">مشارکت‌کننده فعال</div>
          </div>
        </div>
      </div>
    </div>
  );
};
