import React from 'react';

/**
 * Reusable Card component for academic dashboard layout.
 */
export default function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  glass = false,
  ...props 
}) {
  return (
    <div 
      className={`
        bg-white 
        rounded-[24px] 
        border border-slate-100 
        shadow-sm shadow-indigo-500/5 
        ${hover ? 'transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5' : ''}
        ${glass ? 'glass-card' : ''}
        ${padding} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
