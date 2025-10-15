import React from 'react';
import { LayoutDashboard, ListChecks, BarChart3, Settings, ChevronLeft } from 'lucide-react';

type Page = 'dashboard' | 'tasks' | 'analytics' | 'settings';

interface SidebarProps {
  isOpen: boolean;
  currentPage: Page | string;
  onPageChange: (page: Page) => void;
}

const items: Array<{ key: Page; label: string; icon: React.ReactNode; description: string }> = [
  { 
    key: 'dashboard', 
    label: 'داشبورد', 
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: 'نمای کلی پروژه'
  },
  { 
    key: 'tasks', 
    label: 'مدیریت وظایف', 
    icon: <ListChecks className="w-5 h-5" />,
    description: 'وظایف و پروژه‌ها'
  },
  { 
    key: 'analytics', 
    label: 'تحلیل‌ها', 
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'گزارش‌ها و آمار'
  },
  { 
    key: 'settings', 
    label: 'تنظیمات', 
    icon: <Settings className="w-5 h-5" />,
    description: 'تنظیمات سیستم'
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, onPageChange }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => {/* Mobile overlay click handler can be added here */}}
        />
      )}

      <aside
        className={`
          fixed top-20 right-0 bottom-0 z-50
          w-72 
          bg-gradient-to-b from-slate-900/95 via-blue-900/90 to-purple-900/95
          backdrop-blur-2xl
          border-l border-white/10
          shadow-2xl
          transition-all duration-500 ease-out
          overflow-y-auto custom-scrollbar
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
        `}
        aria-hidden={!isOpen}
      >
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        
        {/* Navigation */}
        <nav className="relative py-6 px-4">
          <ul className="space-y-2">
            {items.map((item, index) => {
              const active = (currentPage as Page) === item.key;
              return (
                <li 
                  key={item.key}
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  <button
                    onClick={() => onPageChange(item.key)}
                    className={`
                      group relative w-full
                      flex items-center justify-between gap-3
                      px-4 py-4 rounded-2xl
                      transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      overflow-hidden
                      ${active
                        ? 'bg-gradient-to-l from-blue-600/30 via-purple-600/30 to-blue-600/30 text-white shadow-lg shadow-blue-500/20 scale-105'
                        : 'hover:bg-white/5 text-gray-300 hover:text-white hover:scale-102'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Background Glow Effect */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10 animate-pulse" />
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex-1 text-right">
                      <div className="flex items-center justify-between">
                        <span className={`text-base font-bold transition-all duration-300 ${
                          active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}>
                          {item.label}
                        </span>
                        
                        <span className={`shrink-0 transition-all duration-300 ${
                          active ? 'text-blue-300 scale-110' : 'text-gray-400 group-hover:text-blue-300 group-hover:scale-110'
                        }`}>
                          {item.icon}
                        </span>
                      </div>
                      
                      <p className={`text-xs mt-1 transition-all duration-300 ${
                        active ? 'text-blue-200' : 'text-gray-500 group-hover:text-gray-400'
                      }`}>
                        {item.description}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full shadow-lg shadow-blue-500/50" />
                    )}

                    {/* Hover Arrow */}
                    <ChevronLeft className={`
                      absolute left-2 w-4 h-4
                      transition-all duration-300
                      ${active 
                        ? 'opacity-100 translate-x-0 text-blue-300' 
                        : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400'
                      }
                    `} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Info Card */}
        <div className="mx-4 mb-6 mt-8">
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 shadow-xl">
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xl">ℹ️</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">راهنمای سیستم</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    سیستم مدیریت پروژه با پشتیبانی کامل از تقویم جلالی
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>سرور API فعال و در دسترس</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>همگام‌سازی خودکار فعال</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm">
          <div className="text-center text-xs text-gray-500">
            <p className="font-medium">نسخه 2.0.0</p>
            <p className="text-[10px] mt-1">© 2024 معاونت فناوری اطلاعات</p>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
