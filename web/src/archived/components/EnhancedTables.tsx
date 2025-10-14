import React, { useState } from 'react';
import { OverdueTask, DueThisWeekTask, TaskListResponse } from '../api/types';

interface EnhancedOverdueTableProps {
  data: OverdueTask[];
}

export const EnhancedOverdueTable: React.FC<EnhancedOverdueTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof OverdueTask>('days_overdue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof OverdueTask) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal, 'fa-IR')
        : bVal.localeCompare(aVal, 'fa-IR');
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Open': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'On Hold': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      'Blocked': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Done': 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getOverdueColor = (days: number) => {
    if (days > 7) return 'text-red-400';
    if (days > 3) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th 
              className="text-right py-3 px-4 font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-2">
                عنوان
                {sortField === 'title' && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="text-right py-3 px-4 font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('owner')}
            >
              <div className="flex items-center gap-2">
                مالک
                {sortField === 'owner' && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="text-right py-3 px-4 font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                وضعیت
                {sortField === 'status' && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="text-right py-3 px-4 font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('due_at')}
            >
              <div className="flex items-center gap-2">
                سررسید
                {sortField === 'due_at' && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              className="text-right py-3 px-4 font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('days_overdue')}
            >
              <div className="flex items-center gap-2">
                روزهای معوق
                {sortField === 'days_overdue' && (
                  <span className="text-xs">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th className="text-right py-3 px-4 font-medium text-slate-300">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((task, index) => (
            <tr key={task.task_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-white">{task.title}</div>
                <div className="text-sm text-slate-400">ID: {task.task_id}</div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {task.owner.charAt(0)}
                    </span>
                  </div>
                  <span className="text-slate-300">{task.owner}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-slate-300">
                  {new Date(task.due_at).toLocaleDateString('fa-IR')}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`font-medium ${getOverdueColor(task.days_overdue)}`}>
                  {task.days_overdue} روز
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-slate-400 hover:text-blue-400 transition-colors" title="مشاهده">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-1 text-slate-400 hover:text-green-400 transition-colors" title="ویرایش">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface EnhancedTaskListTableProps {
  data: TaskListResponse;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const EnhancedTaskListTable: React.FC<EnhancedTaskListTableProps> = ({
  data,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const [sortField, setSortField] = useState<string>('due_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Open': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'On Hold': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      'Blocked': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Done': 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-3 px-4 font-medium text-slate-300">عنوان</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">مالک</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">وضعیت</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">پروژه</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">ماژول</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">شروع</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">سررسید</th>
              <th className="text-right py-3 px-4 font-medium text-slate-300">پیشرفت</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((task, index) => (
              <tr key={task.task_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{task.title}</div>
                  <div className="text-sm text-slate-400">ID: {task.task_id}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {task.owner?.charAt(0) || '?'}
                      </span>
                    </div>
                    <span className="text-slate-300">{task.owner || 'نامشخص'}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">{task.project || 'نامشخص'}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">{task.module || 'نامشخص'}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">
                    {task.start_at ? new Date(task.start_at).toLocaleDateString('fa-IR') : 'نامشخص'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">
                    {task.due_at ? new Date(task.due_at).toLocaleDateString('fa-IR') : 'نامشخص'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress_percent || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-400 w-12 text-left">
                      {task.progress_percent || 0}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-sm text-slate-400">
          نمایش {((currentPage - 1) * pageSize) + 1} تا {Math.min(currentPage * pageSize, data.total)} از {data.total} تسک
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            قبلی
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
};
