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
    <div className={`auth-container ${!isLogin ? 'auth-register' : ''}`}>
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <h1 className="auth-brand-title">Semora</h1>
          <p className="auth-brand-desc">
            Track your academic performance, analyze grades, and achieve your GPA goals — all in one place.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-form-header">
          <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p>{isLogin ? 'Sign in to access your dashboard' : 'Start tracking your academic progress'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="auth-form-group">
            <label className="auth-form-label">Username</label>
            <div className="auth-form-input-wrapper">
              <User className="auth-form-input-icon" />
              <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder={isLogin ? 'Enter your username' : 'Choose a username'} className={`auth-form-input ${showError('username') ? 'border-[var(--color-danger)]' : ''}`} autoComplete="username" />
            </div>
            {showError('username') && (
              <p className="text-xs mt-1.5 flex items-center gap-1 text-[var(--color-danger)]">
                <AlertCircle className="w-3 h-3" /> {errors.username}
              </p>
            )}
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Register Number</label>
            <div className="auth-form-input-wrapper">
              <Hash className="auth-form-input-icon" />
              <input type="text" name="registerNumber" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} placeholder="Enter your register number" className={`auth-form-input ${showError('registerNumber') ? 'border-[var(--color-danger)]' : ''}`} autoComplete="off" />
            </div>
            {showError('registerNumber') && (
              <p className="text-xs mt-1.5 flex items-center gap-1 text-[var(--color-danger)]">
                <AlertCircle className="w-3 h-3" /> {errors.registerNumber}
              </p>
            )}
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">{isLogin ? '4-Digit PIN' : 'Create 4-Digit PIN'}</label>
            <div className="auth-form-input-wrapper">
              <PinInput pin={pin} setPin={setPin} />
            </div>
            {showError('pin') && (
              <p className="text-xs mt-1.5 flex items-center gap-1 text-[var(--color-danger)]">
                <AlertCircle className="w-3 h-3" /> {errors.pin}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="auth-form-group">
              <label className="auth-form-label">Confirm PIN</label>
              <div className="auth-form-input-wrapper">
                <PinInput pin={confirmPin} setPin={setConfirmPin} />
              </div>
              {submitted && errors.confirmPin && (
                <p className="text-xs mt-1.5 flex items-center gap-1 text-[var(--color-danger)]">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPin}
                </p>
              )}
              {!errors.confirmPin && confirmPin.length === 4 && pin === confirmPin && (
                <p className="text-xs mt-1.5 flex items-center gap-1 text-[var(--color-success)]">
                  <Check className="w-3 h-3" /> PINs match
                </p>
              )}
            </div>
          )}

          <button className="auth-button" type="submit">
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">{isLogin ? 'New here?' : 'Already have an account?'}</span>
          <div className="auth-divider-line" />
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? 'Create an account to get started ' : 'Sign in to your existing account '}
            <a href={isLogin ? '/register' : '/login'}>{isLogin ? 'Sign Up' : 'Sign In'}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
