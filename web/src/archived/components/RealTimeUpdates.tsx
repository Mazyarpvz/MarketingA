import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface RealTimeUpdatesProps {
  selectedDate: string;
  onDataUpdate?: () => void;
}

export const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({ 
  selectedDate, 
  onDataUpdate 
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const queryClient = useQueryClient();

  const refreshData = useCallback(async () => {
    try {
      // Invalidate and refetch all queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['kpi', selectedDate] }),
        queryClient.invalidateQueries({ queryKey: ['statusCounts', selectedDate] }),
        queryClient.invalidateQueries({ queryKey: ['ownerCounts', selectedDate] }),
        queryClient.invalidateQueries({ queryKey: ['overdue', selectedDate] }),
        queryClient.invalidateQueries({ queryKey: ['dueThisWeek', selectedDate] }),
        queryClient.invalidateQueries({ queryKey: ['tasks'] }),
      ]);

      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      onDataUpdate?.();
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsConnected(false);
    }
  }, [queryClient, selectedDate, onDataUpdate]);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  useEffect(() => {
    // Refresh when date changes
    refreshData();
  }, [selectedDate, refreshData]);

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'همین الان';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-slate-400">
          {isConnected ? 'آنلاین' : 'آفلاین'}
        </span>
      </div>

      {/* Last Update */}
      <div className="text-slate-400">
        آخرین بروزرسانی: {formatLastUpdate(lastUpdate)}
      </div>

      {/* Update Count */}
      {updateCount > 0 && (
        <div className="text-slate-400">
          {updateCount} بروزرسانی
        </div>
      )}

      {/* Manual Refresh Button */}
      <button
        onClick={refreshData}
        className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="بروزرسانی دستی"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-xs">بروزرسانی</span>
      </button>
    </div>
  );
};