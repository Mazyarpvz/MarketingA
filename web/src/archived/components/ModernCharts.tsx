import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

interface StatusCount {
  status: string;
  count: number;
}

interface OwnerCount {
  owner: string;
  count: number;
}

interface ModernStatusChartProps {
  data: StatusCount[];
}

interface ModernOwnerChartProps {
  data: OwnerCount[];
}

const statusColors = {
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
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-200 font-medium">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const ModernStatusChart: React.FC<ModernStatusChartProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">توزیع وضعیت تسک‌ها</h3>
          <p className="text-sm text-slate-400">آمار لحظه‌ای وضعیت پروژه‌ها</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis type="number" stroke="#9ca3af" fontSize={12} />
          <YAxis dataKey="status" type="category" width={100} stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors] || '#8b5cf6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ModernOwnerChart: React.FC<ModernOwnerChartProps> = ({ data }) => {
  const topOwners = data.slice(0, 5);
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">تسک‌های برتر مالکان</h3>
          <p className="text-sm text-slate-400">5 مالک برتر بر اساس تعداد تسک</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topOwners} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis type="number" stroke="#9ca3af" fontSize={12} />
          <YAxis dataKey="owner" type="category" width={120} stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="url(#ownerGradient)" radius={[0, 4, 4, 0]} />
          <defs>
            <linearGradient id="ownerGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ModernStatusPieChart: React.FC<ModernStatusChartProps> = ({ data }) => {
  const colors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#6b7280', '#ef4444', '#10b981'];
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">نمودار دایره‌ای وضعیت‌ها</h3>
          <p className="text-sm text-slate-400">توزیع درصدی وضعیت تسک‌ها</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Performance Chart Component
export const PerformanceChart: React.FC = () => {
  const performanceData = [
    { name: 'شنبه', completed: 12, inProgress: 8, total: 20 },
    { name: 'یکشنبه', completed: 15, inProgress: 6, total: 21 },
    { name: 'دوشنبه', completed: 18, inProgress: 9, total: 27 },
    { name: 'سه‌شنبه', completed: 14, inProgress: 11, total: 25 },
    { name: 'چهارشنبه', completed: 22, inProgress: 7, total: 29 },
    { name: 'پنج‌شنبه', completed: 19, inProgress: 13, total: 32 },
    { name: 'جمعه', completed: 16, inProgress: 5, total: 21 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">عملکرد هفتگی</h3>
          <p className="text-sm text-slate-400">روند پیشرفت تسک‌ها در 7 روز گذشته</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#totalGradient)"
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="2"
            stroke="#10b981"
            fill="url(#completedGradient)"
          />
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
