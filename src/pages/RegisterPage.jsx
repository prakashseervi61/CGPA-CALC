import React from 'react';
import {
  GraduationCap,
  User,
  Badge,
  Key,
  Mail,
  Check,
  Globe,
  Github,
  Gitlab,
  Linkedin
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';

const RegisterPage = () => {
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
            <h2 className="auth-title">Start Your Academic Journey</h2>
            <p className="auth-subtitle">Track your CGPA, semesters, and academic performance.</p>
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
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Check className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="auth-feature-content">
                <h3 className="text-white">Smart GPA Calculator</h3>
                <p className="text-white/70">Calculate SGPA and CGPA with ease</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Check className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="auth-feature-content">
                <h3 className="text-white">Semester-wise Reports</h3>
                <p className="text-white/70">Detailed breakdown of each semester's performance</p>
              </div>
            </div>
<div className="auth-feature-item">
  <div className="auth-feature-icon">
    <Check className="w-4 h-4 text-[#22C55E]" />
  </div>
  <div className="auth-feature-content">
    <h3 className="text-white">Progress Tracking</h3>
    <p className="text-white/70">Monitor your academic growth over time</p>
  </div>
</div>
<div className="auth-feature-item">
  <div className="auth-feature-icon">
    <Check className="w-4 h-4 text-[#22C55E]" />
  </div>
  <div className="auth-feature-content">
    <h3 className="text-white">Secure Cloud Sync</h3>
    <p className="text-white/70">Your data is safely backed up and accessible anywhere</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500">Create your Semora account</p>
          </div>

          {/* Form */}
          <form className="auth-form w-full space-y-6">
            {/* Full Name */}
            <div className="auth-form-group">
              <label className="auth-form-label">Full Name</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <User className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* Username */}
            <div className="auth-form-group">
              <label className="auth-form-label">Username</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <User className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
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
                  placeholder="Enter your register number"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-form-group">
              <label className="auth-form-label">Email Address</label>
              <div className="auth-form-input-wrapper">
                <span className="auth-form-input-icon">
                  <Mail className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="auth-form-input w-full"
                />
              </div>
            </div>

            {/* Create 4-Digit PIN */}
            <div className="auth-form-group">
              <label className="auth-form-label">Create 4-Digit PIN</label>
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
            </div>

            {/* Confirm 4-Digit PIN */}
            <div className="auth-form-group">
              <label className="auth-form-label">Confirm 4-Digit PIN</label>
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
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="auth-form-group">
              <label className="auth-form-checkbox">
                <input type="checkbox" className="h-4 w-4 text-[#14B8A6] border-gray-300 rounded" />
                <span>
                  I agree to the
                  <a href="#" className="text-primary hover:text-[oklch(0.45_0.2_162)] underline">
                    Terms & Privacy Policy
                  </a>
                </span>
              </label>
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

          {/* Other Signup Methods */}
          <div className="auth-social-buttons">
            <button className="auth-social-button">
              <span className="auth-social-button-icon">
                <Gitlab className="w-5 h-5 text-gray-600" />
              </span
  <span className="auth-social-button-text">Continue with GitLab</span>
</button>
<button className="auth-social-button">
  <span className="auth-social-button-icon">
    <Github className="w-5 h-5 text-gray-600" />
  </span>
  <span className="auth-social-button-text">Continue with GitHub</span>
</button>
<button className="auth-social-button">
  <span className="auth-social-button-icon">
    <Linkedin className="w-5 h-5 text-gray-600" />
  </span>
  <span className="auth-social-button-text">Continue with LinkedIn</span>
</button>
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