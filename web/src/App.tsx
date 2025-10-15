import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './pages/Dashboard';
import { TaskManager } from './pages/TaskManager';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { useKeyboardShortcuts, showShortcutsHelp } from './hooks/useKeyboardShortcuts';
import toast from 'react-hot-toast';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

type Page = 'dashboard' | 'tasks' | 'analytics' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '/',
      ctrl: true,
      callback: () => showShortcutsHelp(),
      description: 'نمایش راهنمای میانبرها',
    },
    {
      key: 'b',
      ctrl: true,
      callback: () => setIsSidebarOpen(prev => !prev),
      description: 'باز/بسته کردن منوی کناری',
    },
    {
      key: 'r',
      ctrl: true,
      callback: () => {
        window.dispatchEvent(new Event('app:refresh'));
        toast.success('داده‌ها بروزرسانی شد', { icon: '🔄', duration: 2000 });
      },
      description: 'بروزرسانی داده‌ها',
    },
    {
      key: '1',
      ctrl: true,
      callback: () => {
        setCurrentPage('dashboard');
        toast.success('داشبورد', { icon: '📊', duration: 1500 });
      },
      description: 'رفتن به داشبورد',
    },
    {
      key: '2',
      ctrl: true,
      callback: () => {
        setCurrentPage('tasks');
        toast.success('مدیریت وظایف', { icon: '📋', duration: 1500 });
      },
      description: 'رفتن به مدیریت وظایف',
    },
    {
      key: '3',
      ctrl: true,
      callback: () => {
        setCurrentPage('analytics');
        toast.success('تحلیل‌ها', { icon: '📈', duration: 1500 });
      },
      description: 'رفتن به تحلیل‌ها',
    },
    {
      key: '4',
      ctrl: true,
      callback: () => {
        setCurrentPage('settings');
        toast.success('تنظیمات', { icon: '⚙️', duration: 1500 });
      },
      description: 'رفتن به تنظیمات',
    },
  ]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Enhanced Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient - adapts to theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 light:from-slate-100 light:via-blue-100 light:to-purple-100 transition-all duration-1000" />
        
        {/* Animated Orbs with better performance */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob will-change-transform" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 will-change-transform" />
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 will-change-transform" />
        
        {/* Enhanced Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        {/* Subtle noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      </div>

      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex pt-20">
        <Sidebar 
          isOpen={isSidebarOpen} 
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page as Page)}
        />
        
        <main className={`
          flex-1 min-h-[calc(100vh-5rem)]
          transition-all duration-500 ease-out
          ${isSidebarOpen ? 'mr-72' : 'mr-0'}
        `}>
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <ErrorBoundary>
              <div className="animate-fadeIn">
                {renderPage()}
              </div>
            </ErrorBoundary>
          </div>
        </main>
      </div>
      
      {/* Enhanced Toast Notifications */}
      <Toaster 
        position="bottom-left"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#fff',
            borderRadius: '1rem',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
            padding: '16px 20px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(16, 185, 129, 0.3)',
            },
            duration: 3000,
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
            duration: 5000,
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(59, 130, 246, 0.3)',
            },
          },
        }}
      />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradient-shift 3s ease infinite;
        }

        .will-change-transform {
          will-change: transform;
        }

        /* Improved scrollbar styling */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.5);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
        }

        /* Custom selection colors */
        ::selection {
          background-color: rgba(59, 130, 246, 0.3);
          color: white;
        }

        ::-moz-selection {
          background-color: rgba(59, 130, 246, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
