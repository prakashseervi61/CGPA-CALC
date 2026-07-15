import React, { useState } from 'react';
import { GraduationCap, ArrowLeft, ArrowRight, User, KeyRound, Plus } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useSesame } from '../../hooks/useSesame';

const CHROME_AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-primary-600 to-primary-800',
  'bg-gradient-to-br from-emerald-600 to-emerald-800',
  'bg-gradient-to-br from-blue-600 to-blue-800',
  'bg-gradient-to-br from-amber-600 to-amber-800',
  'bg-gradient-to-br from-rose-600 to-rose-800',
];

export default function LoginModal({ handleLogin }) {
  const [mode, setMode] = useState('select'); // select, create, verify
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [verifyPin, setVerifyPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState(false);
  const [targetCgpa, setTargetCgpa] = useState('9.00');

  // Load saved profiles from localStorage
  const loadProfiles = () => {
    const profiles = localStorage.getItem('cgpa_app_profiles');
    return profiles ? JSON.parse(profiles) : [];
  };

  // Save profiles to localStorage
  const saveProfiles = (profiles) => {
    localStorage.setItem('cgpa_app_profiles', JSON.stringify(profiles));
    setSavedProfiles(profiles);
  };

  // Load profiles on mount
  // Using useEffect would be better but we'll do it in the component body for simplicity
  // In a real app, this should be in useEffect with empty deps
  // For now, we'll initialize if empty
  if (savedProfiles.length === 0) {
    const loaded = loadProfiles();
    if (loaded.length > 0) {
      setSavedProfiles(loaded);
    }
  };

  // Handle PIN input change
  const handlePinChange = (idx, value, isVerification = false) => {
    if (isVerification) {
      const newVerifyPin = [...verifyPin];
      newVerifyPin[idx] = value;
      setVerifyPin(newVerifyPin);
    } else {
      const newPin = [...pin];
      newPin[idx] = value;
      setPin(newPin);
    }

    // Auto-focus next input
    if (value && idx < 3) {
      const nextInput = document.getElementById(
        isVerification ? `vpin-input-${idx + 1}` : `pin-input-${idx + 1}`
      );
      if (nextInput) nextInput.focus();
    }

    // Clear error on input
    if (pinError) setPinError(false);
  };

  // Handle Enter key and navigation
  const handleKeyDown = (index, e, isVerification = false) => {
    if (e.key === 'Backspace') {
      if (isVerification && !verifyPin[index] && index > 0) {
        const prevInput = document.getElementById(`vpin-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      } else if (!isVerification && !pin[index] && index > 0) {
        const prevInput = document.getElementById(`pin-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  // Create & Sign In handler
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // Create a new profile object
    const newProfile = {
      id: studentId || `user_${Date.now()}`,
      name: name || 'Student',
      studentId: studentId || 'N/A',
      pin: pin.join('') || '1234',
      targetCgpa: parseFloat(targetCgpa) || 9.00,
      avatarGradient: CHROME_AVATAR_GRADIENTS[savedProfiles.length % CHROME_AVATAR_GRADIENTS.length]
    };
    if (handleLogin) {
      handleLogin(newProfile);
    }
  };

  // Verify PIN for Profile selection
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const enteredPin = verifyPin.join('');
    if (selectedProfile && (selectedProfile.pin === enteredPin || !selectedProfile.pin)) {
      if (handleLogin) {
        // Use the existing profile to log in (will not duplicate)
        handleLogin(selectedProfile);
      }
    } else {
      setPinError(true);
    }
  };

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      bg-black/50 backdrop-blur-sm
      animate-in fade-in zoom-95 duration-200
    `}>
      <div className="relative w-full max-w-md mx-auto p-6">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30 rounded-2xl blur-3xl" />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
          {/* Brand Logo Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-primary-600 flex items-center justify-center text-white mx-auto mb-3 shadow-xl shadow-primary-500/25">
              <GraduationCap className="w-9 h-9" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Who's using Semora?
            </h1>
            <p className="text-sm text-slate-500 font-semibold mt-1.5">
              Select an academic profile to enter your dashboard
            </p>
          </div>

          {/* CHROME PROFILE SELECTOR VIEW */}
          {mode === 'select' && !selectedProfile && (
            <div className="w-full max-w-4xl relative flex flex-col items-center animate-in fade-in duration-200">
              {/* Circular Profile Cards Grid */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 my-4 max-w-3xl">
                {savedProfiles.map((prof, idx) => {
                  const gradientClass = prof.avatarGradient || CHROME_AVATAR_GRADIENTS[idx % CHROME_AVATAR_GRADIENTS.length];
                  return (
                    <div
                      key={prof.id || idx}
                      onClick={() => {
                        if (!prof.pin) {
                          if (handleLogin) handleLogin(prof);
                        } else {
                          setSelectedProfile(prof);
                          setVerifyPin(['', '', '', '']);
                        }
                      }}
                      className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 active:scale-95 relative"
                    >


                      {/* Chrome Large Circular Avatar */}
                      <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center font-black text-4xl sm:text-5xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-primary-500/40 ${gradientClass}`}>
                        {prof.name ? prof.name.charAt(0).toUpperCase() : 'U'}
                      </div>

                      {/* Profile Name & Reg No */}
                      <div className="text-center mt-3 max-w-[130px]">
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                          {prof.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 truncate">
                          {prof.studentId || 'Student'}
                        </p>
                      </div>

                      {/* Target CGPA badge if set */}
                      {prof.targetCgpa && (
                        <div className="mt-2">
                          <Badge variant="pastelGreen" size="sm" className="ml-1">
                            Target: {prof.targetCgpa}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* "+ Add Profile" Chrome Card */}
                <div
                  onClick={() => setMode('create')}
                  className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 active:scale-95"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-3 border-dashed border-slate-300 bg-white/80 group-hover:bg-primary-50 group-hover:border-primary-500 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-all duration-200 shadow-sm group-hover:shadow-md">
                    <Plus className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <div className="text-center mt-3">
                    <h3 className="font-black text-base sm:text-lg text-slate-700 group-hover:text-primary-600 transition-colors">
                      Add profile
                    </h3>
                    <p className="text-xs font-bold text-slate-400">
                      New Student
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VERIFY PIN MODAL FOR SELECTED CHROME PROFILE */}
          {mode === 'select' && selectedProfile && (
            <Card className="w-full max-w-md p-8 shadow-2xl border border-primary-200 rounded-[28px] relative overflow-hidden bg-white z-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary-600 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to profiles
              </button>

              <form onSubmit={handleVerifySubmit} className="space-y-5 text-center">
                {/* Selected Profile Avatar */}
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center font-black text-3xl text-white shadow-xl ${selectedProfile.avatarGradient || CHROME_AVATAR_GRADIENTS[0]}`}>
                  {selectedProfile.name ? selectedProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{selectedProfile.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{selectedProfile.studentId}</p>
                </div>

                {/* Target CGPA display */}
                {selectedProfile.targetCgpa && (
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-500">
                      Target CGPA: <span className="text-primary-600">{selectedProfile.targetCgpa}</span> / 10.00
                    </span>
                  </div>
                )}

                {/* 4-Digit Security PIN */}
                <div className="pt-2">
                  <label className="block text-xs font-black uppercase text-slate-400 mb-3 tracking-wider">
                    Enter 4-Digit Security PIN
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`vpin-input-${idx}`}
                        type="password"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={verifyPin[idx] || ''}
                        onChange={(e) => handlePinChange(idx, e.target.value, true)}
                        onKeyDown={(e) => handleKeyDown(idx, e, true)}
                        className={`w-12 h-12 text-center text-xl font-black rounded-2xl border-2 transition-all shadow-xs ${
                          pinError
                            ? 'border-rose-500 bg-rose-50 text-rose-600 focus:outline-none'
                            : 'border-slate-200 bg-slate-50/50 text-primary-600 focus:bg-white focus:border-primary-600 focus:outline-none'
                        }`}
                      />
                    ))}
                  </div>
                  {pinError && (
                    <p className="text-xs font-bold text-rose-500 mt-2">
                      Incorrect PIN. Please try again.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-primary-500/25 mt-2"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Sign In
                </Button>
              </form>
            </Card>
          )}

          {/* CREATE NEW PROFILE FORM */}
          {mode === 'create' && (
            <Card className="w-full max-w-md p-8 shadow-2xl border border-primary-200 rounded-[28px] relative overflow-hidden bg-white z-10 animate-in fade-in zoom-in-95 duration-200">
              {savedProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMode('select')}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary-600 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to profile picker
                </button>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">Add New Profile</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">Set up your student credentials</p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5 tracking-wider">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Student Reg / ID */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5 tracking-wider">
                    Register / Student ID
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Enter your reg no"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:border-primary-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* 4-Digit Security PIN */}
                <div className="pt-1">
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-wider text-center">
                    Set 4-Digit Security PIN
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`pin-input-${idx}`}
                        type="password"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={pin[idx] || ''}
                        onChange={(e) => handlePinChange(idx, e.target.value, false)}
                        onKeyDown={(e) => handleKeyDown(idx, e, false)}
                        className="w-12 h-12 text-center text-xl font-black rounded-2xl border-2 border-slate-200 bg-slate-50/50 text-primary-600 focus:bg-white focus:border-primary-600 focus:outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Target CGPA */}
                <div className="pt-1">
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-wider block">
                    Target CGPA Goal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={targetCgpa}
                      onChange={(e) => setTargetCgpa(e.target.value)}
                      placeholder="9.00"
                      className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:border-primary-600"
                    />
                    <span className="text-xs text-slate-500 font-bold">out of 10.0</span>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-primary-500/25 mt-3"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Save Profile & Sign In
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}