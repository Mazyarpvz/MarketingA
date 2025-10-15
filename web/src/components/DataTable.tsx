import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
  loading?: boolean;
}

export function DataTable<T extends { id?: any }>({ 
  data, 
  columns, 
  onRowClick,
  actions,
  searchable = true,
  filterable = false,
  exportable = false,
  pageSize = 10,
  loading = false
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search
  const filteredData = searchTerm 
    ? data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aValue = (a as any)[sortColumn];
        const bValue = (b as any)[sortColumn];
        const direction = sortDirection === 'asc' ? 1 : -1;
        return aValue > bValue ? direction : -direction;
      })
    : filteredData;

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    toast.success('داده‌ها در حال Export هستند...', { icon: '📥', duration: 2000 });
    // Export logic here
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(searchable || filterable || exportable) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}
          <div className="flex gap-2">
            {filterable && (
              <button 
                onClick={() => toast('فیلتر در حال توسعه است', { icon: '🔍', duration: 2000 })}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                فیلتر
              </button>
            )}
            {exportable && (
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    onClick={() => column.sortable && handleSort(column.key as string)}
                    className={`px-6 py-4 text-right text-sm font-semibold text-gray-300 ${
                      column.sortable ? 'cursor-pointer hover:text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-blue-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">عملیات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-gray-400">
                    داده‌ای یافت نشد
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIndex) => (
                  <tr
                    key={item.id || rowIndex}
                    onClick={() => onRowClick?.(item)}
                    className={`hover:bg-gray-700/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 text-sm text-gray-300">
                        {column.render 
                          ? column.render((item as any)[column.key], item)
                          : String((item as any)[column.key] || '-')
                        }
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {actions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              نمایش {startIndex + 1} تا {Math.min(startIndex + pageSize, sortedData.length)} از {sortedData.length} مورد
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
