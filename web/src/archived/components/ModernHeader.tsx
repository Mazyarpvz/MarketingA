import React, { useState } from 'react';
import { DatePicker } from './DatePicker';

interface ModernHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const menuItems = [
  { id: 'dashboard', title: 'داشبورد', icon: '🏠', active: true },
  { id: 'projects', title: 'پروژه‌ها', icon: '📁', active: false, badge: '12' },
  { id: 'tasks', title: 'تسک‌ها', icon: '✅', active: false, badge: '45' },
  { id: 'team', title: 'تیم', icon: '👥', active: false },
  { id: 'reports', title: 'گزارشات', icon: '📊', active: false },
  { id: 'analytics', title: 'آنالیتیکس', icon: '📈', active: false },
];

export const ModernHeader: React.FC<ModernHeaderProps> = ({ selectedDate, onDateChange }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex justify-between items-center py-4 border-b border-slate-700/30">
          {/* Logo & Title Section */}
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                داشبورد مدیریت پروژه
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                مدیریت هوشمند پروژه‌ها و تسک‌ها
              </p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Actions Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Date Picker */}
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              label="تاریخ گزارش"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="group relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                <svg className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                خروجی PDF
              </button>

              <button className="group relative inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                <svg className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                تنظیمات
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pr-3 border-r border-slate-700/50">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200">مدیر سیستم</p>
                  <p className="text-xs text-slate-400">آنلاین</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">م</span>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden lg:block py-4">
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`
                  group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeMenu === item.id 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border border-blue-500/20 shadow-lg shadow-blue-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.title}</span>
                {item.badge && (
                  <div className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </div>
                )}
                {activeMenu === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeMenu === item.id 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border border-blue-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1 text-right">{item.title}</span>
                  {item.badge && (
                    <div className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </div>
                  )}
                </button>
              ))}
              
              {/* Mobile Actions */}
              <div className="pt-4 border-t border-slate-700/50 space-y-3">
                <DatePicker
                  value={selectedDate}
                  onChange={onDateChange}
                  label="تاریخ گزارش"
                />
                <div className="flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg">
                    خروجی PDF
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-lg border border-slate-600/50">
                    تنظیمات
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Stats Bar */}
        <div className="border-t border-slate-700/50 pt-3 pb-2">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>سیستم فعال</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>آخرین بروزرسانی: الان</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>پروژه‌های فعال: 12</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>کاربران آنلاین: 8</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
