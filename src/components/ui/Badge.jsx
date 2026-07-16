/**
 * Reusable Badge component for academic status, grade letters, and grade points.
 */
export default function Badge({
  children,
  variant = 'purple', // purple, green, red, slate
  className = '',
  size = 'md',
  ...props
}) {
  const variantStyles = {
    purple: 'bg-[#F5E6D3] text-[#8B4F32]',
    green: 'bg-[#D4E8D6] text-[#4A6E4D]',
    red: 'bg-rose-100 text-rose-800',
    slate: 'bg-stone-100 text-stone-800',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-sm px-3 py-1.5 font-black',
  };

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