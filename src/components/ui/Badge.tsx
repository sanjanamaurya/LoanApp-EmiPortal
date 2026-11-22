import React from 'react';
import { ApplicationStatus } from '../../types';

export interface BadgeProps {
  status: ApplicationStatus | 'All';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    Pending: {
      bg: 'bg-amber-50 border-amber-200/80',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    'Under Review': {
      bg: 'bg-blue-50 border-blue-200/80',
      text: 'text-blue-800',
      dot: 'bg-blue-500',
    },
    Approved: {
      bg: 'bg-emerald-50 border-emerald-200/80',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
    },
    Rejected: {
      bg: 'bg-rose-50 border-rose-200/80',
      text: 'text-rose-800',
      dot: 'bg-rose-500',
    },
    All: {
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
    },
  };

  const current = styles[status] || styles.All;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{status}</span>
    </span>
  );
};
