import React, { useState } from 'react';
import { TasksQuery } from '../api/types';

interface SimpleSearchProps {
  meta: any;
  onSearch: (filters: TasksQuery) => void;
  onReset: () => void;
}

export const SimpleSearch: React.FC<SimpleSearchProps> = ({ meta: _meta, onSearch, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilter, setQuickFilter] = useState('');

  const handleSearch = () => {
    onSearch({
      q: searchTerm || undefined,
      statusCode: quickFilter || undefined,
      page: '1',
      pageSize: '20',
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setQuickFilter('');
    onReset();
  };

  const quickFilters = [
    { value: '', label: 'همه', color: 'slate' },
    { value: 'Open', label: 'باز', color: 'blue' },
    { value: 'In Progress', label: 'در حال انجام', color: 'yellow' },
    { value: 'Done', label: 'تکمیل', color: 'green' },
    { value: 'Blocked', label: 'مسدود', color: 'red' },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      {/* Search Input */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جست‌وجو در تسک‌ها..."
            className="w-full input pr-10 transition-all duration-200 
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
              hover:border-slate-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
            transition-all duration-200 font-medium transform 
            hover:scale-105 active:scale-95 
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            shadow-md hover:shadow-lg cursor-pointer"
        >
          جست‌وجو
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              setQuickFilter(filter.value);
              onSearch({
                q: searchTerm || undefined,
                statusCode: filter.value || undefined,
                page: '1',
                pageSize: '20',
              });
            }}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium 
              transition-all duration-200 transform
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2
              cursor-pointer
              ${quickFilter === filter.value
                ? filter.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md'
                : filter.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-md'
                : filter.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-md'
                : filter.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-md'
                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-slate-600'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
        
        {(searchTerm || quickFilter) && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 
              rounded-lg text-sm transition-all duration-200 border border-transparent
              hover:border-slate-600 transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-slate-500/50
              cursor-pointer"
          >
            پاک کردن
          </button>
        )}
      </div>
    </div>
  );
};
