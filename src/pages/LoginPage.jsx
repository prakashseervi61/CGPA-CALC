import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/AuthContext';
import { User, Badge, ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react';
import PinInput from '../components/ui/PinInput';

const LoginPage = () => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <GraduationCap />
          </div>
          <span className="auth-logo-text">Semora</span>
          <span className="auth-logo-tagline">Academic Performance Tracker</span>
        </div>

        {/* Header */}
        <div className="auth-form-header">
          <h2>Welcome back</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="auth-form-group">
            <label className="auth-form-label">Username</label>
            <div className="auth-form-input-wrapper">
              <User className="auth-form-input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="auth-form-input"
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Register Number */}
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

          {/* PIN */}
          <div className="auth-form-group">
            <label className="auth-form-label">4-Digit PIN</label>
            <div className="auth-form-input-wrapper flex items-center gap-2">
              <div className="flex-1">
                <PinInput
                  pin={pin}
                  setPin={setPin}
                  type={showPassword ? 'text' : 'password'}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-slate-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">New here?</span>
          <div className="auth-divider-line" />
        </div>

        <div className="auth-footer">
          <p>
            Create an account to get started{' '}
            <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
