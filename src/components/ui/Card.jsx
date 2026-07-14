import React from 'react';

/**
 * Reusable Card component for academic dashboard layout.
 */
export default function Card({
  children,
  className = '',
  padding = 'p-6',
  ...props
}) {
  return (
    <div className={`
      bg-white
      rounded-[24px]
      border border-slate-100
      shadow-sm shadow-primary-500/5
      ${padding}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
  );
}