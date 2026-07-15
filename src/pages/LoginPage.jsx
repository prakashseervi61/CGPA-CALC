import React from 'react';
import {
  GraduationCap,
  Calculator,
  BarChart2,
  Shield,
  User,
  Badge,
  Key,
  Lock,
  Menu
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';

const LoginPage = () => {
  return (
    <div className="auth-container">
      {/* Left Panel - Branding */}
      <div className="auth-left-panel">
        {/* Decorative shapes */}
        <div className="absolute inset-0 -z-10" style={{ pointerEvents: 'none' }}>
          <div className="absolute top-0 left-0 w-20 h-20 bg-[rgba(20,184,166,0.1)] rounded-full -translate-x-5 -translate-y-5"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[rgba(20,184,166,0.05)] rounded-full -translate-x-5 -translate-y-5"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[rgba(34,197,94,0.1)] rounded-full -translate-x-5 -translate-y-5 rotate-45"></div>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <GraduationCap className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <h1 className="auth-logo-text">Semora</h1>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Your Smart CGPA Calculator</p>
          </div>

          {/* Illustration - using icons */}
          <div className="auth-illustration">
            <div className="auth-illustration-item">
              <GraduationCap className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div className="auth-illustration-item">
              <Calculator className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div className="auth-illustration-item">
              <BarChart2 className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <div className="auth-illustration-item">
              <Shield className="w-5 h-5 text-[#14B8A6]" />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="auth-features w-full">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Check className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="auth-feature-content">
                <h3 className="text-white">Fast CGPA Calculation</h3>
                <p className="text-white/70">Instantly calculate your semester and cumulative GPA</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Check className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="auth-feature-content">
                <h3 className="text-white">Semester Tracking</h3>
                <p className="text-white/70">Monitor your performance across all semesters</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Check className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="auth-feature-content">
                <h3 className="text-white">Academic Analytics</h3>
                <p className="text-white/70">Visualize your progress with detailed charts</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Check className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="auth-feature-content">
                <h3 className="text-white">Secure Student Data</h3>
                <p className="text-white/70">Your academic records are encrypted and private</p>
              </div>
            </div>
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
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-500">Access your academic dashboard</p>
          </div>

          {/* Form */}
          <form className="auth-form w-full space-y-6">
            {/* Username */}
            <div className="auth-form-group">
              <label className="auth-form-label">Username</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <User className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
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
                  placeholder="Enter your register number"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* 4-Digit PIN */}
            <div className="auth-form-group">
              <label className="auth-form-label">4-Digit PIN</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <Key className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="password"
                  placeholder="••••"
                  className="auth-form-input w-full pin-input letter-spacing-wide"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-[#14B8A6] border-gray-300 rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-[oklch(0.45_0.2_162)]">Forgot PIN?</a>
              </div>
            </div>

            {/* Submit Button */}
            <button className="auth-button w-full">
              Login
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
              Don't have an account?
              <a href="/register" className="text-primary hover:text-[oklch(0.45_0.2_162)] underline">
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