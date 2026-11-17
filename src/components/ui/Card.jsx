/**
 * Reusable Card component with variants (default, elevated, outline, glass).
 * Crisp shadows, consistent rounding, and dark-mode safe.
 */
export default function Card({
  children,
  variant = 'default', // default, elevated, outline, glass
  className = '',
  padding = 'p-6',
  ...props
}) {
  const base = 'rounded-xl transition-colors duration-200 border';
  const variantStyles = {
    default: 'bg-surface dark:bg-surface-variant border-border dark:border-border-strong shadow-sm',
    elevated: 'bg-surface dark:bg-surface-variant border-border dark:border-border-strong shadow-md',
    outline: 'bg-surface dark:bg-surface-variant border-border dark:border-border-strong',
    glass: 'bg-surface/80 dark:bg-surface-variant/80 backdrop-blur-md border-border/50 dark:border-border-strong/50',
  };

  return (
    <div className={`${base} ${variantStyles[variant]} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
}
