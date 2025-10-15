import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = !!s.ctrl === event.ctrlKey;
        const altMatch = !!s.alt === event.altKey;
        const shiftMatch = !!s.shift === event.shiftKey;
        
        return keyMatch && ctrlMatch && altMatch && shiftMatch;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const showShortcutsHelp = () => {
  toast('راهنمای میانبرهای صفحه‌کلید:\n\n' +
    'Ctrl + / - نمایش این راهنما\n' +
    'Ctrl + B - باز/بسته کردن منو\n' +
    'Ctrl + R - بروزرسانی داده‌ها\n' +
    'Ctrl + 1 - داشبورد\n' +
    'Ctrl + 2 - مدیریت وظایف\n' +
    'Ctrl + 3 - تحلیل‌ها\n' +
    'Ctrl + 4 - تنظیمات', {
    duration: 8000,
    icon: '⌨️',
    style: {
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff',
      borderRadius: '1rem',
      padding: '16px 20px',
      whiteSpace: 'pre-line',
      textAlign: 'right',
    }
  });
};
