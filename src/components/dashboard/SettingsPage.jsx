import { useState } from 'react';
import {
  Settings, User, KeyRound, Database, RotateCcw, Check, Edit2, X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useUser } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export default function SettingsPage() {
  const { user, handleUpdateUser } = useUser();
  const { handleResetGrades } = useData();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPin, setIsEditingPin] = useState(false);

  const [name, setName] = useState(user?.username || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [targetCgpa, setTargetCgpa] = useState(user?.targetCgpa || '9.00');
  const [savedNotice, setSavedNotice] = useState(false);

  // PIN change state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null);

  
  const handleProfileSave = (e) => {
    e.preventDefault();
    handleUpdateUser({
      ...user,
      username: name,
      studentId,
      targetCgpa: parseFloat(targetCgpa) || 0
    });
    setIsEditingProfile(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handlePinChangeSubmit = (e) => {
    e.preventDefault();
    if (user?.pin && currentPin !== user.pin) {
      setPinMessage({ type: 'error', text: 'Current PIN is incorrect.' });
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMessage({ type: 'error', text: 'New PIN must be exactly 4 digits.' });
      return;
    }

    handleUpdateUser({
      ...user,
      pin: newPin
    });
    setIsEditingPin(false);
    setPinMessage({ type: 'success', text: '4-Digit PIN updated successfully!' });
    setCurrentPin('');
    setNewPin('');
    setTimeout(() => setPinMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl select-none duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-stone-700 dark:border-stone-700">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-stone-50 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5E6D3] text-[#C27856] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            Settings & Preferences
          </h2>
            <p className="text-xs text-slate-500 dark:text-stone-400 font-semibold mt-1">
            Manage student profile info, 4-digit security PIN, target CGPA goals & data exports
          </p>
        </div>

        {savedNotice && (
          <Badge variant="green" size="md" className="animate-in fade-in">
            ✓ Profile Saved!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SECTION 1: Student Profile Information with Edit / Save Toggle */}
      <Card className="p-6 border border-slate-100 dark:border-stone-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5E6D3] text-[#C27856] flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-stone-50">Student Profile</h3>
               <p className="text-xs text-slate-500 dark:text-stone-500 font-semibold">Display name & registration number</p>
            </div>
          </div>

          {!isEditingProfile ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Edit2}
              onClick={() => setIsEditingProfile(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditingProfile(false);
                setName(user?.username || '');
                setStudentId(user?.studentId || '');
                setTargetCgpa(user?.targetCgpa?.toString() || '9.00');
              }}
               className="text-xs font-bold text-slate-500 hover:text-slate-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-stone-500 mb-1.5 tracking-wider">
              Student Name
            </label>
            <input
              type="text"
              required
              disabled={!isEditingProfile}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-600 text-sm font-bold text-slate-800 dark:text-stone-100 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-700 focus:border-[#C27856] focus:outline-none transition-all disabled:bg-slate-100/70 dark:disabled:bg-stone-800 disabled:text-slate-600 dark:disabled:text-stone-500 disabled:border-slate-200 dark:disabled:border-stone-700 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-stone-500 mb-1.5 tracking-wider">
              Register / Student ID
            </label>
            <input
              type="text"
              required
              disabled={!isEditingProfile}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your reg no"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-600 text-sm font-bold text-slate-800 dark:text-stone-100 bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-700 focus:border-[#C27856] focus:outline-none transition-all disabled:bg-slate-100/70 dark:disabled:bg-stone-800 disabled:text-slate-600 dark:disabled:text-stone-500 disabled:border-slate-200 dark:disabled:border-stone-700 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-stone-500 mb-1.5 tracking-wider">
              Target CGPA Goal
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetCgpa}
                onChange={(e) => setTargetCgpa(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:border-[#C27856]"
              />
              <span className="text-xs text-slate-500 dark:text-stone-400 font-bold">out of 10.0</span>
            </div>
          </div>

          {isEditingProfile && (
            <div className="sm:col-span-2 pt-1 flex justify-end duration-150">
              <Button type="submit" variant="primary" size="md" icon={Check}>
                Save Profile Changes
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* SECTION 2: Security & 4-Digit PIN with Edit / Save Toggle */}
      <Card className="p-6 border border-slate-100 dark:border-stone-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-stone-50">Security & 4-Digit PIN</h3>
               <p className="text-xs text-slate-500 dark:text-stone-500 font-semibold">Profile unlock security PIN</p>
            </div>
          </div>

          {!isEditingPin ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Edit2}
              onClick={() => setIsEditingPin(true)}
            >
              Edit PIN
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditingPin(false);
                setCurrentPin('');
                setNewPin('');
                setPinMessage(null);
              }}
               className="text-xs font-bold text-slate-500 hover:text-slate-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handlePinChangeSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-stone-500 mb-1.5 tracking-wider">
              Current PIN
            </label>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              required={isEditingPin}
              disabled={!isEditingPin}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-600 text-sm font-black text-[#C27856] bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-700 focus:border-[#C27856] focus:outline-none transition-all disabled:bg-slate-100/70 dark:disabled:bg-stone-800 disabled:text-slate-400 dark:disabled:text-stone-600 disabled:border-slate-200 dark:disabled:border-stone-700 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 dark:text-stone-500 mb-1.5 tracking-wider">
              New 4-Digit PIN
            </label>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              required={isEditingPin}
              disabled={!isEditingPin}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-600 text-sm font-black text-[#C27856] bg-slate-50/50 dark:bg-stone-800/50 focus:bg-white dark:focus:bg-stone-700 focus:border-[#C27856] focus:outline-none transition-all disabled:bg-slate-100/70 dark:disabled:bg-stone-800 disabled:text-slate-400 dark:disabled:text-stone-600 disabled:border-slate-200 dark:disabled:border-stone-700 disabled:cursor-not-allowed"
            />
          </div>

          {pinMessage && (
            <div className={`sm:col-span-2 p-3 rounded-xl text-xs font-bold ${
              pinMessage.type === 'success' ? 'bg-[#D4E8D6] text-[#4A6E4D] border border-[#B8D4BB]' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {pinMessage.text}
            </div>
          )}

          {isEditingPin && (
            <div className="sm:col-span-2 pt-1 flex justify-end duration-150">
              <Button type="submit" variant="primary" size="md" icon={Check}>
                Update Security PIN
              </Button>
            </div>
          )}
        </form>
      </Card>

      </div>
      {/* SECTION 3: Data Management */}
      <Card className="p-6 border border-slate-100 dark:border-stone-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-stone-700">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-stone-50">Data Management</h3>
            <p className="text-xs text-slate-500 dark:text-stone-500 font-semibold">Reset all semester grades to their default unselected state</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reset All Grades */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all selected grades back to unselected?')) {
                handleResetGrades();
              }
            }}
          >
            Reset Grades
          </Button>
        </div>
      </Card>
    </div>
  );
}