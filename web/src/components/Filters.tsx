import React, { useState } from 'react';
import { TasksQuery } from '../api/types';

interface FiltersProps {
  meta: {
    owners: Array<{ id: number; label: string }>;
    statuses: Array<{ id: number; label: string }>;
    projects: Array<{ id: number; label: string }>;
    modules: Array<{ id: number; label: string }>;
  };
  filters: TasksQuery;
  onFiltersChange: (filters: TasksQuery) => void;
}

export const Filters: React.FC<FiltersProps> = ({ meta, filters, onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.q || '');

  const handleFilterChange = (key: keyof TasksQuery, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    handleFilterChange('q', searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap gap-2 md:gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            جست‌وجو
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جست‌وجو در عنوان و توضیحات..."
              className="input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              جست‌وجو
            </button>
          </div>
        </div>

        {/* Owner Filter */}
        <div className="min-w-48">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            مالک
          </label>
          <select
            value={filters.ownerId || ''}
            onChange={(e) => handleFilterChange('ownerId', e.target.value)}
            className="input"
          >
            <option value="">همه مالکان</option>
            {meta.owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="min-w-48">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            وضعیت
          </label>
          <select
            value={filters.statusCode || ''}
            onChange={(e) => handleFilterChange('statusCode', e.target.value)}
            className="input"
          >
            <option value="">همه وضعیت‌ها</option>
            {meta.statuses.map((status) => (
              <option key={status.id} value={status.label}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project Filter */}
        <div className="min-w-48">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            پروژه
          </label>
          <select
            value={filters.projectId || ''}
            onChange={(e) => handleFilterChange('projectId', e.target.value)}
            className="input"
          >
            <option value="">همه پروژه‌ها</option>
            {meta.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.label}
              </option>
            ))}
          </select>
        </div>

        {/* Module Filter */}
        <div className="min-w-48">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            ماژول
          </label>
          <select
            value={filters.moduleId || ''}
            onChange={(e) => handleFilterChange('moduleId', e.target.value)}
            className="input"
          >
            <option value="">همه ماژول‌ها</option>
            {meta.modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div>
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>
    </div>
  );
};
