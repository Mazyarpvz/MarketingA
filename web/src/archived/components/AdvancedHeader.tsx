import React, { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';

interface AdvancedHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const AdvancedHeader: React.FC<AdvancedHeaderProps> = ({ selectedDate, onDateChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'dashboard', title: 'داشبورد', icon: '📊', color: 'blue' },
    { id: 'tasks', title: 'تسک‌ها', icon: '✓', color: 'green' },
    { id: 'reports', title: 'گزارشات', icon: '📋', color: 'purple' },
    { id: 'analytics', title: 'تحلیل‌ها', icon: '📈', color: 'indigo' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-xl' 
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">د</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-heading-3 text-white group-hover:text-blue-400 transition-colors">
                داشبورد پروژه
              </h1>
              <p className="text-caption text-slate-400">
                مدیریت هوشمند • {formatDate(currentTime)}
              </p>
            </div>
          </div>

          {/* Center: Time & Date */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-caption text-slate-400">زمان فعلی</div>
            </div>
            
            <div className="w-px h-12 bg-white/10"></div>
            
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              label=""
            />
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            {/* Settings */}
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-body-small font-medium text-white">مدیر سیستم</p>
                <p className="text-caption text-slate-400">آنلاین</p>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-medium">م</span>
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 pb-4">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-body-small font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-white/10 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {tab.icon}
              </span>
              <span>{tab.title}</span>
              
              {activeTab === tab.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
