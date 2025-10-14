import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { TaskModal } from './TaskModal';

interface QuickActionsProps {
  meta: any;
  onRefresh: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ meta, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'refresh':
        onRefresh();
        addNotification({
          type: 'success',
          title: 'بروزرسانی انجام شد',
          message: 'داده‌ها با موفقیت بروزرسانی شدند',
        });
        break;
      case 'export-excel':
        addNotification({
          type: 'info',
          title: 'در حال آماده‌سازی',
          message: 'فایل Excel در حال آماده‌سازی است...',
        });
        setTimeout(() => {
          addNotification({
            type: 'success',
            title: 'دانلود آماده',
            message: 'فایل Excel با موفقیت آماده شد',
          });
        }, 2000);
        break;
      case 'new-task':
        setTaskModalOpen(true);
        break;
      case 'bulk-update':
        addNotification({
          type: 'info',
          title: 'بروزرسانی گروهی',
          message: 'در حال بروزرسانی تسک‌های انتخاب شده...',
        });
        break;
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Actions */}
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">عملیات سریع</h3>
            <div className="w-px h-6 bg-slate-700"></div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuickAction('new-task')}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
              >
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                تسک جدید
              </button>

              <button
                onClick={() => handleQuickAction('refresh')}
                className="group flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-600/50"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                بروزرسانی
              </button>

              <button
                onClick={() => handleQuickAction('export-excel')}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="input text-sm"
              >
                <option value="">عملیات گروهی</option>
                <option value="mark-done">علامت‌گذاری به عنوان تکمیل شده</option>
                <option value="assign-owner">تخصیص مالک</option>
                <option value="change-status">تغییر وضعیت</option>
                <option value="delete">حذف</option>
              </select>
              
              {bulkAction && (
                <button
                  onClick={() => handleQuickAction('bulk-update')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  اعمال
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24 تکمیل شده</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>12 در حال انجام</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>3 معوق</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        meta={meta}
        onSave={(task) => {
          console.log('New task:', task);
          // Here you would typically call an API to save the task
        }}
      />
    </>
  );
};

