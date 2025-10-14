import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const productivityData = [
  { day: 'شنبه', productivity: 85, efficiency: 78, quality: 92 },
  { day: 'یکشنبه', productivity: 92, efficiency: 85, quality: 88 },
  { day: 'دوشنبه', productivity: 78, efficiency: 92, quality: 95 },
  { day: 'سه‌شنبه', productivity: 88, efficiency: 76, quality: 89 },
  { day: 'چهارشنبه', productivity: 95, efficiency: 89, quality: 91 },
  { day: 'پنج‌شنبه', productivity: 82, efficiency: 94, quality: 87 },
  { day: 'جمعه', productivity: 90, efficiency: 81, quality: 93 },
];

const teamPerformanceData = [
  { team: 'Frontend', performance: 92, tasks: 45, quality: 88 },
  { team: 'Backend', performance: 87, tasks: 38, quality: 94 },
  { team: 'DevOps', performance: 95, tasks: 22, quality: 91 },
  { team: 'QA', performance: 89, tasks: 31, quality: 96 },
  { team: 'Design', performance: 84, tasks: 18, quality: 89 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-200 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('productivity');

  const tabs = [
    { id: 'productivity', title: 'بهره‌وری', icon: '📈' },
    { id: 'team', title: 'عملکرد تیم', icon: '👥' },
    { id: 'quality', title: 'کیفیت', icon: '⭐' },
    { id: 'trends', title: 'روندها', icon: '📊' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">آنالیتیکس پیشرفته</h3>
            <p className="text-sm text-slate-400">تحلیل عمیق عملکرد و روندها</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:block">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Productivity Tab */}
        {activeTab === 'productivity' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Productivity Metrics */}
              <div className="lg:col-span-2">
                <h4 className="text-lg font-bold text-white mb-4">روند بهره‌وری هفتگی</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="quality" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">بهره‌وری کلی</span>
                    <span className="text-xs text-green-400">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">87%</div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">کارایی</span>
                    <span className="text-xs text-green-400">+8%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">92%</div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">کیفیت</span>
                    <span className="text-xs text-green-400">+5%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">91%</div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Performance Tab */}
        {activeTab === 'team' && (
          <div>
            <h4 className="text-lg font-bold text-white mb-6">عملکرد تیم‌ها</h4>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={teamPerformanceData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="team" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Radar name="Performance" dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Quality" dataKey="quality" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quality Tab */}
        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">شاخص‌های کیفیت</h4>
              <div className="space-y-4">
                {[
                  { label: 'کیفیت کد', value: 94, color: 'green' },
                  { label: 'تست کاوریج', value: 87, color: 'blue' },
                  { label: 'مستندات', value: 78, color: 'yellow' },
                  { label: 'رضایت کاربر', value: 92, color: 'purple' },
                ].map((metric, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{metric.label}</span>
                      <span className="text-white font-bold">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          metric.color === 'green' ? 'from-green-500 to-green-600' :
                          metric.color === 'blue' ? 'from-blue-500 to-blue-600' :
                          metric.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                          'from-purple-500 to-purple-600'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">توزیع کیفیت</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="quality"
                    stroke="#8b5cf6"
                    fill="url(#qualityGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {[
                { title: 'رشد ماهانه', value: '+23%', trend: 'up', color: 'green' },
                { title: 'زمان تکمیل', value: '-15%', trend: 'down', color: 'blue' },
                { title: 'رضایت تیم', value: '+8%', trend: 'up', color: 'purple' },
                { title: 'کیفیت تحویل', value: '+12%', trend: 'up', color: 'yellow' },
              ].map((item, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                  <div className="text-sm text-slate-400 mb-2">{item.title}</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    item.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    <svg className={`w-3 h-3 ${item.trend === 'up' ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    روند {item.trend === 'up' ? 'صعودی' : 'نزولی'}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">تحلیل روند بهره‌وری</h4>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="productivity"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#productivityGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stackId="2"
                    stroke="#10b981"
                    fill="url(#efficiencyGradient)"
                  />
                  <defs>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

