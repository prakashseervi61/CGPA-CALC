/**
 * Reusable Card component for academic dashboard layout.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-[24px] border border-slate-100 shadow-sm shadow-indigo-500/5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}