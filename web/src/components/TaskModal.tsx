import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
  meta: any;
  onSave?: (task: any) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, meta, onSave }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.project_id || '',
    moduleId: task?.module_id || '',
    ownerId: task?.owner_id || '',
    statusCode: task?.status || 'Open',
    startAt: task?.start_at?.split('T')[0] || '',
    dueAt: task?.due_at?.split('T')[0] || '',
    progressPercent: task?.progress_percent || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الزامی است';
    }
    if (!formData.projectId) {
      newErrors.projectId = 'انتخاب پروژه الزامی است';
    }
    if (formData.dueAt && formData.startAt && formData.dueAt < formData.startAt) {
      newErrors.dueAt = 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      addNotification({
        type: 'error',
        title: 'خطا در اعتبارسنجی',
        message: 'لطفاً فیلدهای الزامی را تکمیل کنید',
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: task ? 'تسک بروزرسانی شد' : 'تسک جدید ایجاد شد',
        message: `تسک "${formData.title}" با موفقیت ${task ? 'بروزرسانی' : 'ایجاد'} شد`,
      });
      onSave?.(formData);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              {task ? 'ویرایش تسک' : 'ایجاد تسک جدید'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              عنوان تسک *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="عنوان تسک را وارد کنید"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full input resize-none"
              placeholder="توضیحات تسک را وارد کنید"
            />
          </div>

          {/* Project & Module */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                پروژه *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                className={`w-full input ${errors.projectId ? 'border-red-500' : ''}`}
              >
                <option value="">انتخاب پروژه</option>
                {meta?.projects?.map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.label}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-red-400 text-sm mt-1">{errors.projectId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ماژول
              </label>
              <select
                value={formData.moduleId}
                onChange={(e) => handleChange('moduleId', e.target.value)}
                className="w-full input"
              >
                <option value="">انتخاب ماژول</option>
                {meta?.modules?.map((module: any) => (
                  <option key={module.id} value={module.id}>
                    {module.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Owner & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                مالک
              </label>
              <select
                value={formData.ownerId}
                onChange={(e) => handleChange('ownerId', e.target.value)}
                className="w-full input"
              >
                <option value="">انتخاب مالک</option>
                {meta?.owners?.map((owner: any) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                وضعیت
              </label>
              <select
                value={formData.statusCode}
                onChange={(e) => handleChange('statusCode', e.target.value)}
                className="w-full input"
              >
                {meta?.statuses?.map((status: any) => (
                  <option key={status.id} value={status.code}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                تاریخ شروع
              </label>
              <input
                type="date"
                value={formData.startAt}
                onChange={(e) => handleChange('startAt', e.target.value)}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                تاریخ پایان
              </label>
              <input
                type="date"
                value={formData.dueAt}
                onChange={(e) => handleChange('dueAt', e.target.value)}
                className={`w-full input ${errors.dueAt ? 'border-red-500' : ''}`}
              />
              {errors.dueAt && (
                <p className="text-red-400 text-sm mt-1">{errors.dueAt}</p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              درصد پیشرفت: {formData.progressPercent}%
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progressPercent}
                onChange={(e) => handleChange('progressPercent', parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-16 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${formData.progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-slate-600/50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {task ? 'بروزرسانی' : 'ایجاد تسک'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

