import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, Clock, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { LoadingState, LoadingCard, InlineLoading, LoadingButton } from '../components/LoadingStates';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<any>(null);
  const [overdueData, setOverdueData] = useState<any[]>([]);
  const [dueThisWeekData, setDueThisWeekData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [kpiResponse, overdueResponse, dueThisWeekResponse] = await Promise.all([
        fetch('/api/kpi'),
        fetch('/api/overdue'),
        fetch('/api/due-this-week')
      ]);

      if (!kpiResponse.ok || !overdueResponse.ok || !dueThisWeekResponse.ok) {
        throw new Error('خطا در دریافت داده‌ها از سرور');
      }

      const [kpi, overdue, dueThisWeek] = await Promise.all([
        kpiResponse.json(),
        overdueResponse.json(),
        dueThisWeekResponse.json()
      ]);

      setKpiData(kpi);
      setOverdueData(overdue);
      setDueThisWeekData(dueThisWeek);
      setError(null);
      toast.success('داده‌ها به‌روزرسانی شد', { icon: '✅', duration: 2000 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      console.error('Data fetch error:', err);
      toast.error('خطا در دریافت داده‌ها', { icon: '❌', duration: 3000 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-2" />
          <div className="h-4 bg-white/5 rounded w-96" />
        </div>
        
        {/* Loading KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        
        {/* Loading Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingCard title="در حال بارگذاری تسک‌های معوق..." />
          <LoadingCard title="در حال بارگذاری تسک‌های این هفته..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingState
          type="error"
          title="خطا در بارگذاری داشبورد"
          description={error}
          action={{
            label: "تلاش مجدد",
            onClick: () => window.location.reload()
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="داشبورد"
        icon={LayoutDashboard}
        gradient="from-blue-400 to-purple-400"
        actions={
          <LoadingButton
            loading={refreshing}
            onClick={() => fetchAllData(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            به‌روزرسانی
          </LoadingButton>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل تسک‌ها"
          value={kpiData?.total_tasks || 0}
          icon={ListTodo}
          gradient="from-blue-500 to-blue-600"
          color="blue"
          change={{ value: 12, isPositive: true }}
          onClick={() => toast.success('نمایش جزئیات کل تسک‌ها', { icon: '📋' })}
        />
        <StatCard
          title="در حال انجام"
          value={kpiData?.in_progress || 0}
          icon={Clock}
          gradient="from-green-500 to-green-600"
          color="green"
          change={{ value: 8, isPositive: true }}
          onClick={() => toast.success('نمایش تسک‌های در حال انجام', { icon: '⚡' })}
        />
        <StatCard
          title="عقب‌افتاده"
          value={kpiData?.overdue_count || 0}
          icon={AlertCircle}
          gradient="from-red-500 to-red-600"
          color="red"
          change={{ value: -5, isPositive: false }}
          onClick={() => toast('نمایش تسک‌های عقب‌افتاده', { icon: '⚠️', duration: 2000 })}
        />
        <StatCard
          title="این هفته"
          value={kpiData?.due_this_week_count || 0}
          icon={TrendingUp}
          gradient="from-yellow-500 to-yellow-600"
          color="yellow"
          onClick={() => toast.success('نمایش تسک‌های این هفته', { icon: '📅' })}
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 ml-2 text-purple-400" />
          پیشرفت کلی پروژه‌ها
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${kpiData?.avg_progress || 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {kpiData?.avg_progress || 0}%
          </span>
        </div>
      </div>

      {/* Overdue Tasks Table */}
      {overdueData.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center text-red-400">
            <AlertCircle className="w-6 h-6 ml-2" />
            تسک‌های عقب‌افتاده ({overdueData.length})
          </h2>
          <DataTable
            data={overdueData}
            columns={[
              { key: 'title', label: 'عنوان', sortable: true },
              { key: 'owner', label: 'مسئول', sortable: true },
              { 
                key: 'status', 
                label: 'وضعیت',
                render: (value) => (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    value === 'Blocked' ? 'bg-red-600' : 
                    value === 'In Progress' ? 'bg-yellow-600' : 'bg-gray-600'
                  }`}>
                    {value === 'Blocked' ? 'مسدود' : 
                     value === 'In Progress' ? 'در حال انجام' : value}
                  </span>
                )
              },
              { 
                key: 'days_overdue', 
                label: 'روز عقب‌افتادگی',
                render: (value) => <span className="text-red-400 font-bold">{value} روز</span>
              },
            ]}
            searchable
            exportable
            pageSize={5}
          />
        </div>
      )}

      {/* Due This Week Tasks Table */}
      {dueThisWeekData.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400">
            <Clock className="w-6 h-6 ml-2" />
            تسک‌های سررسید این هفته ({dueThisWeekData.length})
          </h2>
          <DataTable
            data={dueThisWeekData}
            columns={[
              { key: 'title', label: 'عنوان', sortable: true },
              { key: 'owner', label: 'مسئول', sortable: true },
              { 
                key: 'status', 
                label: 'وضعیت',
                render: (value) => (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    value === 'Open' ? 'bg-blue-600' : 
                    value === 'In Progress' ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {value === 'Open' ? 'باز' : 
                     value === 'In Progress' ? 'در حال انجام' : value}
                  </span>
                )
              },
              { 
                key: 'due_at', 
                label: 'تاریخ سررسید',
                render: (value) => <span className="text-yellow-400">{new Date(value).toLocaleDateString('fa-IR')}</span>
              },
            ]}
            searchable
            exportable
            pageSize={5}
          />
        </div>
      )}

      {/* Empty State */}
      {(!overdueData || overdueData.length === 0) && (!dueThisWeekData || dueThisWeekData.length === 0) && (
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl p-12 border border-green-500/30 text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            عالی! همه چیز تحت کنترل است
          </h3>
          <p className="text-gray-400 text-lg">
            هیچ تسک عقب‌افتاده یا سررسید نزدیکی وجود ندارد
          </p>
        </div>
      )}
    </div>
  );
};