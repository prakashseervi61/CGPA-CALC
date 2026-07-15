import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import {
  GraduationCap,
  User,
  Badge,
  Mail,
  Check,
  BarChart2,
  Shield
} from 'lucide-react';
import PinInput from '../components/ui/PinInput';

const RegisterPage = () => {
  const [createPin, setCreatePin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
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
              <GraduationCap className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <h1 className="auth-logo-text">Semora</h1>
          </div>

          {/* Title and Subtitle */}
          <div className="text-left w-full">
            <h2 className="auth-title">Start Your Academic Journey</h2>
            <p className="text-white/70 text-sm">Track your CGPA, semesters, and academic performance.</p>
          </div>

          {/* Illustration - using icons */}
          <div className="auth-illustration">
            <div className="auth-illustration-item">
              <User className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div className="auth-illustration-item">
              <Mail className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div className="auth-illustration-item">
              <BarChart2 className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div className="auth-illustration-item">
              <Shield className="w-5 h-5 text-[#14B8A6]" />
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="auth-features w-full">
            {[
              { title: 'Smart GPA Calculator', desc: 'Calculate SGPA and CGPA with ease' },
              { title: 'Semester-wise Reports', desc: 'Detailed breakdown of each semester\'s performance' },
              { title: 'Progress Tracking', desc: 'Monitor your academic growth over time' },
              { title: 'Secure Cloud Sync', desc: 'Your data is safely backed up and accessible anywhere' }
            ].map((item, idx) => (
              <div key={idx} className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Check className="w-4 h-4 text-[#22C55E]" />
                </div>
                <div className="auth-feature-content">
                  <h3 className="text-white">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
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

        <div className="w-full space-y-8">
          {/* Form Header */}
          <div className="auth-form-header">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500">Create your Semora account</p>
          </div>

          {/* Form */}
          <form className="auth-form w-full mx-auto space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="auth-form-group">
              <label className="auth-form-label">Username</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <User className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* Register Number */}
            <div className="auth-form-group">
              <label className="auth-form-label">Register Number</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <Badge className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="registerNumber"
                  placeholder="Enter your register number"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* Create 4-Digit PIN */}
            <div className="auth-form-group">
              <label className="auth-form-label">Create 4-Digit PIN</label>
              <div className="auth-form-input-wrapper">
                <PinInput pin={createPin} setPin={setCreatePin} />
              </div>
            </div>

            {/* Confirm 4-Digit PIN */}
            <div className="auth-form-group">
              <label className="auth-form-label">Confirm 4-Digit PIN</label>
              <div className="auth-form-input-wrapper">
                <PinInput pin={confirmPin} setPin={setConfirmPin} />
              </div>
            </div>

            {/* Submit Button */}
            <button className="auth-button w-full">
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">OR</span>
            <div className="auth-divider-line"></div>
          </div>

          {/* Bottom Text */}
          <div className="auth-footer">
            <p className="text-gray-500">
              Already have an account?
              <a href="/login" className="text-primary hover:text-[oklch(0.45_0.2_162)] underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;