import React, { useState } from 'react';
import { DatePicker } from './DatePicker';

interface MinimalHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({ selectedDate, onDateChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', title: 'داشبورد', icon: '📊' },
    { id: 'tasks', title: 'تسک‌ها', icon: '✓' },
    { id: 'reports', title: 'گزارشات', icon: '📋' },
  ];

  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Header */}
        <div className="flex items-center justify-between py-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">د</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">داشبورد پروژه</h1>
              <p className="text-slate-400 text-sm">مدیریت هوشمند</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Date Picker */}
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              label=""
            />

            {/* User Profile - Minimal */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">مدیر سیستم</p>
                <p className="text-xs text-slate-400">آنلاین</p>
              </div>
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">م</span>
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Navigation */}
        <div className="flex items-center gap-1 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.title}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
