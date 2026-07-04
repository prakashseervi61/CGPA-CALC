import React from 'react';

/**
 * Reusable Badge component for academic status, grade letters, and grade points.
 */
export default function Badge({
  children,
  variant = 'purple', // purple, green, yellow, red, blue, slate
  circle = false,
  className = '',
  size = 'md',
  ...props
}) {
  const variantStyles = {
    purple: 'bg-[#E0E7FF] text-[#4F46E5]',
    green: 'bg-[#D1FAE5] text-emerald-800',
    yellow: 'bg-[#FEF3C7] text-amber-800',
    red: 'bg-[#FEE2E2] text-rose-700',
    blue: 'bg-[#DBEAFE] text-blue-800',
    slate: 'bg-slate-100 text-slate-700',
    primary: 'bg-[#4F46E5] text-white',
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
