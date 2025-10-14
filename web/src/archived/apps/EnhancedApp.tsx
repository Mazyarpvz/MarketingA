import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTodayGregorian } from './lib/dayjs';
import { TasksQuery } from './api/types';
import { useMeta, useKpi, useStatusCounts, useOwnerCounts, useOverdue, useDueThisWeek, useTasks } from './api/client';
import { AdvancedHeader } from './components/AdvancedHeader';
import { AdvancedKpiCard } from './components/AdvancedKpiCard';
import { EnhancedCharts } from './components/EnhancedCharts';
import { EnhancedSearch } from './components/EnhancedSearch';
import { SimpleActions } from './components/SimpleActions';
import { EnhancedOverdueTable, EnhancedTaskListTable } from './components/EnhancedTables';
import { DueThisWeekTable } from './components/Tables';
import { RealTimeUpdates } from './components/RealTimeUpdates';
import { SkeletonCard, SkeletonTable } from './components/SkeletonLoader';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './components/NotificationSystem';

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

const EnhancedDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayGregorian());
  const [taskFilters, setTaskFilters] = useState<TasksQuery>({
    page: '1',
    pageSize: '20',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // API calls
  const { data: meta, isLoading: metaLoading, error: metaError } = useMeta();
  const { data: kpi, isLoading: kpiLoading, error: kpiError } = useKpi(selectedDate);
  const { data: statusCounts, isLoading: statusCountsLoading } = useStatusCounts(selectedDate);
  const { data: ownerCounts, isLoading: ownerCountsLoading } = useOwnerCounts(selectedDate);
  const { data: overdueTasks, isLoading: overdueLoading } = useOverdue(selectedDate);
  const { data: dueThisWeekTasks, isLoading: dueThisWeekLoading } = useDueThisWeek(selectedDate);
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    ...taskFilters,
    page: currentPage.toString(),
  });

  useEffect(() => {
    if (meta && !metaLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [meta, metaLoading]);

  const handleFiltersChange = (filters: TasksQuery) => {
    setTaskFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (metaError || kpiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-heading-2 text-white mb-2">خطا در بارگذاری</h2>
          <p className="text-body text-slate-400 mb-6">مشکلی در اتصال به سرور وجود دارد</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (isInitialLoad || metaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-6 bg-slate-700 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-32 max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonTable rows={3} />
            <SkeletonTable rows={3} />
          </div>
        </div>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-heading-2 text-white mb-2">داده‌ای یافت نشد</h2>
          <p className="text-body text-slate-400">لطفاً صفحه را رفرش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Advanced Header */}
      <AdvancedHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Main Content */}
      <main className="pt-32 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Actions */}
        <SimpleActions 
          meta={meta}
          onRefresh={handleRefresh}
        />

        {/* Enhanced Search */}
        <EnhancedSearch
          meta={meta}
          onSearch={handleFiltersChange}
          onReset={() => {
            setTaskFilters({ page: '1', pageSize: '20' });
            setCurrentPage(1);
          }}
          loading={tasksLoading}
        />

        {/* Real-time Updates */}
        <div className="flex justify-end">
          <RealTimeUpdates 
            selectedDate={selectedDate}
            onDataUpdate={() => {
              console.log('Data updated successfully');
            }}
          />
        </div>

        {/* KPI Cards - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : kpi ? (
            <>
              <AdvancedKpiCard
                title="کل تسک‌ها"
                value={kpi.total_tasks}
                icon="📋"
                color="blue"
                trend={{ value: 12, direction: 'up' }}
                delay={0}
              />
              <AdvancedKpiCard
                title="تکمیل شده"
                value={kpi.done}
                icon="✅"
                color="green"
                subtitle="امروز"
                trend={{ value: 8, direction: 'up' }}
                delay={100}
              />
              <AdvancedKpiCard
                title="در حال انجام"
                value={kpi.in_progress}
                icon="⚡"
                color="yellow"
                trend={{ value: 3, direction: 'down' }}
                delay={200}
              />
              <AdvancedKpiCard
                title="معوق"
                value={kpi.overdue_count}
                icon="⏰"
                color="red"
                subtitle="نیاز به توجه"
                trend={{ value: 15, direction: 'up' }}
                delay={300}
              />
            </>
          ) : null}
        </div>

        {/* Enhanced Charts */}
        {!statusCountsLoading && !ownerCountsLoading && statusCounts && ownerCounts && (
          <EnhancedCharts 
            statusData={statusCounts}
            ownerData={ownerCounts}
          />
        )}

        {/* Tables - Enhanced Layout */}
        <div className="space-y-8">
          {/* Priority: Overdue Tasks */}
          {!overdueLoading && overdueTasks && overdueTasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">⚠️</span>
                </div>
                <div>
                  <h3 className="text-heading-3 text-white">تسک‌های معوق</h3>
                  <p className="text-caption text-slate-400">نیاز به اقدام فوری</p>
                </div>
                <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                  {overdueTasks.length} تسک
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <EnhancedOverdueTable data={overdueTasks} />
              </div>
            </div>
          )}

          {/* Due This Week */}
          {!dueThisWeekLoading && dueThisWeekTasks && dueThisWeekTasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📅</span>
                </div>
                <div>
                  <h3 className="text-heading-3 text-white">سررسید این هفته</h3>
                  <p className="text-caption text-slate-400">تسک‌های در انتظار تکمیل</p>
                </div>
                <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  {dueThisWeekTasks.length} تسک
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <DueThisWeekTable data={dueThisWeekTasks} />
              </div>
            </div>
          )}

          {/* All Tasks */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
              <div>
                <h3 className="text-heading-3 text-white">همه تسک‌ها</h3>
                <p className="text-caption text-slate-400">نمای کامل پروژه‌ها</p>
              </div>
              {tasks && (
                <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {tasks.total} تسک
                </div>
              )}
            </div>
            {tasksLoading ? (
              <SkeletonTable rows={5} />
            ) : tasks ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <EnhancedTaskListTable
                  data={tasks}
                  currentPage={currentPage}
                  pageSize={parseInt(taskFilters.pageSize || '20')}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

const EnhancedApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <EnhancedDashboard />
        </QueryClientProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default EnhancedApp;
