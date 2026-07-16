import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/AuthContext';
import { User, Badge, ArrowRight, GraduationCap, Check } from 'lucide-react';
import PinInput from '../components/ui/PinInput';

const RegisterPage = () => {
  const [createPin, setCreatePin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useUser();

  const pinsMatch = createPin.length === 4 && createPin === confirmPin;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinsMatch) return;
    setIsLoading(true);
    const fd = new FormData(e.target);
    handleLogin({
      username: fd.get('username'),
      registerNumber: fd.get('registerNumber'),
      studentId: fd.get('registerNumber'),
    });
    setTimeout(() => navigate('/dashboard'), 300);
  };

  return (
    <div className="auth-container auth-register auth-page-enter">
      {/* Desktop branding panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-icon">
            <GraduationCap />
          </div>
          <h1 className="auth-brand-title">Semora</h1>
          <p className="auth-brand-desc">
            Track your academic performance, analyze grades, and achieve your GPA goals — all in one place.
          </p>
        </div>
      </div>

      {/* Auth card */}
      <div className="auth-card">
        {/* Mobile logo (hidden on desktop via CSS) */}
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <GraduationCap />
          </div>
          <span className="auth-logo-text">Semora</span>
          <span className="auth-logo-tagline">Academic Performance Tracker</span>
        </div>

        <div className="auth-form-header">
          <h2>Create account</h2>
          <p>Start tracking your academic progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="auth-form-group">
            <label className="auth-form-label">Username</label>
            <div className="auth-form-input-wrapper">
              <User className="auth-form-input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                className="auth-form-input"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Register Number</label>
            <div className="auth-form-input-wrapper">
              <Badge className="auth-form-input-icon" />
              <input
                type="text"
                name="registerNumber"
                placeholder="Enter your register number"
                className="auth-form-input"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Create 4-Digit PIN</label>
            <div className="auth-form-input-wrapper">
              <PinInput pin={createPin} setPin={setCreatePin} />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Confirm PIN</label>
            <div className="auth-form-input-wrapper">
              <PinInput pin={confirmPin} setPin={setConfirmPin} />
            </div>
            {confirmPin.length === 4 && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${pinsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {pinsMatch ? <Check className="w-3 h-3" /> : null}
                {pinsMatch ? 'PINs match' : 'PINs do not match'}
              </p>
            )}
          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={isLoading || !pinsMatch}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account…
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">Already have an account?</span>
          <div className="auth-divider-line" />
        </div>

        <div className="auth-footer">
          <p>
            Sign in to your existing account{' '}
            <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
