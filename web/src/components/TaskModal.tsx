import React, { useState } from 'react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';
import TaskDependencies from './TaskDependencies';
import { FileText, Link2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
  meta: any;
  onSave?: (task: any) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, meta, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'dependencies'>('details');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('لطفاً فیلدهای الزامی را تکمیل کنید');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        projectId: parseInt(formData.projectId),
        moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
        ownerId: formData.ownerId ? parseInt(formData.ownerId) : null,
        statusCode: formData.statusCode,
        startAt: formData.startAt || null,
        dueAt: formData.dueAt || null,
        progressPercent: formData.progressPercent,
      };

      if (task) {
        // Update existing task
        await apiClient.updateTask(task.task_id, taskData);
        toast.success(`تسک "${formData.title}" با موفقیت بروزرسانی شد`);
      } else {
        // Create new task
        const result = await apiClient.createTask(taskData);
        toast.success(`تسک "${formData.title}" با موفقیت ایجاد شد`);
        console.log('Task created:', result);
      }
      
      onSave?.(formData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(task ? 'خطا در بروزرسانی تسک' : 'خطا در ایجاد تسک');
    } finally {
      setIsSubmitting(false);
    }
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
            className="text-slate-400 hover:text-white transition-all duration-200 p-2 
              hover:bg-slate-700/50 rounded-lg transform hover:scale-110 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-slate-500/50 cursor-pointer"
            aria-label="بستن"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        {task && (
          <div className="flex border-b border-slate-700/50">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'details'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              جزئیات
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dependencies')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'dependencies'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link2 className="w-4 h-4" />
              وابستگی‌ها
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === 'details' ? (
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
              className={`w-full input transition-all duration-200
                focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                hover:border-slate-600
                ${errors.title ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
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
              className="w-full input resize-none transition-all duration-200
                focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                hover:border-slate-600"
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
                className={`w-full input transition-all duration-200 cursor-pointer
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  hover:border-slate-600
                  ${errors.projectId ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
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
                className="w-full input transition-all duration-200 cursor-pointer
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  hover:border-slate-600"
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
                className="w-full input transition-all duration-200 cursor-pointer
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  hover:border-slate-600"
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
                className="w-full input transition-all duration-200 cursor-pointer
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  hover:border-slate-600"
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
                className="w-full input transition-all duration-200 cursor-pointer
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  hover:border-slate-600"
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
                className={`w-full input transition-all duration-200 cursor-pointer
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  hover:border-slate-600
                  ${errors.dueAt ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
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
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                  transition-all duration-200 hover:h-3"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${formData.progressPercent}%, rgb(51, 65, 85) ${formData.progressPercent}%, rgb(51, 65, 85) 100%)`
                }}
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
              className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white 
                py-3 px-4 rounded-lg font-medium transition-all duration-200 border border-slate-600/50
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-slate-500/50 cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg 
                font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ذخیره...
                </>
              ) : (
                task ? 'بروزرسانی' : 'ایجاد تسک'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

