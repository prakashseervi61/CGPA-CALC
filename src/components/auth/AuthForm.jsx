import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/AuthContext';
import { User, Hash, ArrowRight, Check, AlertCircle } from 'lucide-react';
import PinInput from '../ui/PinInput';

const AuthForm = ({ mode }) => {
  const isLogin = mode === 'login';
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [username, setUsername] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useUser();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!registerNumber.trim()) newErrors.registerNumber = 'Register number is required';
    if (pin.length !== 4) newErrors.pin = 'PIN must be 4 digits';
    if (!isLogin && confirmPin.length !== 4) newErrors.confirmPin = 'Confirm PIN must be 4 digits';
    if (!isLogin && pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin) newErrors.confirmPin = 'PINs do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    handleLogin({ username, registerNumber, studentId: registerNumber });
    navigate('/dashboard');
  };

  const showError = (field) => submitted && errors[field];

  return (
    <div className={`min-h-dvh flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950 lg:items-stretch lg:p-0 ${!isLogin ? 'lg:flex-row-reverse' : ''}`}>
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:w-[45%] lg:p-12 bg-white dark:bg-stone-900">
        <div className="text-center max-w-[320px]">
          <h1 className="text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight mb-2">Semora</h1>
          <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed">
            Track your academic performance, analyze grades, and achieve your GPA goals — all in one place.
          </p>
        </div>
      </div>

      <div className={`w-full max-w-[420px] bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-white/20 dark:border-stone-800/20 rounded-[1.25rem] shadow-lg relative z-10 overflow-y-auto p-8 animate-[auth-slide-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] lg:w-[55%] lg:max-w-none lg:p-12 lg:flex lg:flex-col lg:justify-center ${!isLogin ? 'lg:rounded-[1.5rem_0_0_1.5rem]' : 'lg:rounded-[0_1.5rem_1.5rem_0]'}`}>
        <div className={`text-center mb-6 lg:text-left`}>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{isLogin ? 'Sign in to access your dashboard' : 'Start tracking your academic progress'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-3.5">
            <label className="block text-sm font-semibold mb-1.5 text-stone-900 dark:text-stone-50">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 transition-colors pointer-events-none" />
              <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder={isLogin ? 'Enter your username' : 'Choose a username'} className={`w-full py-2.5 pl-10 pr-4 border-[1.5px] rounded-xl text-sm bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-50 transition-all box-border placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${showError('username') ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:border-primary'}`} autoComplete="username" />
            </div>
            {showError('username') && (
              <p className="text-xs mt-1.5 flex items-center gap-1 text-red-500">
                <AlertCircle className="w-3 h-3" /> {errors.username}
              </p>
            )}
          </div>

          <div className="mb-3.5">
            <label className="block text-sm font-semibold mb-1.5 text-stone-900 dark:text-stone-50">Register Number</label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 transition-colors pointer-events-none" />
              <input type="text" name="registerNumber" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} placeholder="Enter your register number" className={`w-full py-2.5 pl-10 pr-4 border-[1.5px] rounded-xl text-sm bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-50 transition-all box-border placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${showError('registerNumber') ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:border-primary'}`} autoComplete="off" />
            </div>
            {showError('registerNumber') && (
              <p className="text-xs mt-1.5 flex items-center gap-1 text-red-500">
                <AlertCircle className="w-3 h-3" /> {errors.registerNumber}
              </p>
            )}
          </div>

          <div className="mb-3.5">
            <label className="block text-sm font-semibold mb-1.5 text-stone-900 dark:text-stone-50">{isLogin ? '4-Digit PIN' : 'Create 4-Digit PIN'}</label>
            <div className="relative">
              <PinInput pin={pin} setPin={setPin} />
            </div>
            {showError('pin') && (
              <p className="text-xs mt-1.5 flex items-center gap-1 text-red-500">
                <AlertCircle className="w-3 h-3" /> {errors.pin}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="mb-3.5">
              <label className="block text-sm font-semibold mb-1.5 text-stone-900 dark:text-stone-50">Confirm PIN</label>
              <div className="relative">
                <PinInput pin={confirmPin} setPin={setConfirmPin} />
              </div>
              {submitted && errors.confirmPin && (
                <p className="text-xs mt-1.5 flex items-center gap-1 text-red-500">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPin}
                </p>
              )}
              {!errors.confirmPin && confirmPin.length === 4 && pin === confirmPin && (
                <p className="text-xs mt-1.5 flex items-center gap-1 text-green-600">
                  <Check className="w-3 h-3" /> PINs match
                </p>
              )}
            </div>
          )}

          <button className="w-full py-3 mt-1 bg-primary text-white border-none rounded-xl text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-primary-hover hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" type="submit">
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
          <span className="text-xs text-stone-400 whitespace-nowrap uppercase tracking-widest font-medium">{isLogin ? 'New here?' : 'Already have an account?'}</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
        </div>

        <div className="text-center text-sm">
          <p className="text-stone-500 dark:text-stone-400">
            {isLogin ? 'Create an account to get started ' : 'Sign in to your existing account '}
            <a href={isLogin ? '/register' : '/login'} className="text-primary font-semibold no-underline transition-colors hover:text-primary-hover hover:underline">{isLogin ? 'Sign Up' : 'Sign In'}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
