import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  isInteractive = false,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-card',
    elevated: 'bg-white border border-slate-200 shadow-card-hover',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-card',
  };

  const interactiveStyles = isInteractive
    ? 'hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
