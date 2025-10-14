import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTodayGregorian } from './lib/dayjs';
import { TasksQuery } from './api/types';
import { useMeta, useKpi, useStatusCounts, useOwnerCounts, useOverdue, useDueThisWeek, useTasks } from './api/client';
import { KpiCard } from './components/KpiCard';
import { ModernKpiCard } from './components/ModernKpiCard';
import { ModernHeader } from './components/ModernHeader';
import { Sidebar } from './components/Sidebar';
import { Filters } from './components/Filters';
import { StatusChart, OwnerChart } from './components/Charts';
import { ModernStatusChart, ModernOwnerChart, ModernStatusPieChart, PerformanceChart } from './components/ModernCharts';
import { OverdueTable, DueThisWeekTable, TaskListTable } from './components/Tables';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DatePicker } from './components/DatePicker';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient();

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayGregorian());
  const [taskFilters, setTaskFilters] = useState<TasksQuery>({
    page: '1',
    pageSize: '20',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return <LoadingSpinner size="lg" text="در حال بارگذاری داشبورد..." />;
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">خطا در بارگذاری</h2>
          <p className="text-gray-600">لطفاً صفحه را رفرش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">داشبورد مدیریت پروژه</h1>
              <p className="text-slate-400 mt-1">گزارش روزانه تسک‌ها و پروژه‌ها</p>
            </div>
            <div className="flex items-center gap-4">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                label="تاریخ گزارش"
              />
              <button
                onClick={exportToPDF}
                className="btn-primary"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Filters */}
        <Filters
          meta={meta}
          filters={taskFilters}
          onFiltersChange={handleFiltersChange}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {kpiLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card">
                <LoadingSpinner size="sm" />
              </div>
            ))
          ) : kpi ? (
            <>
              <KpiCard
                title="کل تسک‌ها"
                value={kpi.total_tasks}
                color="blue"
              />
              <KpiCard
                title="تکمیل شده"
                value={kpi.done}
                color="green"
              />
              <KpiCard
                title="در حال انجام"
                value={kpi.in_progress}
                color="yellow"
              />
              <KpiCard
                title="مسدود شده"
                value={kpi.blocked}
                color="red"
              />
              <KpiCard
                title="معوق"
                value={kpi.overdue_count}
                color="red"
              />
              <KpiCard
                title="این هفته"
                value={kpi.due_this_week_count}
                color="purple"
              />
              <KpiCard
                title="میانگین پیشرفت"
                value={`${kpi.avg_progress}%`}
                color="gray"
              />
            </>
          ) : null}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-8">
          {statusCountsLoading ? (
            <div className="card">
              <LoadingSpinner size="md" text="در حال بارگذاری نمودار وضعیت‌ها..." />
            </div>
          ) : statusCounts ? (
            <StatusChart data={statusCounts} />
          ) : null}

          {ownerCountsLoading ? (
            <div className="card">
              <LoadingSpinner size="md" text="در حال بارگذاری نمودار مالکان..." />
            </div>
          ) : ownerCounts ? (
            <OwnerChart data={ownerCounts} />
          ) : null}
        </div>

        {/* Tables */}
        <div className="space-y-4 md:space-y-6">
          {overdueLoading ? (
            <div className="card">
              <LoadingSpinner size="md" text="در حال بارگذاری تسک‌های معوق..." />
            </div>
          ) : overdueTasks ? (
            <OverdueTable data={overdueTasks} />
          ) : null}

          {dueThisWeekLoading ? (
            <div className="card">
              <LoadingSpinner size="md" text="در حال بارگذاری تسک‌های این هفته..." />
            </div>
          ) : dueThisWeekTasks ? (
            <DueThisWeekTable data={dueThisWeekTasks} />
          ) : null}

          {tasksLoading ? (
            <div className="card">
              <LoadingSpinner size="md" text="در حال بارگذاری لیست تسک‌ها..." />
            </div>
          ) : tasks ? (
            <TaskListTable
              data={tasks}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              pageSize={parseInt(taskFilters.pageSize || '20')}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
