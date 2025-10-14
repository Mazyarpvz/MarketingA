import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTodayGregorian } from './lib/dayjs';
import { TasksQuery } from './api/types';
import { useMeta, useKpi, useStatusCounts, useOwnerCounts, useOverdue, useDueThisWeek, useTasks } from './api/client';
import { MinimalHeader } from './components/MinimalHeader';
import { MinimalKpiCard } from './components/MinimalKpiCard';
import { SimpleCharts } from './components/SimpleCharts';
import { SimpleSearch } from './components/SimpleSearch';
import { SimpleActions } from './components/SimpleActions';
import { OverdueTable, DueThisWeekTable, TaskListTable } from './components/Tables';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './components/NotificationSystem';

const queryClient = new QueryClient();

const CleanDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayGregorian());
  const [taskFilters, setTaskFilters] = useState<TasksQuery>({
    page: '1',
    pageSize: '20',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // API calls
  const { data: meta, isLoading: metaLoading } = useMeta();
  const { data: kpi, isLoading: kpiLoading } = useKpi(selectedDate);
  const { data: statusCounts, isLoading: statusCountsLoading } = useStatusCounts(selectedDate);
  const { data: ownerCounts, isLoading: ownerCountsLoading } = useOwnerCounts(selectedDate);
  const { data: overdueTasks, isLoading: overdueLoading } = useOverdue(selectedDate);
  const { data: dueThisWeekTasks, isLoading: dueThisWeekLoading } = useDueThisWeek(selectedDate);
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    ...taskFilters,
    page: currentPage.toString(),
  });

  const handleFiltersChange = (filters: TasksQuery) => {
    setTaskFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (metaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <LoadingSpinner size="lg" text="در حال بارگذاری..." />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">خطا در بارگذاری</h2>
          <p className="text-slate-400">لطفاً صفحه را رفرش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Minimal Header */}
      <MinimalHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Actions */}
        <SimpleActions 
          meta={meta}
          onRefresh={() => window.location.reload()}
        />

        {/* Search */}
        <SimpleSearch
          meta={meta}
          onSearch={handleFiltersChange}
          onReset={() => {
            setTaskFilters({ page: '1', pageSize: '20' });
            setCurrentPage(1);
          }}
        />

        {/* KPI Cards - Only Essential Ones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))
          ) : kpi ? (
            <>
              <MinimalKpiCard
                title="کل تسک‌ها"
                value={kpi.total_tasks}
                icon="📋"
                color="blue"
              />
              <MinimalKpiCard
                title="تکمیل شده"
                value={kpi.done}
                icon="✅"
                color="green"
                subtitle="امروز"
              />
              <MinimalKpiCard
                title="در حال انجام"
                value={kpi.in_progress}
                icon="⚡"
                color="yellow"
              />
              <MinimalKpiCard
                title="معوق"
                value={kpi.overdue_count}
                icon="⏰"
                color="red"
                subtitle="نیاز به توجه"
              />
            </>
          ) : null}
        </div>

        {/* Charts - Simplified */}
        {!statusCountsLoading && !ownerCountsLoading && statusCounts && ownerCounts && (
          <SimpleCharts 
            statusData={statusCounts}
            ownerData={ownerCounts}
          />
        )}

        {/* Tables - Clean Layout */}
        <div className="space-y-6">
          {/* Priority: Overdue Tasks */}
          {!overdueLoading && overdueTasks && overdueTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚠️</span>
                <h3 className="text-lg font-semibold text-white">تسک‌های معوق</h3>
                <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                  {overdueTasks.length}
                </div>
              </div>
              <OverdueTable data={overdueTasks} />
            </div>
          )}

          {/* Due This Week */}
          {!dueThisWeekLoading && dueThisWeekTasks && dueThisWeekTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📅</span>
                <h3 className="text-lg font-semibold text-white">سررسید این هفته</h3>
                <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                  {dueThisWeekTasks.length}
                </div>
              </div>
              <DueThisWeekTable data={dueThisWeekTasks} />
            </div>
          )}

          {/* All Tasks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📝</span>
              <h3 className="text-lg font-semibold text-white">همه تسک‌ها</h3>
              {tasks && (
                <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                  {tasks.total}
                </div>
              )}
            </div>
            {tasksLoading ? (
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 animate-pulse">
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-700 rounded"></div>
                  ))}
                </div>
              </div>
            ) : tasks ? (
              <TaskListTable
                data={tasks}
                currentPage={currentPage}
                pageSize={parseInt(taskFilters.pageSize || '20')}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

const CleanApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <CleanDashboard />
        </QueryClientProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default CleanApp;
