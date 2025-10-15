import React, { useState } from 'react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
  onDeleted?: () => void;
}

export const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ taskId, taskTitle, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.deleteTask(taskId);
      toast.success(`تسک "${taskTitle}" با موفقیت حذف شد`);
      onDeleted?.();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('خطا در حذف تسک');
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">حذف تسک</h3>
              <p className="text-sm text-gray-400">آیا مطمئن هستید؟</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            تسک "<span className="font-bold text-white">{taskTitle}</span>" برای همیشه حذف خواهد شد.
            این عملیات قابل بازگشت نیست.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg
                transition-all duration-200 transform hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg
                transition-all duration-200 transform hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال حذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  حذف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg
        transition-all duration-200 transform hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-500/50"
      title="حذف تسک"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
