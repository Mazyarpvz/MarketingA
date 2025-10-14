import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { AdvancedTaskModal } from './AdvancedTaskModal';

interface SimpleActionsProps {
  meta: any;
  onRefresh: () => void;
}

export const SimpleActions: React.FC<SimpleActionsProps> = ({ meta, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'new-task':
        setTaskModalOpen(true);
        break;
      case 'refresh':
        onRefresh();
        addNotification({
          type: 'success',
          title: 'بروزرسانی شد',
          message: 'داده‌ها بروزرسانی شدند',
        });
        break;
      case 'export':
        addNotification({
          type: 'info',
          title: 'در حال آماده‌سازی',
          message: 'فایل در حال آماده‌سازی است...',
        });
        break;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        {/* Left: Title */}
        <div>
          <h2 className="text-lg font-semibold text-white">مدیریت تسک‌ها</h2>
          <p className="text-sm text-slate-400">نمای کلی پروژه‌ها</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('new-task')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            تسک جدید
          </button>

          <button
            onClick={() => handleAction('refresh')}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="بروزرسانی"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={() => handleAction('export')}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="خروجی"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      <AdvancedTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        meta={meta}
        onSave={(task) => {
          console.log('New task:', task);
        }}
      />
    </>
  );
};
