import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import {
  GraduationCap,
  Calculator,
  BarChart2,
  Shield,
  User,
  Badge,
  Check,
  Globe,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import PinInput from '../components/ui/PinInput';

const LoginPage = () => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    handleLogin({ username: fd.get('username'), registerNumber: fd.get('registerNumber'), studentId: fd.get('registerNumber') });
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      {/* Left Panel - Branding */}
      <div className="auth-left-panel">
        <div className="relative z-10 space-y-8 w-full">
          {/* Logo */}
          <div className="auth-logo flex items-center gap-3 w-full">
            <div className="auth-logo-icon">
              <GraduationCap className="w-8 h-8 text-[#14B8A6]" />
            </div>
            <div className="text-left">
              <h1 className="auth-logo-text font-bold text-2xl text-white">Semora</h1>
              <p className="text-white/80 text-sm">CGPA Calculator</p>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-left w-full">
            <h2 className="auth-title text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-white/70 text-sm">
              Continue your academic journey with Semora. Track semesters, calculate CGPA, and monitor your progress.
            </p>
          </div>

          {/* Illustration - using icons */}
          <div className="auth-illustration flex justify-center items-center gap-8">
            <div className="auth-illustration-item">
              <GraduationCap className="w-10 h-10 text-[#14B8A6]/80" />
            </div>
            <div className="auth-illustration-item">
              <Calculator className="w-10 h-10 text-[#14B8A6]/80" />
            </div>
            <div className="auth-illustration-item">
              <BarChart2 className="w-10 h-10 text-[#14B8A6]/80" />
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="auth-features w-full space-y-4">
            {[
              { icon: Check, title: 'Smart CGPA Calculator', desc: 'Instantly calculate SGPA and CGPA with our intelligent algorithm' },
              { icon: BarChart2, title: 'Semester Tracking', desc: 'Monitor your performance across all semesters with detailed analytics' },
              { icon: Shield, title: 'Secure Data', desc: 'Your academic records are encrypted and private' },
              { icon: Globe, title: 'Sync Across Devices', desc: 'Access your data anywhere with secure cloud synchronization' }
            ].map((item, idx) => (
              <div key={idx} className="auth-feature-item flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="auth-feature-icon bg-primary/20 rounded-lg p-3">
                  <item.icon className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div className="auth-feature-content">
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 -z-10" style={{ pointerEvents: 'none' }}>
          <div className="w-40 h-40 bg-[rgba(20,184,166,0.05)] rounded-full -translate-x-5 -translate-y-5"></div>
        </div>

        <div className="w-full max-w-[480px] space-y-8">
          {/* Form Header */}
          <div className="auth-form-header text-center">
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-500">Access your academic dashboard</p>
          </div>

          {/* Form */}
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="auth-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* Register Number */}
            <div className="auth-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Register Number</label>
              <div className="relative">
                <Badge className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="registerNumber"
                  placeholder="Enter your register number"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* 4-Digit PIN */}
            <div className="auth-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">4-Digit PIN</label>
              <div className="relative">
                <div className="pr-10">
                  <PinInput pin={pin} setPin={setPin} type={showPassword ? 'text' : 'password'} />
                </div>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-2 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Submit Button */}
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#14B8A6] to-[#14B8A6]/90 text-white font-medium hover:from-[#14B8A6]/90 hover:to-[#14B8A6] transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#14B8A6]/20">
              Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider flex items-center mt-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Bottom Text */}
          <div className="auth-footer text-center mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?
              <a href="/register" className="text-primary hover:text-primary/80 font-medium underline">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;