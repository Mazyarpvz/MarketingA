import React from 'react';
import { Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

// Spinner Component
export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
  );
};

// Loading Button
export const LoadingButton: React.FC<{
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  loading = false, 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <Spinner size="sm" className="ml-2" />}
      {children}
    </button>
  );
};

// Loading Card
export const LoadingCard: React.FC<{
  title?: string;
  description?: string;
  className?: string;
}> = ({ title = 'در حال بارگذاری...', description, className = '' }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 ${className}`}>
      <div className="flex items-center justify-center space-x-3 space-x-reverse">
        <Spinner size="lg" className="text-blue-500" />
        <div className="text-right">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-white/10 rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Loading Table
export const LoadingTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-white/20 rounded" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-white/5 p-4 last:border-b-0">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 bg-white/10 rounded ${
                    Math.random() > 0.5 ? 'w-full' : 'w-3/4'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading State with Message
export const LoadingState: React.FC<{
  type?: 'loading' | 'error' | 'success' | 'empty';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}> = ({ 
  type = 'loading', 
  title, 
  description, 
  action,
  className = '' 
}) => {
  const configs = {
    loading: {
      icon: <Spinner size="lg" className="text-blue-500" />,
      title: title || 'در حال بارگذاری...',
      description: description || 'لطفاً صبر کنید',
      bgColor: 'bg-blue-500/10'
    },
    error: {
      icon: <AlertCircle className="w-8 h-8 text-red-500" />,
      title: title || 'خطا در بارگذاری',
      description: description || 'مشکلی پیش آمده است',
      bgColor: 'bg-red-500/10'
    },
    success: {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: title || 'موفقیت‌آمیز',
      description: description || 'عملیات با موفقیت انجام شد',
      bgColor: 'bg-green-500/10'
    },
    empty: {
      icon: <div className="w-8 h-8 rounded-full bg-gray-400/20" />,
      title: title || 'داده‌ای یافت نشد',
      description: description || 'هیچ موردی برای نمایش وجود ندارد',
      bgColor: 'bg-gray-500/10'
    }
  };

  const config = configs[type];

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className={`p-4 rounded-full ${config.bgColor} mb-4`}>
        {config.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {config.description}
      </p>
      
      {action && (
        <LoadingButton
          onClick={action.onClick}
          variant="primary"
        >
          {action.label}
        </LoadingButton>
      )}
    </div>
  );
};

// Inline Loading
export const InlineLoading: React.FC<{
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ text = 'بارگذاری...', size = 'sm', className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 space-x-reverse ${className}`}>
      <Spinner size={size} />
      <span className="text-gray-400 text-sm">{text}</span>
    </div>
  );
};

// Progress Bar
export const ProgressBar: React.FC<{
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}> = ({ progress, label, showPercentage = true, className = '' }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-400">{clampedProgress}%</span>
          )}
        </div>
      )}
      
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
