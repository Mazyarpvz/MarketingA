import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const WorkingApp: React.FC = () => {
  const [kpiData, setKpiData] = useState<any>(null);
  const [overdueData, setOverdueData] = useState<any[]>([]);
  const [dueThisWeekData, setDueThisWeekData] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<any[]>([]);
  const [ownerCounts, setOwnerCounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [kpiResponse, overdueResponse, dueThisWeekResponse, statusResponse, ownerResponse] = await Promise.all([
          fetch('/api/kpi'),
          fetch('/api/overdue'),
          fetch('/api/due-this-week'),
          fetch('/api/status-counts'),
          fetch('/api/owner-counts')
        ]);

        if (!kpiResponse.ok || !overdueResponse.ok || !dueThisWeekResponse.ok || !statusResponse.ok || !ownerResponse.ok) {
          throw new Error('خطا در دریافت داده‌ها از سرور');
        }

        const [kpi, overdue, dueThisWeek, status, owner] = await Promise.all([
          kpiResponse.json(),
          overdueResponse.json(),
          dueThisWeekResponse.json(),
          statusResponse.json(),
          ownerResponse.json()
        ]);

        setKpiData(kpi);
        setOverdueData(overdue);
        setDueThisWeekData(dueThisWeek);
        setStatusCounts(status);
        setOwnerCounts(owner);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای ناشناخته');
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">خطا در اتصال به API</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            📊 داشبورد مدیریت پروژه
          </h1>
          <p className="text-gray-300 mt-2">نسخه کاری با API واقعی</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-100">کل تسک‌ها</h3>
                <p className="text-3xl font-bold text-white">{kpiData?.total_tasks || 0}</p>
              </div>
              <div className="text-blue-200 text-3xl">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-100">در حال انجام</h3>
                <p className="text-3xl font-bold text-white">{kpiData?.in_progress || 0}</p>
              </div>
              <div className="text-green-200 text-3xl">⚡</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-100">عقب‌افتاده</h3>
                <p className="text-3xl font-bold text-white">{kpiData?.overdue_count || 0}</p>
              </div>
              <div className="text-red-200 text-3xl">⚠️</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-100">این هفته</h3>
                <p className="text-3xl font-bold text-white">{kpiData?.due_this_week_count || 0}</p>
              </div>
              <div className="text-yellow-200 text-3xl">📅</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            پیشرفت کلی پروژه‌ها
          </h2>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-700 rounded-full h-4 mr-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${kpiData?.avg_progress || 0}%` }}
              ></div>
            </div>
            <span className="text-lg font-semibold">{kpiData?.avg_progress || 0}%</span>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">✅</span>
              خلاصه وضعیت
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>انجام شده:</span>
                <span className="font-bold text-green-400">{kpiData?.done || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>در حال انجام:</span>
                <span className="font-bold text-blue-400">{kpiData?.in_progress || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>مسدود:</span>
                <span className="font-bold text-red-400">{kpiData?.blocked || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🔄</span>
              به‌روزرسانی لحظه‌ای
            </h2>
            <div className="text-center">
              <div className="text-green-400 text-4xl mb-2">✅</div>
              <p className="text-gray-300">داده‌ها از API دریافت شدند</p>
              <p className="text-sm text-gray-500 mt-2">
                آخرین به‌روزرسانی: {new Date().toLocaleTimeString('fa-IR')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🔄 به‌روزرسانی داده‌ها
          </button>
        </div>

        {/* Overdue Tasks Table */}
        {overdueData.length > 0 && (
          <div className="mt-8 bg-red-900/20 border border-red-500/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-red-400">
              <span className="text-2xl mr-2">⚠️</span>
              تسک‌های عقب‌افتاده ({overdueData.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-red-500/30">
                    <th className="text-right p-3 text-red-300">عنوان</th>
                    <th className="text-right p-3 text-red-300">مسئول</th>
                    <th className="text-right p-3 text-red-300">وضعیت</th>
                    <th className="text-right p-3 text-red-300">روز عقب‌افتادگی</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueData.map((task: any, index: number) => (
                    <tr key={task.task_id || index} className="border-b border-red-500/20 hover:bg-red-500/10">
                      <td className="p-3 font-medium">{task.title}</td>
                      <td className="p-3 text-gray-300">{task.owner}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'Blocked' ? 'bg-red-600' : 
                          task.status === 'In Progress' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {task.status === 'Blocked' ? 'مسدود' : 
                           task.status === 'In Progress' ? 'در حال انجام' : task.status}
                        </span>
                      </td>
                      <td className="p-3 text-red-400 font-bold">{task.days_overdue} روز</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Due This Week Tasks Table */}
        {dueThisWeekData.length > 0 && (
          <div className="mt-8 bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400">
              <span className="text-2xl mr-2">📅</span>
              تسک‌های سررسید این هفته ({dueThisWeekData.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-yellow-500/30">
                    <th className="text-right p-3 text-yellow-300">عنوان</th>
                    <th className="text-right p-3 text-yellow-300">مسئول</th>
                    <th className="text-right p-3 text-yellow-300">وضعیت</th>
                    <th className="text-right p-3 text-yellow-300">تاریخ سررسید</th>
                  </tr>
                </thead>
                <tbody>
                  {dueThisWeekData.map((task: any, index: number) => (
                    <tr key={task.task_id || index} className="border-b border-yellow-500/20 hover:bg-yellow-500/10">
                      <td className="p-3 font-medium">{task.title}</td>
                      <td className="p-3 text-gray-300">{task.owner}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'Open' ? 'bg-blue-600' : 
                          task.status === 'In Progress' ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {task.status === 'Open' ? 'باز' : 
                           task.status === 'In Progress' ? 'در حال انجام' : task.status}
                        </span>
                      </td>
                      <td className="p-3 text-yellow-400">
                        {new Date(task.due_at).toLocaleDateString('fa-IR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkingAppWithProvider: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkingApp />
    </QueryClientProvider>
  );
};

export default WorkingAppWithProvider;