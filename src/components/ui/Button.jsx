import React from 'react';

/**
 * Reusable Button component with academic pastel & purple styling variants.
 */
export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline, dashed, ghost, danger
  size = 'md', // sm, md, lg, icon
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    icon: 'p-2 text-sm aspect-square rounded-xl',
  };

  const variantStyles = {
    primary: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35',
    secondary: 'bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#4F46E5] font-extrabold',
    pastelGreen: 'bg-[#D1FAE5] hover:bg-[#A7F3D0] text-emerald-800 font-extrabold',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold',
    dashed: 'border-2 border-dashed border-[#4F46E5]/40 hover:border-[#4F46E5] bg-indigo-50/50 hover:bg-indigo-100/50 text-[#4F46E5] font-extrabold',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 font-bold',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
