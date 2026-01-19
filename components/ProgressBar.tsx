
import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'indigo' | 'slate';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  size = 'md', 
  color = 'emerald' 
}) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    slate: 'bg-slate-500'
  };

  return (
    <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heights[size]}`}>
      <div 
        className={`${colors[color]} h-full transition-all duration-700 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
