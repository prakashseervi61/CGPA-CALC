/**
 * Reusable Input component with clear focus states, touch-friendly targets,
 * and built-in validation styling.
 */
export default function Input({
  id,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  disabled = false,
  error = false,
  required = false,
  autoComplete = 'off',
  inputMode = null,
  maxLength = null,
  ...props
}) {
  const hasLabel = !!label;

  const inputClass = `w-full px-4 py-3 rounded-xl border transition-all duration-200 font-black text-sm bg-surface dark:bg-surface-variant ${error ? 'border-danger text-danger-text focus:border-danger focus:ring-danger/20' : 'border-border dark:border-border-strong text-text-primary focus:border-primary focus:ring-primary/20'} disabled:bg-border-weak disabled:text-text-disabled disabled:cursor-not-allowed focus:outline-none ${inputMode === 'numeric' || type === 'number' ? 'text-right' : ''}`;

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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className={inputClass}
        {...props}
      />
    </div>
  );
}
