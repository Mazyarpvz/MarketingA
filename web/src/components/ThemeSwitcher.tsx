import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'روشن' },
    { value: 'dark' as const, icon: Moon, label: 'تاریک' },
    { value: 'system' as const, icon: Monitor, label: 'سیستم' },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1];

  const handleThemeChange = () => {
    const currentIndex = themes.findIndex(t => t.value === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  return (
    <button
      onClick={handleThemeChange}
      className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      aria-label={`تغییر تم به ${themes[(themes.findIndex(t => t.value === theme) + 1) % themes.length].label}`}
      title={`تم فعلی: ${currentTheme.label} - کلیک برای تغییر`}
    >
      <currentTheme.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      
      {/* Theme indicator */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
    </button>
  );
};
