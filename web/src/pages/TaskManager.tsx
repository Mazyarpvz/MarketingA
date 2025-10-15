import React, { useState } from 'react';
import { ListTodo, Clock, CheckCircle, AlertCircle, Plus, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { TaskModal } from '../components/TaskModal';
import toast from 'react-hot-toast';

export const TaskManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const tasks = [
    { 
      id: 1, 
      title: 'طراحی UI جدید برای داشبورد', 
      status: 'In Progress', 
      priority: 'High', 
      assignee: 'احمد محمدی',
      project: 'پروژه مدیریت فروش',
      dueDate: '2025-10-20',
      progress: 65,
      description: 'طراحی رابط کاربری جدید برای صفحه داشبورد با استفاده از Figma'
    },
    { 
      id: 2, 
      title: 'تست عملکرد سیستم ورود', 
      status: 'Done', 
      priority: 'Medium', 
      assignee: 'فاطمه احمدی',
      project: 'پروژه CRM',
      dueDate: '2025-10-18',
      progress: 100,
      description: 'تست کامل فرآیند ورود و احراز هویت کاربران'
    },
    { 
      id: 3, 
      title: 'مستندسازی API endpoints', 
      status: 'Open', 
      priority: 'Low', 
      assignee: 'علی رضایی',
      project: 'پروژه گزارش‌گیری',
      dueDate: '2025-10-25',
      progress: 20,
      description: 'نوشتن مستندات کامل برای تمام API endpoints'
    },
    { 
      id: 4, 
      title: 'بهینه‌سازی query های دیتابیس', 
      status: 'In Progress', 
      priority: 'High', 
      assignee: 'زهرا حسینی',
      project: 'پروژه مدیریت فروش',
      dueDate: '2025-10-22',
      progress: 45,
      description: 'بهینه‌سازی کوئری‌های پرتکرار و اضافه کردن index'
    },
    { 
      id: 5, 
      title: 'رفع باگ‌های گزارش شده', 
      status: 'Blocked', 
      priority: 'High', 
      assignee: 'احمد محمدی',
      project: 'پروژه CRM',
      dueDate: '2025-10-19',
      progress: 30,
      description: 'رفع باگ‌های critical گزارش شده توسط کاربران'
    },
  ];

  const meta = {
    owners: [
      { id: 1, label: 'احمد محمدی' },
      { id: 2, label: 'فاطمه احمدی' },
      { id: 3, label: 'علی رضایی' },
      { id: 4, label: 'زهرا حسینی' }
    ],
    statuses: [
      { id: 1, code: 'Open', label: 'باز' },
      { id: 2, code: 'In Progress', label: 'در حال انجام' },
      { id: 3, code: 'Done', label: 'تکمیل شده' },
      { id: 4, code: 'Blocked', label: 'مسدود شده' }
    ],
    projects: [
      { id: 1, label: 'پروژه مدیریت فروش' },
      { id: 2, label: 'پروژه CRM' },
      { id: 3, label: 'پروژه گزارش‌گیری' }
    ],
    modules: [
      { id: 1, label: 'ماژول فروش' },
      { id: 2, label: 'ماژول مشتری' },
      { id: 3, label: 'ماژول گزارش‌گیری' }
    ]
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
    toast.success('فرم ایجاد تسک جدید باز شد', { icon: '📝', duration: 2000 });
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    toast.success(`ویرایش تسک: ${task.title}`, { icon: '✏️', duration: 2000 });
  };

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    toast.success(`نمایش جزئیات: ${task.title}`, { icon: '👁️', duration: 2000 });
  };

  const handleDuplicateTask = (task: any) => {
    const duplicated = { ...task, id: Date.now(), title: `${task.title} (کپی)` };
    toast.success(`تسک ${task.title} کپی شد`, { icon: '📋', duration: 2000 });
    console.log('Duplicated task:', duplicated);
  };

  const handleDeleteTask = (task: any) => {
    if (confirm(`آیا از حذف تسک "${task.title}" اطمینان دارید؟`)) {
      toast.success(`تسک "${task.title}" حذف شد`, { icon: '🗑️', duration: 2000 });
      console.log('Deleted task:', task.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData: any) => {
    console.log('Task saved:', taskData);
    toast.success('تسک با موفقیت ذخیره شد', { icon: '✅', duration: 2000 });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      'Open': { label: 'باز', class: 'bg-blue-500/20 text-blue-400' },
      'In Progress': { label: 'در حال انجام', class: 'bg-green-500/20 text-green-400' },
      'Done': { label: 'تکمیل شده', class: 'bg-gray-500/20 text-gray-400' },
      'Blocked': { label: 'مسدود', class: 'bg-red-500/20 text-red-400' },
    };
    const { label, class: className } = statusMap[status] || statusMap['Open'];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; class: string }> = {
      'High': { label: 'بالا', class: 'text-red-400' },
      'Medium': { label: 'متوسط', class: 'text-yellow-400' },
      'Low': { label: 'پایین', class: 'text-green-400' },
    };
    const { label, class: className } = priorityMap[priority] || priorityMap['Medium'];
    return <span className={`font-medium ${className}`}>{label}</span>;
  };

  // Stats
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    blocked: tasks.filter(t => t.status === 'Blocked').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="مدیریت تسک‌ها"
        subtitle="مدیریت و پیگیری تسک‌های پروژه"
        icon={ListTodo}
        gradient="from-green-400 to-blue-400"
        actions={
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            تسک جدید
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل تسک‌ها"
          value={stats.total}
          icon={ListTodo}
          gradient="from-blue-500 to-blue-600"
          color="blue"
        />
        <StatCard
          title="تکمیل شده"
          value={stats.done}
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
          color="green"
          change={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="در حال انجام"
          value={stats.inProgress}
          icon={Clock}
          gradient="from-yellow-500 to-yellow-600"
          color="yellow"
        />
        <StatCard
          title="مسدود شده"
          value={stats.blocked}
          icon={AlertCircle}
          gradient="from-red-500 to-red-600"
          color="red"
          change={{ value: -20, isPositive: false }}
        />
      </div>

      {/* Tasks Table */}
      <DataTable
        data={tasks}
        columns={[
          { 
            key: 'title', 
            label: 'عنوان تسک', 
            sortable: true,
            render: (value, item) => (
              <div>
                <div className="font-medium text-white">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{item.project}</div>
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'وضعیت',
            sortable: true,
            render: (value) => getStatusBadge(value)
          },
          { 
            key: 'priority', 
            label: 'اولویت',
            sortable: true,
            render: (value) => getPriorityBadge(value)
          },
          { 
            key: 'assignee', 
            label: 'مسئول',
            sortable: true,
            render: (value) => (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {value.charAt(0)}
                  </span>
                </div>
                <span className="text-gray-300">{value}</span>
              </div>
            )
          },
          { 
            key: 'progress', 
            label: 'پیشرفت',
            render: (value) => (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{value}%</span>
              </div>
            )
          },
          { 
            key: 'dueDate', 
            label: 'سررسید',
            sortable: true,
            render: (value) => (
              <span className="text-gray-300">
                {new Date(value).toLocaleDateString('fa-IR')}
              </span>
            )
          },
        ]}
        actions={(task) => (
          <>
            <button
              onClick={() => handleViewTask(task)}
              className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
              title="نمایش جزئیات"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEditTask(task)}
              className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
              title="ویرایش"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDuplicateTask(task)}
              className="p-2 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors"
              title="کپی"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteTask(task)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
        onRowClick={handleViewTask}
        searchable
        filterable
        exportable
        pageSize={10}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        meta={meta}
        onSave={handleSaveTask}
      />
    </div>
  );
};
