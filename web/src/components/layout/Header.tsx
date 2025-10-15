import React from 'react';
import { Menu, Bell, RefreshCw, User, Calendar, Settings, Sparkles, Keyboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { showShortcutsHelp } from '../../hooks/useKeyboardShortcuts';

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
    toast.loading('در حال بروزرسانی...', { id: 'refresh' });
    
    // Trigger a global refresh
    window.dispatchEvent(new Event('app:refresh'));
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('داده‌ها با موفقیت بروزرسانی شد!', { id: 'refresh', duration: 2000 });
    }, 1000);
  };

  const handleNotifications = () => {
    if (notifications > 0) {
      toast((t) => (
        <div className="text-right space-y-3">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-lg">اعلان‌های جدید</div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {notifications}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors cursor-pointer">
              <span className="text-lg">📋</span>
              <span>2 وظیفه جدید اضافه شد</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors cursor-pointer">
              <span className="text-lg">⏰</span>
              <span>1 وظیفه به تاریخ سررسید نزدیک شده</span>
            </div>
          </div>
          <button
            onClick={() => {
              setNotifications(0);
              toast.dismiss(t.id);
              toast.success('همه اعلان‌ها خوانده شد', { icon: '✅' });
            }}
            className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-[1.02]"
          >
            علامت‌گذاری به عنوان خوانده شده
          </button>
        </div>
      ), {
        duration: 6000,
        icon: '🔔',
        style: {
          minWidth: '350px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      });
    } else {
      toast('اعلان جدیدی وجود ندارد', { icon: 'ℹ️' });
    }
  };

  const handleSettings = () => {
    toast.success('بخش تنظیمات به زودی اضافه می‌شود', {
      icon: '⚙️',
      duration: 3000,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-shift opacity-50" />
      </div>

      <div className="relative z-10 flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Menu Button with Enhanced Animation */}
          <button
            onClick={onToggleSidebar}
            className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer overflow-hidden"
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
            title="منو (Ctrl+B)"
          >
            <Menu className={`w-6 h-6 transition-all duration-500 ${
              isSidebarOpen ? 'rotate-180' : 'rotate-0'
            }`} />
            
            {/* Ripple Effect */}
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-xl" />
            
            {/* Indicator */}
            <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
              isSidebarOpen ? 'bg-blue-500 scale-100' : 'bg-gray-500 scale-0'
            }`} />
          </button>
          
          {/* Logo & Title with Enhanced Hover Effect */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src="/logo-primary.svg"
                alt="Marketing Automation Logo"
                className="w-24 h-auto md:w-32 select-none transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-2xl"
                draggable={false}
              />
              {/* Enhanced Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 animate-pulse" />
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-base md:text-xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
                Project Management System
              </h1>
              <p className="text-xs md:text-sm text-gray-400 font-medium mt-0.5">
                معاونت فناوری اطلاعات - اداره معماری سامانه های مشتری
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Date Display */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
            <Calendar className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">تاریخ امروز</p>
            <p className="text-sm font-bold text-white">{currentDate}</p>
          </div>
          
          {/* Decorative dot */}
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-2" />
        </div>

        {/* Right Section - Enhanced Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Keyboard Shortcuts Helper */}
          <button
            onClick={showShortcutsHelp}
            className="hidden md:block group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="نمایش میانبرهای صفحه‌کلید"
            title="راهنمای میانبرها (Ctrl+/)"
          >
            <Keyboard className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </button>

          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className={`group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            aria-label="بروزرسانی داده‌ها"
            title="بروزرسانی (Ctrl+R)"
            disabled={isRefreshing}
          >
            <RefreshCw className="w-5 h-5" />
            
            {/* Enhanced Pulse Effect */}
            {isRefreshing && (
              <>
                <span className="absolute inset-0 rounded-xl bg-blue-500/30 animate-ping" />
                <span className="absolute inset-0 rounded-xl bg-purple-500/20 animate-pulse" />
              </>
            )}
          </button>
          
          {/* Enhanced Notifications Button */}
          <button
            onClick={handleNotifications}
            className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            aria-label="اعلان‌ها"
            title="اعلان‌ها (Ctrl+N)"
          >
            <Bell className={`w-5 h-5 transition-all duration-300 ${
              notifications > 0 ? 'group-hover:animate-bounce' : ''
            }`} />
            
            {notifications > 0 && (
              <>
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-red-500/50 animate-pulse">
                  {notifications}
                </span>
                {/* Pulse ring */}
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] bg-red-500/50 rounded-full animate-ping" />
              </>
            )}
          </button>
          
          {/* Settings Button */}
          <button
            onClick={handleSettings}
            className="hidden sm:block group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            aria-label="تنظیمات"
            title="تنظیمات (Ctrl+,)"
          >
            <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          </button>
          
          {/* Enhanced Divider */}
          <div className="hidden md:block relative w-px h-10 mx-2">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          </div>
          
          {/* Enhanced User Profile */}
          <div className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden">
            {/* Hover gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/60 transition-all duration-300 group-hover:scale-110">
                <User className="w-5 h-5 text-white" />
              </div>
              
              {/* Enhanced Online Status */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse">
                <span className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
              </span>
              
              {/* Enhanced Premium Badge */}
              <span className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse drop-shadow-lg" />
              </span>
            </div>
            
            <div className="hidden lg:block text-right relative z-10">
              <p className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                مازیار
              </p>
              <p className="text-xs text-gray-400 font-medium">مدیر پروژه</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse" />
      </div>
    </header>
  );
};
