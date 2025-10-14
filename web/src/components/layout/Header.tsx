import React from 'react';
import { Menu, Bell, RefreshCw, User, Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);
  const currentDate = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Trigger a global refresh
    window.dispatchEvent(new Event('app:refresh'));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                سیستم اتوماسیون بازاریابی
              </h1>
              <p className="text-xs text-gray-400">Marketing Automation System</p>
            </div>
          </div>
        </div>

        {/* Center section */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{currentDate}</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg hover:bg-gray-800 transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            aria-label="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {notifications}
              </span>
            )}
          </button>
          
          <button
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">مازیار</p>
              <p className="text-xs text-gray-400">مدیر پروژه</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};