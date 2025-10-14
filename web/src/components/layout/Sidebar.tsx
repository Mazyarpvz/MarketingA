import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  Settings,
  Users,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, onPageChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: LayoutDashboard,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'tasks',
      label: 'مدیریت تسک‌ها',
      icon: ListTodo,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'analytics',
      label: 'تحلیل و گزارش',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'settings',
      label: 'تنظیمات',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
    },
  ];

  const quickStats = [
    { label: 'تسک‌های امروز', value: '8', icon: Clock, color: 'text-blue-400' },
    { label: 'در انتظار', value: '3', icon: Target, color: 'text-yellow-400' },
    { label: 'تکمیل شده', value: '15', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <aside
      className={`fixed right-0 top-16 bottom-0 w-64 bg-gray-900/50 backdrop-blur-xl border-l border-gray-700/50 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">
            منو اصلی
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <span className="mr-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
            آمار سریع
          </h3>
          <div className="space-y-2">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm text-gray-300">{stat.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">نسخه سیستم</p>
              <p className="text-xs text-gray-500">v2.0.0 - Enterprise</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
};