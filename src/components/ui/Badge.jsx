import React from 'react';

/**
 * Reusable Badge component for academic status, grade letters, and grade points.
 */
export default function Badge({
  children,
  variant = 'purple', // purple, green, yellow, red, blue, slate, primary
  circle = false,
  className = '',
  size = 'md',
  ...props
}) {
  const variantStyles = {
    purple: 'bg-primary-100 text-primary-800',
    green: 'bg-emerald-100 text-emerald-800',
    yellow: 'bg-amber-100 text-amber-800',
    red: 'bg-rose-100 text-rose-800',
    blue: 'bg-blue-100 text-blue-800',
    slate: 'bg-slate-100 text-slate-800',
    primary: 'bg-primary-600 text-white',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-sm px-3 py-1.5 font-black',
  };

  if (circle) {
    return (
      <span
        className={`
          inline-flex items-center justify-center
          w-7 h-7 rounded-full text-xs font-black shrink-0
          ${variantStyles[variant]} ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-xl tracking-wide select-none
        ${sizeStyles[size]} ${variantStyles[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}