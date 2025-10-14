import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTodayGregorian } from './lib/dayjs';
import { TasksQuery } from './api/types';
import { useMeta, useKpi, useStatusCounts, useOwnerCounts, useOverdue, useDueThisWeek, useTasks } from './api/client';
import { ModernKpiCard } from './components/ModernKpiCard';
import { ModernHeader } from './components/ModernHeader';
import { Filters } from './components/Filters';
import { ModernStatusChart, ModernOwnerChart, ModernStatusPieChart, PerformanceChart } from './components/ModernCharts';
import { OverdueTable, DueThisWeekTable, TaskListTable } from './components/Tables';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './components/NotificationSystem';
import { AdvancedSearch } from './components/AdvancedSearch';
import { QuickActions } from './components/QuickActions';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { RealTimeUpdates } from './components/RealTimeUpdates';

const queryClient = new QueryClient();

const ModernDashboard: React.FC = () => {
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

  const exportToPDF = () => {
    window.print();
  };

  if (metaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="در حال بارگذاری داشبورد..." />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-2">خطا در بارگذاری</h2>
          <p className="text-slate-400">لطفاً صفحه را رفرش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Modern Header with Navigation */}
      <ModernHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Quick Actions */}
          <QuickActions 
            meta={meta}
            onRefresh={() => window.location.reload()}
          />

          {/* Advanced Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <Filters
                meta={meta}
                filters={taskFilters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
            <div className="lg:w-auto">
              <AdvancedSearch
                meta={meta}
                onSearch={handleFiltersChange}
                onReset={() => {
                  setTaskFilters({ page: '1', pageSize: '20' });
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))
            ) : kpi ? (
              <>
                <ModernKpiCard
                  title="کل تسک‌ها"
                  value={kpi.total_tasks}
                  color="blue"
                  trend={{ value: 12, isPositive: true }}
                  icon="📋"
                />
                <ModernKpiCard
                  title="تکمیل شده"
                  value={kpi.done}
                  color="green"
                  trend={{ value: 8, isPositive: true }}
                  icon="✅"
                />
                <ModernKpiCard
                  title="در حال انجام"
                  value={kpi.in_progress}
                  color="yellow"
                  trend={{ value: 5, isPositive: false }}
                  icon="⚡"
                />
                <ModernKpiCard
                  title="مسدود شده"
                  value={kpi.blocked}
                  color="red"
                  trend={{ value: 3, isPositive: false }}
                  icon="🚫"
                />
                <ModernKpiCard
                  title="معوق"
                  value={kpi.overdue_count}
                  color="red"
                  subtitle="نیاز به توجه فوری"
                  icon="⏰"
                />
                <ModernKpiCard
                  title="سررسید این هفته"
                  value={kpi.due_this_week_count}
                  color="purple"
                  subtitle="برنامه‌ریزی کنید"
                  icon="📅"
                />
                <ModernKpiCard
                  title="میانگین پیشرفت"
                  value={`${kpi.avg_progress}%`}
                  color="blue"
                  trend={{ value: 15, isPositive: true }}
                  icon="📊"
                />
                <ModernKpiCard
                  title="بهره‌وری"
                  value="85%"
                  color="green"
                  subtitle="عملکرد عالی"
                  trend={{ value: 7, isPositive: true }}
                  icon="🚀"
                />
              </>
            ) : null}
          </div>

          {/* Analytics & Real-time Updates */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AdvancedAnalytics />
            </div>
            <div>
              <RealTimeUpdates />
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Status Chart */}
            <div>
              {statusCountsLoading ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-64 bg-slate-700 rounded"></div>
                </div>
              ) : statusCounts ? (
                <ModernStatusChart data={statusCounts} />
              ) : null}
            </div>

            {/* Owner Chart */}
            <div>
              {ownerCountsLoading ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-64 bg-slate-700 rounded"></div>
                </div>
              ) : ownerCounts ? (
                <ModernOwnerChart data={ownerCounts} />
              ) : null}
            </div>

            {/* Performance Chart */}
            <div className="xl:col-span-2">
              <PerformanceChart />
            </div>

            {/* Pie Chart */}
            <div>
              {statusCountsLoading ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-80 bg-slate-700 rounded"></div>
                </div>
              ) : statusCounts ? (
                <ModernStatusPieChart data={statusCounts} />
              ) : null}
            </div>
          </div>

          {/* Tables */}
          <div className="space-y-6">
            {/* Overdue Tasks */}
            <div>
              {overdueLoading ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-slate-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : overdueTasks ? (
                <OverdueTable data={overdueTasks} />
              ) : null}
            </div>

            {/* Due This Week */}
            <div>
              {dueThisWeekLoading ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-slate-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : dueThisWeekTasks ? (
                <DueThisWeekTable data={dueThisWeekTasks} />
              ) : null}
            </div>

            {/* Task List */}
            <div>
              {tasksLoading ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-12 bg-slate-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : tasks ? (
                <TaskListTable
                  data={tasks}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              ) : null}
            </div>
          </div>
        </main>
    </div>
  );
};

const ModernApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <ModernDashboard />
        </QueryClientProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default ModernApp;
