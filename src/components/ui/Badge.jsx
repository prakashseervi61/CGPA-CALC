/**
 * Reusable Badge component for grade letters, credits, status labels.
 * Refined variants with strong contrast and dark-mode safety.
 */
export default function Badge({
  children,
  variant = 'primary', // primary, success, warning, danger, slate, outline
  className = '',
  size = 'md',
  ...props
}) {
  const variantStyles = {
    primary: 'bg-primary-light text-primary-hover border-primary-border',
    success: 'bg-success-light text-success-text border-success-border',
    warning: 'bg-warning-light text-warning border-warning-border',
    danger: 'bg-danger-light text-danger-text border-danger-border',
    slate: 'bg-surface-variant dark:bg-stone-800 text-text-secondary border-border dark:border-border-strong',
    outline: 'bg-transparent text-text-primary border-border dark:border-border-strong',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-extrabold',
    md: 'text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-sm px-3 py-1.5 font-black',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-xl tracking-wide select-none border
        ${sizeStyles[size]} ${variantStyles[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
