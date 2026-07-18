/**
 * Reusable Card component for academic dashboard layout.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white dark:bg-stone-900 rounded-[24px] border border-stone-100 dark:border-stone-800 shadow-sm shadow-primary/5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}