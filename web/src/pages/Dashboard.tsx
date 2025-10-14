import React, { useEffect } from 'react';
import { useKpi, useOverdue, useDueThisWeek, useStatusCounts, useOwnerCounts } from '../api/client';
import { KpiCards } from '../components/dashboard/KpiCards';
import { ProgressBar } from '../components/dashboard/ProgressBar';
import { OverdueTasksTable } from '../components/dashboard/OverdueTasksTable';
import { DueThisWeekTable } from '../components/dashboard/DueThisWeekTable';
import { StatusChart } from '../components/dashboard/StatusChart';
import { OwnerChart } from '../components/dashboard/OwnerChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { data: kpiData, isLoading: kpiLoading, error: kpiError, refetch: refetchKpi } = useKpi();
  const { data: overdueData, isLoading: overdueLoading, error: overdueError, refetch: refetchOverdue } = useOverdue();
  const { data: dueThisWeekData, isLoading: dueLoading, error: dueError, refetch: refetchDue } = useDueThisWeek();
  const { data: statusData, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = useStatusCounts();
  const { data: ownerData, isLoading: ownerLoading, error: ownerError, refetch: refetchOwner } = useOwnerCounts();

  const isLoading = kpiLoading || overdueLoading || dueLoading || statusLoading || ownerLoading;
  const hasError = kpiError || overdueError || dueError || statusError || ownerError;

  useEffect(() => {
    // Listen for global refresh events
    const handleRefresh = () => {
      refetchKpi();
      refetchOverdue();
      refetchDue();
      refetchStatus();
      refetchOwner();
      toast.success('داده‌ها به‌روزرسانی شدند');
    };

    window.addEventListener('app:refresh', handleRefresh);
    return () => window.removeEventListener('app:refresh', handleRefresh);
  }, [refetchKpi, refetchOverdue, refetchDue, refetchStatus, refetchOwner]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری داده‌ها</h2>
          <p className="text-gray-400 mb-4">
            لطفاً اتصال به سرور را بررسی کنید
          </p>
          <button
            onClick={() => {
              refetchKpi();
              refetchOverdue();
              refetchDue();
              refetchStatus();
              refetchOwner();
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h1 className="text-2xl font-bold mb-2">داشبورد مدیریت پروژه</h1>
        <p className="text-gray-400">
          نمای کلی از وضعیت پروژه‌ها و تسک‌ها
        </p>
      </div>

      {/* KPI Cards */}
      {kpiData && <KpiCards data={kpiData} />}

      {/* Progress Bar */}
      {kpiData && (
        <ProgressBar 
          progress={kpiData.avg_progress} 
          label="میانگین پیشرفت کلی پروژه‌ها"
        />
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statusData && <StatusChart data={statusData} />}
        {ownerData && <OwnerChart data={ownerData} />}
      </div>

      {/* Tables */}
      <div className="space-y-6">
        {overdueData && overdueData.length > 0 && (
          <OverdueTasksTable tasks={overdueData} />
        )}
        
        {dueThisWeekData && dueThisWeekData.length > 0 && (
          <DueThisWeekTable tasks={dueThisWeekData} />
        )}
      </div>

      {/* Empty State Messages */}
      {(!overdueData || overdueData.length === 0) && (!dueThisWeekData || dueThisWeekData.length === 0) && (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2">عالی!</h3>
          <p className="text-gray-400">
            هیچ تسک عقب‌افتاده یا سررسید نزدیکی وجود ندارد
          </p>
        </div>
      )}
    </div>
  );
};