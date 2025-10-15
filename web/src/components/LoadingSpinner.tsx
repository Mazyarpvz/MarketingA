import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'pink' | 'white';
  fullScreen?: boolean;
  text?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const colorClasses = {
  blue: 'border-blue-500',
  purple: 'border-purple-500',
  pink: 'border-pink-500',
  white: 'border-white',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
  text,
}) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Modern Spinner Design */}
      <div className="relative">
        {/* Outer Ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-white/10`}
        />
        
        {/* Animated Ring */}
        <div
          className={`
            absolute inset-0
            ${sizeClasses[size]} 
            rounded-full 
            border-4 
            border-transparent
            ${colorClasses[color]}
            border-t-transparent
            animate-spin
          `}
          style={{
            animationDuration: '1s',
          }}
        />
        
        {/* Inner Glow */}
        <div
          className={`
            absolute inset-0
            ${sizeClasses[size]} 
            rounded-full 
            bg-gradient-to-tr from-${color}-500/20 to-transparent
            blur-sm
            animate-pulse
          `}
        />

        {/* Center Dot */}
        <div
          className={`
            absolute inset-0 m-auto
            w-2 h-2
            rounded-full 
            bg-gradient-to-br from-${color}-400 to-${color}-600
            animate-ping
          `}
        />
      </div>

      {/* Loading Text */}
      {text && (
        <div className="text-center space-y-2">
          <p className="text-white font-medium animate-pulse">
            {text}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-xl">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="relative z-10">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

// Alternative Spinner Styles
export const DotsLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${dotSizes[size]} 
            rounded-full 
            bg-gradient-to-br from-blue-500 to-purple-600
            animate-bounce
          `}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
};

export const PulseLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"
            style={{
              animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          </div>
        </div>
      </div>
      {text && (
        <p className="text-white font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const ProgressLoader: React.FC<{ progress?: number; text?: string }> = ({ 
  progress = 0, 
  text 
}) => {
  return (
    <div className="w-full max-w-md space-y-4 p-6">
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
      {text && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{text}</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
