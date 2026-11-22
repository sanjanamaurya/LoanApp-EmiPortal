import React from 'react';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 ${className}`}>
      {children}
    </main>
  );
};
