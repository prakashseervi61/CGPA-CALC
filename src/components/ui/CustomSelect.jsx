import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-stone-100/70 dark:bg-stone-700/50 border border-stone-200/80 dark:border-stone-600/80 rounded-xl px-3 py-1.5 hover:border-[#C27856]/50 hover:bg-[#F5E6D3]/40 dark:hover:bg-[#C27856]/20 transition-all duration-200 cursor-pointer"
      >
        {label && <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider leading-none">{label}</span>}
        <span className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
          {selected?.label || 'Select'}
        </span>
        <ChevronDown className={`w-3 h-3 text-stone-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 left-0 min-w-[200px] bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 py-1.5 animate-in fade-in duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer
                ${opt.value === value
                  ? 'bg-[#F5E6D3] dark:bg-[#C27856]/20 text-[#8B4F32] dark:text-[#D4956F]'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5 text-[#C27856]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
