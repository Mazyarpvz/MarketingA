import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getProgressColor = () => {
    if (progress >= 75) return 'from-green-500 to-green-600';
    if (progress >= 50) return 'from-blue-500 to-blue-600';
    if (progress >= 25) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">{label}</h3>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {progress.toFixed(1)}%
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
            style={{ width: `${animatedProgress}%` }}
          >
            {animatedProgress > 10 && (
              <span className="text-xs font-bold text-white">
                {animatedProgress.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
        
        {/* Progress markers */}
        <div className="absolute top-0 left-0 w-full h-6 flex">
          {[25, 50, 75].map((marker) => (
            <div
              key={marker}
              className="absolute h-full border-r border-gray-600 opacity-50"
              style={{ left: `${marker}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};