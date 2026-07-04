import React, { useState } from 'react';
import { GraduationCap, User, ArrowRight, KeyRound, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CHROME_AVATAR_GRADIENTS = [
  'bg-gradient-to-tr from-indigo-600 via-[#4F46E5] to-blue-400 text-white shadow-indigo-500/25',
  'bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 text-white shadow-emerald-500/25',
  'bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white shadow-blue-500/25',
  'bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 text-white shadow-amber-500/25',
  'bg-gradient-to-tr from-rose-600 via-pink-500 to-red-400 text-white shadow-rose-500/25',
  'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-400 text-white shadow-violet-500/25',
];

export default function LoginModal({ savedProfiles = [], onLogin, onSelectProfile, onDeleteProfile }) {
  // Mode: 'select' if profiles exist, else 'create'
  const [mode, setMode] = useState(savedProfiles.length > 0 ? 'select' : 'create');
  
  // New profile form state
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);

  // Selected profile for PIN unlocking
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [verifyPin, setVerifyPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState(false);

  // PIN input handlers
  const handlePinChange = (index, value, isVerification = false) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    if (isVerification) {
      const newPin = [...verifyPin];
      newPin[index] = value;
      setVerifyPin(newPin);
      setPinError(false);
      if (value && index < 3) {
        const nextInput = document.getElementById(`vpin-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    } else {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

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
    if (onLogin) {
      onLogin({
        id: studentId || `user_${Date.now()}`,
        name: name || 'Student',
        studentId: studentId || 'N/A',
        pin: pin.join('') || '1234',
        avatarGradient: CHROME_AVATAR_GRADIENTS[savedProfiles.length % CHROME_AVATAR_GRADIENTS.length]
      });
    }
  };

  // Verify PIN for Profile selection
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const enteredPin = verifyPin.join('');
    if (selectedProfile && (selectedProfile.pin === enteredPin || !selectedProfile.pin)) {
      if (onSelectProfile) {
        onSelectProfile(selectedProfile);
      }
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#F5F3FF] p-6 select-none relative overflow-x-hidden">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Logo Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-[#4F46E5] flex items-center justify-center text-white mx-auto mb-3 shadow-xl shadow-indigo-500/25">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Who's using CGPA Calculator?
        </h1>
        <p className="text-sm text-slate-500 font-semibold mt-1.5">
          Select an academic profile to enter your dashboard
        </p>
      </div>

      {/* CHROME PROFILE SELECTOR VIEW */}
      {mode === 'select' && !selectedProfile && (
        <div className="w-full max-w-4xl relative z-10 flex flex-col items-center animate-in fade-in duration-200">
          {/* Circular Profile Cards Grid */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 my-4 max-w-3xl">
            {savedProfiles.map((prof, idx) => {
              const gradientClass = prof.avatarGradient || CHROME_AVATAR_GRADIENTS[idx % CHROME_AVATAR_GRADIENTS.length];
              return (
                <div
                  key={prof.id || idx}
                  onClick={() => {
                    if (!prof.pin) {
                      if (onSelectProfile) onSelectProfile(prof);
                    } else {
                      setSelectedProfile(prof);
                      setVerifyPin(['', '', '', '']);
                    }
                  }}
                  className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 active:scale-95 relative"
                >
                  {/* Delete Badge on Hover */}
                  {onDeleteProfile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProfile(prof.id);
                      }}
                      className="absolute -top-1 -right-1 z-20 w-7 h-7 rounded-full bg-white text-slate-400 hover:text-rose-600 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Chrome Large Circular Avatar */}
                  <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center font-black text-4xl sm:text-5xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-[#4F46E5]/40 ${gradientClass}`}>
                    {prof.name ? prof.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  {/* Profile Name & Reg No */}
                  <div className="text-center mt-3 max-w-[130px]">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-[#4F46E5] transition-colors truncate">
                      {prof.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 truncate">
                      {prof.studentId || 'Student'}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* "+ Add Profile" Chrome Card */}
            <div
              onClick={() => setMode('create')}
              className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 active:scale-95"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-3 border-dashed border-slate-300 bg-white/80 group-hover:bg-indigo-50 group-hover:border-[#4F46E5] flex items-center justify-center text-slate-400 group-hover:text-[#4F46E5] transition-all duration-200 shadow-sm group-hover:shadow-md">
                <Plus className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="text-center mt-3">
                <h3 className="font-black text-base sm:text-lg text-slate-700 group-hover:text-[#4F46E5] transition-colors">
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
        <Card className="w-full max-w-md p-8 shadow-2xl border border-indigo-100 rounded-[28px] relative overflow-hidden bg-white z-10 animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => setSelectedProfile(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#4F46E5] mb-4 transition-colors"
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
                        ? 'border-rose-400 bg-rose-50 text-rose-600 focus:outline-none' 
                        : 'border-slate-200 bg-slate-50/50 text-[#4F46E5] focus:bg-white focus:border-[#4F46E5] focus:outline-none'
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
              className="w-full py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/25 mt-2"
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
        <Card className="w-full max-w-md p-8 shadow-2xl border border-indigo-100 rounded-[28px] relative overflow-hidden bg-white z-10 animate-in fade-in zoom-in-95 duration-200">
          {savedProfiles.length > 0 && (
            <button
              type="button"
              onClick={() => setMode('select')}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#4F46E5] mb-4 transition-colors"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:border-[#4F46E5] focus:outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:border-[#4F46E5] focus:outline-none transition-all"
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
                    className="w-12 h-12 text-center text-xl font-black rounded-2xl border-2 border-slate-200 bg-slate-50/50 text-[#4F46E5] focus:bg-white focus:border-[#4F46E5] focus:outline-none transition-all shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/25 mt-3"
              icon={ArrowRight}
              iconPosition="right"
            >
              Save Profile & Sign In
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
