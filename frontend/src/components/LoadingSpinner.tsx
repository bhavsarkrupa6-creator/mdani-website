import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; full?: boolean }> = ({ size = 'md', full }) => {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  const spinner = <div className={`${s} rounded-full border-2 border-white/10 border-t-navy-300 animate-spin`} />;
  if (full) return <div className="flex items-center justify-center py-24">{spinner}</div>;
  return spinner;
};

export default LoadingSpinner;
