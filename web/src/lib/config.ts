/**
 * تنظیمات اپلیکیشن
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: '/api',
    timeout: 30000, // 30 seconds
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // Date Configuration
  date: {
    format: 'jYYYY/jMM/jDD',
    dateTimeFormat: 'jYYYY/jMM/jDD HH:mm',
    apiFormat: 'YYYY-MM-DD',
  },

  // Query Configuration
  query: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retries: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // UI Configuration
  ui: {
    sidebarWidth: 250,
    headerHeight: 64,
    toastDuration: 3000,
  },

  // Feature Flags
  features: {
    darkMode: true,
    notifications: true,
    export: true,
    analytics: true,
  },
} as const;

export type Config = typeof config;
