import React from 'react';
import { formatJalaliDate } from '../lib/dayjs';
import { OverdueTask, DueThisWeekTask, TaskListResponse } from '../api/types';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'status-badge status-open hover:shadow-md hover:scale-105';
      case 'in progress':
        return 'status-badge status-in-progress hover:shadow-md hover:scale-105';
      case 'review':
        return 'status-badge status-review hover:shadow-md hover:scale-105';
      case 'on hold':
        return 'status-badge status-on-hold hover:shadow-md hover:scale-105';
      case 'blocked':
        return 'status-badge status-blocked hover:shadow-md hover:scale-105';
      case 'done':
        return 'status-badge status-done hover:shadow-md hover:scale-105';
      default:
        return 'status-badge status-open hover:shadow-md hover:scale-105';
    }
  };

  return (
    <span className={`${getStatusClass(status)} transition-all duration-200 cursor-default inline-block`}>
      {status}
    </span>
  );
};

interface OverdueTableProps {
  data: OverdueTask[];
}

export const OverdueTable: React.FC<OverdueTableProps> = ({ data }) => {
  const exportToCSV = () => {
    const csvContent = [
      ['عنوان', 'مالک', 'تاریخ سررسید', 'وضعیت', 'روزهای تاخیر'],
      ...data.map(task => [
        task.title,
        task.owner,
        formatJalaliDate(task.due_at),
        task.status,
        task.days_overdue.toString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'overdue-tasks.csv';
    link.click();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-100">تسک‌های معوق ({data.length})</h3>
        <button onClick={exportToCSV} className="btn-secondary text-sm">
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>مالک</th>
              <th>تاریخ سررسید</th>
              <th>وضعیت</th>
              <th>روزهای تاخیر</th>
            </tr>
          </thead>
          <tbody>
            {data.map((task) => (
              <tr 
                key={task.task_id}
                className="hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer"
              >
                <td className="font-medium">{task.title}</td>
                <td>{task.owner}</td>
                <td>{formatJalaliDate(task.due_at)}</td>
                <td><StatusBadge status={task.status} /></td>
                <td className="text-red-600 font-medium">{task.days_overdue} روز</td>
                <td>
                  <button className="btn-xs btn-primary mr-1" onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('جزئیات تسک: ' + task.title, { icon: '🔎', duration: 2000 }))}>جزئیات</button>
                  <button className="btn-xs btn-warning mr-1" onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('ویرایش تسک: ' + task.title, { icon: '✏️', duration: 2000 }))}>ویرایش</button>
                  <button className="btn-xs btn-danger" onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('تسک حذف شد: ' + task.title, { icon: '🗑️', duration: 2000 }))}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface DueThisWeekTableProps {
  data: DueThisWeekTask[];
}

export const DueThisWeekTable: React.FC<DueThisWeekTableProps> = ({ data }) => {
  const exportToCSV = () => {
    const csvContent = [
      ['عنوان', 'مالک', 'تاریخ سررسید', 'وضعیت'],
      ...data.map(task => [
        task.title,
        task.owner,
        formatJalaliDate(task.due_at),
        task.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'due-this-week-tasks.csv';
    link.click();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-100">تسک‌های این هفته ({data.length})</h3>
        <button onClick={exportToCSV} className="btn-secondary text-sm">
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>مالک</th>
              <th>تاریخ سررسید</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
                {data.map((task) => (
                  <tr 
                    key={task.task_id}
                    className="hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="font-medium">{task.title}</td>
                    <td>{task.owner}</td>
                    <td>{formatJalaliDate(task.due_at)}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>
                      <button className="btn-xs btn-primary mr-1" onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('جزئیات تسک: ' + task.title, { icon: '🔎', duration: 2000 }))}>جزئیات</button>
                      <button className="btn-xs btn-warning mr-1" onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('ویرایش تسک: ' + task.title, { icon: '✏️', duration: 2000 }))}>ویرایش</button>
                      <button className="btn-xs btn-danger" onClick={() => import('react-hot-toast').then(({ default: toast }) => toast('تسک حذف شد: ' + task.title, { icon: '🗑️', duration: 2000 }))}>حذف</button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface TaskListTableProps {
  data: TaskListResponse;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
}

export const TaskListTable: React.FC<TaskListTableProps> = ({ 
  data, 
  onPageChange, 
  currentPage, 
  pageSize 
}) => {
  const totalPages = Math.ceil(data.total / pageSize);
  
  const exportToCSV = () => {
    const csvContent = [
      ['عنوان', 'مالک', 'وضعیت', 'پروژه', 'ماژول', 'تاریخ شروع', 'تاریخ سررسید', 'پیشرفت'],
      ...data.rows.map(task => [
        task.title,
        task.owner,
        task.status,
        task.project,
        task.module,
        task.start_at ? formatJalaliDate(task.start_at) : '-',
        task.due_at ? formatJalaliDate(task.due_at) : '-',
        `${task.progress_percent}%`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tasks.csv';
    link.click();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          لیست تسک‌ها ({data.total} مورد)
        </h3>
        <button onClick={exportToCSV} className="btn-secondary text-sm">
          Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>مالک</th>
              <th>وضعیت</th>
              <th>پروژه</th>
              <th>ماژول</th>
              <th>تاریخ شروع</th>
              <th>تاریخ سررسید</th>
              <th>پیشرفت</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((task) => (
              <tr 
                key={task.task_id}
                className="hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer"
              >
                <td className="font-medium">{task.title}</td>
                <td>{task.owner}</td>
                <td><StatusBadge status={task.status} /></td>
                <td>{task.project}</td>
                <td>{task.module}</td>
                <td>{task.start_at ? formatJalaliDate(task.start_at) : '-'}</td>
                <td>{task.due_at ? formatJalaliDate(task.due_at) : '-'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-600 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out hover:bg-blue-400" 
                        style={{ width: `${task.progress_percent}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-300">{task.progress_percent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            قبلی
          </button>
          
          <span className="px-4 py-2 text-sm text-slate-300">
            صفحه {currentPage} از {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
};
