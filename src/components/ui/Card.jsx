/**
 * Reusable Card component for academic dashboard layout.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-[24px] border border-stone-100 shadow-sm shadow-[#C27856]/5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}