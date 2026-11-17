/**
 * Reusable Select component with clear focus states, touch-friendly targets,
 * and built-in validation styling. Optimized for rapid grade entry.
 */
export default function Select({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Select',
  options = [],
  disabled = false,
  error = false,
  required = false,
  ...props
}) {
  const hasLabel = !!label;

  return (
    <div className="mb-4">
      {hasLabel && (
        <label
          htmlFor={id}
          className="block text-[11px] font-extrabold uppercase tracking-wider text-text-secondary mb-1.5"
        >
          {label}{required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 pr-10 rounded-xl
            border transition-all duration-200 font-black text-sm
            bg-surface dark:bg-surface-variant
            appearance-none cursor-pointer
            ${error
              ? 'border-danger text-danger-text focus:border-danger focus:ring-danger/20'
              : 'border-border dark:border-border-strong text-text-primary focus:border-primary focus:ring-primary/20'
            }
            disabled:bg-border-weak disabled:text-text-disabled disabled:cursor-not-allowed
            focus:outline-none
          `}
          {...props}
        >
          <option value="" className="text-text-tertiary">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface dark:bg-surface-variant text-text-primary font-extrabold">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="w-4 h-4 text-text-tertiary pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
