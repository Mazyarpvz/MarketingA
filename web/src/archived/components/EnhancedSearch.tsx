import React, { useState, useEffect } from 'react';
import { TasksQuery } from '../api/types';

interface EnhancedSearchProps {
  meta: any;
  onSearch: (filters: TasksQuery) => void;
  onReset: () => void;
  loading?: boolean;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ 
  meta, 
  onSearch, 
  onReset, 
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    const filters: TasksQuery = {
      page: '1',
      pageSize: '20',
    };

    if (searchTerm.trim()) filters.q = searchTerm.trim();
    if (selectedStatus) filters.statusCode = selectedStatus;
    if (selectedOwner) filters.ownerId = selectedOwner;
    if (selectedProject) filters.projectId = selectedProject;
    if (selectedModule) filters.moduleId = selectedModule;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    onSearch(filters);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedOwner('');
    setSelectedProject('');
    setSelectedModule('');
    setDateFrom('');
    setDateTo('');
    onReset();
  };

  const hasActiveFilters = searchTerm || selectedStatus || selectedOwner || selectedProject || selectedModule || dateFrom || dateTo;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 2 || searchTerm.length === 0) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جست‌وجو در عنوان و توضیحات تسک‌ها..."
            className="w-full input pr-10"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          جست‌وجو
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedStatus('');
            setSelectedOwner('');
            setSelectedProject('');
            setSelectedModule('');
            handleSearch();
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedStatus && !selectedOwner && !selectedProject && !selectedModule
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
          }`}
        >
          همه
        </button>
        
        {meta?.statuses?.map((status: any) => (
          <button
            key={status.id}
            onClick={() => {
              setSelectedStatus(selectedStatus === status.code ? '' : status.code);
              handleSearch();
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === status.code
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          فیلترهای پیشرفته
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            پاک کردن همه
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          {/* Owner Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">مالک</label>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full input"
              disabled={loading}
            >
              <option value="">همه مالکان</option>
              {meta?.owners?.map((owner: any) => (
                <option key={owner.id} value={owner.id}>
                  {owner.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">پروژه</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full input"
              disabled={loading}
            >
              <option value="">همه پروژه‌ها</option>
              {meta?.projects?.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.label}
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ماژول</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full input"
              disabled={loading}
            >
              <option value="">همه ماژول‌ها</option>
              {meta?.modules?.map((module: any) => (
                <option key={module.id} value={module.id}>
                  {module.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">بازه تاریخ</label>
            <div className="space-y-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full input text-sm"
                placeholder="از تاریخ"
                disabled={loading}
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full input text-sm"
                placeholder="تا تاریخ"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          <span className="text-sm text-slate-400">فیلترهای فعال:</span>
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
              جست‌وجو: {searchTerm}
            </span>
          )}
          {selectedStatus && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
              وضعیت: {meta?.statuses?.find((s: any) => s.code === selectedStatus)?.label}
            </span>
          )}
          {selectedOwner && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
              مالک: {meta?.owners?.find((o: any) => o.id === selectedOwner)?.label}
            </span>
          )}
          {selectedProject && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
              پروژه: {meta?.projects?.find((p: any) => p.id === selectedProject)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
