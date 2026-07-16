import { useRef } from 'react';

const PinInput = ({ pin, setPin, type = 'password' }) => {
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (val.length > 1) return;
    setPin(pin.substring(0, i) + val + pin.substring(i + 1));
    if (val && i < 3) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key !== 'Backspace') return;
    if (pin[i]) {
      setPin(pin.substring(0, i) + pin.substring(i + 1));
    } else if (i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type={type}
          maxLength={1}
          value={pin[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-10 h-12 text-center text-lg font-mono rounded-lg border border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
        />
      ))}
    </div>
  );
};

export default PinInput;
