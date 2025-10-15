import React, { useState, useEffect } from 'react';
import { Plus, Link2, Trash2, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../api/client';
import { LoadingSpinner, LoadingCard } from './LoadingStates';
import Modal from './Modal';
import Button from './Button';

interface DependencyType {
  id: number;
  type_key: string;
  type_label_fa: string;
  type_label_en: string;
  description: string;
  color: string;
}

interface Dependency {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type: string;
  created_at: string;
  created_by: string;
  notes?: string;
  task_title: string;
  depends_on_title: string;
  dependency_label: string;
  dependency_color: string;
}

interface DependencySummary {
  task_id: number;
  depends_on: Dependency[];
  dependents: Dependency[];
  summary: {
    depends_on_count: number;
    dependents_count: number;
    total_dependencies: number;
  };
}

interface TaskDependenciesProps {
  taskId: number;
  taskTitle: string;
  onUpdate?: () => void;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({ taskId, taskTitle, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [dependencies, setDependencies] = useState<DependencySummary | null>(null);
  const [dependencyTypes, setDependencyTypes] = useState<DependencyType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDependencies();
    fetchDependencyTypes();
    fetchTasks();
  }, [taskId]);

  const fetchDependencies = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/dependencies/task/${taskId}`);
      setDependencies(response.data);
    } catch (error) {
      console.error('Error fetching dependencies:', error);
      toast.error('خطا در دریافت وابستگی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencyTypes = async () => {
    try {
      const response = await apiClient.get('/dependencies/types');
      setDependencyTypes(response.data.types);
      if (response.data.types.length > 0) {
        setSelectedType(response.data.types[0].type_key);
      }
    } catch (error) {
      console.error('Error fetching dependency types:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks');
      setTasks(response.data.rows.filter((t: any) => t.task_id !== taskId));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddDependency = async () => {
    if (!selectedTaskId) {
      toast.error('لطفاً یک تسک انتخاب کنید');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/dependencies', {
        task_id: taskId,
        depends_on_task_id: parseInt(selectedTaskId),
        dependency_type: selectedType,
        notes: notes || undefined,
      });
      
      toast.success('وابستگی با موفقیت اضافه شد');
      setShowAddModal(false);
      setSelectedTaskId('');
      setNotes('');
      fetchDependencies();
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در افزودن وابستگی');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDependency = async (depId: number) => {
    if (!confirm('آیا از حذف این وابستگی اطمینان دارید؟')) return;

    try {
      await apiClient.delete(`/dependencies/${depId}`);
      toast.success('وابستگی با موفقیت حذف شد');
      fetchDependencies();
      onUpdate?.();
    } catch (error) {
      toast.error('خطا در حذف وابستگی');
    }
  };

  if (loading) {
    return <LoadingCard lines={3} />;
  }

  if (!dependencies) {
    return <div className="text-gray-500 text-center py-4">داده‌ای یافت نشد</div>;
  }

  const renderDependencyItem = (dep: Dependency, type: 'depends_on' | 'dependent') => {
    const isDependent = type === 'dependent';
    const otherTaskTitle = isDependent ? dep.task_title : dep.depends_on_title;
    const otherTaskId = isDependent ? dep.task_id : dep.depends_on_task_id;

    return (
      <div
        key={dep.id}
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            {isDependent ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">این تسک</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            ) : (
              <Link2 className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${dep.dependency_color}20`,
                color: dep.dependency_color,
                borderColor: dep.dependency_color,
                borderWidth: 1,
                borderStyle: 'solid'
              }}
            >
              {dep.dependency_label}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {otherTaskTitle}
            </span>
          </div>
          
          {dep.notes && (
            <span className="text-xs text-gray-500 dark:text-gray-400">({dep.notes})</span>
          )}
        </div>
        
        <button
          onClick={() => handleDeleteDependency(dep.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          title="حذف وابستگی"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          وابستگی‌های تسک
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          افزودن وابستگی
        </Button>
      </div>

      {/* Summary */}
      {dependencies.summary.total_dependencies > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dependencies.summary.depends_on_count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">وابسته به</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dependencies.summary.dependents_count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">وابسته‌ها</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dependencies.summary.total_dependencies}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">مجموع</div>
          </div>
        </div>
      )}

      {/* Dependencies List */}
      <div className="space-y-6">
        {/* Tasks this task depends on */}
        {dependencies.depends_on.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              این تسک وابسته به:
            </h4>
            <div className="space-y-2">
              {dependencies.depends_on.map(dep => renderDependencyItem(dep, 'depends_on'))}
            </div>
          </div>
        )}

        {/* Tasks that depend on this task */}
        {dependencies.dependents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              تسک‌های وابسته به این تسک:
            </h4>
            <div className="space-y-2">
              {dependencies.dependents.map(dep => renderDependencyItem(dep, 'dependent'))}
            </div>
          </div>
        )}

        {dependencies.summary.total_dependencies === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>هیچ وابستگی تعریف نشده است</p>
          </div>
        )}
      </div>

      {/* Add Dependency Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="افزودن وابستگی جدید"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع وابستگی
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            >
              {dependencyTypes.map(type => (
                <option key={type.type_key} value={type.type_key}>
                  {type.type_label_fa} - {type.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              انتخاب تسک
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">انتخاب کنید...</option>
              {tasks.map(task => (
                <option key={task.task_id} value={task.task_id}>
                  {task.title} ({task.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات (اختیاری)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="توضیحات اضافی..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={submitting}
            >
              انصراف
            </Button>
            <Button
              variant="primary"
              onClick={handleAddDependency}
              disabled={submitting || !selectedTaskId}
              className="min-w-[100px]"
            >
              {submitting ? <LoadingSpinner size="sm" /> : 'افزودن'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDependencies;
