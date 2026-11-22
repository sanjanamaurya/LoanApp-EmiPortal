import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="h-10 bg-slate-100 rounded-xl flex items-center px-4 gap-4 animate-pulse">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 bg-white border border-slate-100 rounded-xl flex items-center px-4 gap-4 animate-pulse">
          <Skeleton className="w-24 h-5" />
          <Skeleton className="w-44 h-5" />
          <Skeleton className="w-28 h-5" />
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
};
