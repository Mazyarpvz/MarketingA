import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Target, Activity, Download, Calendar } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import toast from 'react-hot-toast';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const analyticsData = {
    totalTasks: 156,
    completedTasks: 98,
    inProgressTasks: 32,
    overdueTasks: 26,
    completionRate: 63,
    avgCompletionTime: '2.3 روز',
    teamPerformance: [
      { id: 1, name: 'تیم توسعه', tasks: 45, completion: 89, members: 8, avgTime: '2.1 روز' },
      { id: 2, name: 'تیم طراحی', tasks: 32, completion: 76, members: 5, avgTime: '3.2 روز' },
      { id: 3, name: 'تیم تست', tasks: 28, completion: 92, members: 4, avgTime: '1.8 روز' },
      { id: 4, name: 'تیم DevOps', tasks: 21, completion: 85, members: 3, avgTime: '2.5 روز' },
    ],
    monthlyTrend: [
      { month: 'فروردین', tasks: 12, completed: 8 },
      { month: 'اردیبهشت', tasks: 18, completed: 15 },
      { month: 'خرداد', tasks: 22, completed: 18 },
      { month: 'تیر', tasks: 25, completed: 20 },
      { month: 'مرداد', tasks: 28, completed: 24 },
      { month: 'شهریور', tasks: 31, completed: 28 },
    ]
  };

  const handleExport = () => {
    toast.success('گزارش در حال Export است...', { icon: '📊', duration: 2000 });
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
    toast.success(`بازه زمانی به ${range === 'week' ? 'هفته' : range === 'month' ? 'ماه' : 'سال'} تغییر کرد`, { 
      icon: '📅', 
      duration: 2000 
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="تحلیل و گزارش"
        subtitle="آمار و تحلیل جامع عملکرد پروژه"
        icon={BarChart3}
        gradient="from-purple-400 to-pink-400"
        actions={
          <>
            <button 
              onClick={() => handleTimeRangeChange('week')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === 'week' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              هفته
            </button>
            <button 
              onClick={() => handleTimeRangeChange('month')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === 'month' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              ماه
            </button>
            <button 
              onClick={() => handleTimeRangeChange('year')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === 'year' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              سال
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </>
        }
      />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل تسک‌ها"
          value={analyticsData.totalTasks}
          icon={BarChart3}
          gradient="from-blue-500 to-blue-600"
          color="blue"
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="تکمیل شده"
          value={analyticsData.completedTasks}
          icon={TrendingUp}
          gradient="from-green-500 to-green-600"
          color="green"
          change={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="نرخ تکمیل"
          value={`${analyticsData.completionRate}%`}
          icon={Target}
          gradient="from-purple-500 to-purple-600"
          color="purple"
          change={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="میانگین زمان"
          value={analyticsData.avgCompletionTime}
          icon={Activity}
          gradient="from-yellow-500 to-yellow-600"
          color="yellow"
          change={{ value: -10, isPositive: false }}
        />
      </div>

      {/* Team Performance Table */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Users className="w-6 h-6 ml-2 text-purple-400" />
          عملکرد تیم‌ها
        </h2>
        <DataTable
          data={analyticsData.teamPerformance}
          columns={[
            { 
              key: 'name', 
              label: 'نام تیم', 
              sortable: true,
              render: (value) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-white">{value}</span>
                </div>
              )
            },
            { 
              key: 'members', 
              label: 'اعضا',
              sortable: true,
              render: (value) => <span className="text-gray-300">{value} نفر</span>
            },
            { 
              key: 'tasks', 
              label: 'تسک‌ها',
              sortable: true,
              render: (value) => <span className="font-medium text-white">{value}</span>
            },
            { 
              key: 'completion', 
              label: 'نرخ تکمیل',
              sortable: true,
              render: (value) => (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[120px]">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        value >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        value >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        'bg-gradient-to-r from-yellow-500 to-orange-600'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white w-10">{value}%</span>
                </div>
              )
            },
            { 
              key: 'avgTime', 
              label: 'میانگین زمان',
              render: (value) => <span className="text-gray-300">{value}</span>
            },
          ]}
          searchable
          exportable
          pageSize={10}
        />
      </div>

      {/* Monthly Trend Chart (Simple visualization) */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Calendar className="w-6 h-6 ml-2 text-purple-400" />
          روند ماهانه
        </h2>
        <div className="space-y-4">
          {analyticsData.monthlyTrend.map((item, index) => {
            const percentage = (item.completed / item.tasks) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.month}</span>
                  <span className="text-gray-400">{item.completed}/{item.tasks} تسک</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-bold mb-4 text-purple-400">خلاصه عملکرد</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">تسک‌های در حال انجام</span>
              <span className="font-bold text-white">{analyticsData.inProgressTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">تسک‌های عقب‌افتاده</span>
              <span className="font-bold text-red-400">{analyticsData.overdueTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">نرخ موفقیت</span>
              <span className="font-bold text-green-400">{analyticsData.completionRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-bold mb-4 text-blue-400">پیشنهادات بهبود</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">✨ نرخ تکمیل تیم تست بسیار عالی است (92%)</p>
            <p className="text-gray-300">⚡ تیم طراحی نیاز به بهبود دارد (76%)</p>
            <p className="text-gray-300">📈 روند کلی رو به رشد است (+12%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;