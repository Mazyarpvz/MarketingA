import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationSystem';

interface AdvancedTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: any;
  onSave: (task: any) => void;
  task?: any; // For editing existing task
}

export const AdvancedTaskModal: React.FC<AdvancedTaskModalProps> = ({
  isOpen,
  onClose,
  meta,
  onSave,
  task
}) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    moduleId: '',
    ownerId: '',
    statusId: '',
    priority: 'medium',
    startDate: '',
    dueDate: '',
    progress: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id || '',
        moduleId: task.module_id || '',
        ownerId: task.owner_id || '',
        statusId: task.status_id || '',
        priority: task.priority || 'medium',
        startDate: task.start_at ? task.start_at.split('T')[0] : '',
        dueDate: task.due_at ? task.due_at.split('T')[0] : '',
        progress: task.progress_percent || 0,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: '',
        moduleId: '',
        ownerId: '',
        statusId: '',
        priority: 'medium',
        startDate: '',
        dueDate: '',
        progress: 0,
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      addNotification({
        type: 'success',
        title: 'موفقیت',
        message: task ? 'تسک بروزرسانی شد' : 'تسک جدید ایجاد شد',
      });
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'خطا',
        message: 'خطا در ذخیره تسک',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-heading-2 text-white">
            {task ? 'ویرایش تسک' : 'تسک جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full input"
              placeholder="عنوان تسک را وارد کنید..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full input min-h-[100px] resize-none"
              placeholder="توضیحات تسک را وارد کنید..."
              rows={4}
            />
          </div>

          {/* Project and Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                پروژه *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                className="w-full input"
                required
              >
                <option value="">انتخاب پروژه</option>
                {meta?.projects?.map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ماژول
              </label>
              <select
                value={formData.moduleId}
                onChange={(e) => handleInputChange('moduleId', e.target.value)}
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

          {/* Owner and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                مالک *
              </label>
              <select
                value={formData.ownerId}
                onChange={(e) => handleInputChange('ownerId', e.target.value)}
                className="w-full input"
                required
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
                وضعیت *
              </label>
              <select
                value={formData.statusId}
                onChange={(e) => handleInputChange('statusId', e.target.value)}
                className="w-full input"
                required
              >
                <option value="">انتخاب وضعیت</option>
                {meta?.statuses?.map((status: any) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                اولویت
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full input"
              >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">بالا</option>
                <option value="urgent">فوری</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                پیشرفت: {formData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                تاریخ شروع
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                تاریخ سررسید *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full input"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {task ? 'بروزرسانی' : 'ایجاد'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
