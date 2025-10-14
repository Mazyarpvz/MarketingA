import React, { useState } from 'react';
import { TasksQuery } from '../api/types';

interface AdvancedSearchProps {
  meta: any;
  onSearch: (filters: TasksQuery) => void;
  onReset: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ meta, onSearch, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<TasksQuery>({
    page: '1',
    pageSize: '20',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({ page: '1', pageSize: '20' });
    onReset();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
      >
        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        جست‌وجوی پیشرفته
        <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Search Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl z-50 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">جست‌وجوی پیشرفته</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Term */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                جست‌وجو در عنوان/توضیحات
              </label>
              <input
                type="text"
                value={filters.q || ''}
                onChange={(e) => handleFilterChange('q', e.target.value)}
                placeholder="کلمه کلیدی وارد کنید..."
                className="w-full input"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  از تاریخ
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  تا تاریخ
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full input"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  مالک
                </label>
                <select
                  value={filters.ownerId || ''}
                  onChange={(e) => handleFilterChange('ownerId', e.target.value)}
                  className="w-full input"
                >
                  <option value="">همه مالکان</option>
                  {meta?.owners?.map((owner: any) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  وضعیت
                </label>
                <select
                  value={filters.statusCode || ''}
                  onChange={(e) => handleFilterChange('statusCode', e.target.value)}
                  className="w-full input"
                >
                  <option value="">همه وضعیت‌ها</option>
                  {meta?.statuses?.map((status: any) => (
                    <option key={status.id} value={status.code}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project & Module */}
            <div className="grid grid-cols-2 gap-4">
              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  پروژه
                </label>
                <select
                  value={filters.projectId || ''}
                  onChange={(e) => handleFilterChange('projectId', e.target.value)}
                  className="w-full input"
                >
                  <option value="">همه پروژه‌ها</option>
                  {meta?.projects?.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Module */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ماژول
                </label>
                <select
                  value={filters.moduleId || ''}
                  onChange={(e) => handleFilterChange('moduleId', e.target.value)}
                  className="w-full input"
                >
                  <option value="">همه ماژول‌ها</option>
                  {meta?.modules?.map((module: any) => (
                    <option key={module.id} value={module.id}>
                      {module.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                فیلترهای سریع
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('statusCode', 'Open')}
                  className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                >
                  باز
                </button>
                <button
                  onClick={() => handleFilterChange('statusCode', 'In Progress')}
                  className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors"
                >
                  در حال انجام
                </button>
                <button
                  onClick={() => handleFilterChange('statusCode', 'Blocked')}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                >
                  مسدود
                </button>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    handleFilterChange('dateTo', today);
                  }}
                  className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                >
                  امروز
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700/50">
              <button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                اعمال فیلتر
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 border border-slate-600/50"
              >
                پاک کردن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

