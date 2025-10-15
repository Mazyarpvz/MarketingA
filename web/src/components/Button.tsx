import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 active:from-blue-700 active:via-blue-600 active:to-indigo-700',
  secondary: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 text-slate-100 shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/40 active:from-slate-800 active:via-slate-700 active:to-slate-800',
  success: 'bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 active:from-green-700 active:via-emerald-600 active:to-teal-700',
  danger: 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:from-red-500 hover:via-rose-400 hover:to-pink-500 text-white shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60 active:from-red-700 active:via-rose-600 active:to-pink-700',
  ghost: 'bg-white/5 backdrop-blur-sm hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 hover:border-white/20 shadow-sm hover:shadow-md',
  outline: 'bg-transparent border-2 border-white/20 hover:border-white/40 text-gray-200 hover:text-white hover:bg-white/5 shadow-sm hover:shadow-md',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-6 py-3 text-base gap-2.5',
  lg: 'px-8 py-4 text-lg gap-3',
  xl: 'px-10 py-5 text-xl gap-3.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'right',
  children,
  className,
  disabled,
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center',
        'font-semibold tracking-wide',
        'rounded-xl overflow-hidden',
        'transition-all duration-300 ease-out transform-gpu',
        'hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100',
        'cursor-pointer',
        'group',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Ripple Effect Background */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
        <span 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-white/20 group-active:w-[500px] group-active:h-[500px] transition-all duration-500"
        />
      </span>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-inherit">
        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Icon - Left */}
        {icon && !isLoading && iconPosition === 'left' && (
          <span className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 transform-gpu">
            {icon}
          </span>
        )}
        
        {/* Text */}
        <span className="relative">
          {children}
          
          {/* Underline Effect */}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300" />
        </span>
        
        {/* Icon - Right */}
        {icon && !isLoading && iconPosition === 'right' && (
          <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 transform-gpu">
            {icon}
          </span>
        )}
      </span>

      {/* Top Shine Effect */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
