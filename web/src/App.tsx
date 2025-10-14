import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex pt-16">
        <Sidebar 
          isOpen={isSidebarOpen} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'mr-64' : 'mr-0'
        }`}>
          <div className="container mx-auto px-4 py-6">
            <ErrorBoundary>
              {renderPage()}
            </ErrorBoundary>
          </div>
        </main>
      </div>
      
      <Toaster 
        position="bottom-left"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.5rem',
            border: '1px solid rgba(59, 130, 246, 0.5)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;