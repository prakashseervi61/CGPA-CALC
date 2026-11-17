/**
 * Reusable Button component with press states, loading variant,
 * touch-friendly targets, and accessible focus states.
 */
export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'md', // sm, md, lg
  icon: Icon = null,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-black rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/30';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/35',
    secondary: 'bg-surface-variant dark:bg-surface-variant border border-border dark:border-border-strong text-text-primary hover:bg-border hover:bg-stone-100 dark:hover:bg-stone-800',
    outline: 'border border-border dark:border-border-strong bg-surface dark:bg-surface-variant text-text-primary hover:bg-stone-50 dark:hover:bg-stone-800',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-stone-50 dark:hover:bg-stone-800',
    danger: 'bg-danger text-white hover:bg-danger-hover shadow-md shadow-danger/20',
    success: 'bg-success text-success-text shadow-md shadow-success/20 hover:bg-success-active',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
