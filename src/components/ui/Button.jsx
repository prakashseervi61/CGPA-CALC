/**
 * Reusable Button component with academic pastel & purple styling variants.
 */
export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline
  size = 'md', // sm, md, lg
  icon: Icon = null,
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
  };

  const variantStyles = {
    primary: 'bg-[#C27856] hover:bg-[#A8623E] text-white shadow-md shadow-[#C27856]/20 hover:shadow-[#C27856]/35',
    secondary: 'bg-[#F5E6D3] hover:bg-[#EBD5BE] text-[#8B4F32] font-extrabold',
    pastelGreen: 'bg-[#D4E8D6] hover:bg-[#C2DBC5] text-[#4A6E4D] font-extrabold',
    outline: 'border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}