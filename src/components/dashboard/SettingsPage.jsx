import { useState } from 'react';
import {
  Settings, User, KeyRound, Database, RotateCcw, Check, Edit2, X,
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import { useData } from '../../contexts/DataContext';

const PROFILE_KEY = 'cgpa_app_profile';

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export default function SettingsPage() {
  const { handleResetGrades } = useData();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPin, setIsEditingPin] = useState(false);

  const profile = loadProfile();
  const [name, setName] = useState(profile.name || '');
  const [studentId, setStudentId] = useState(profile.studentId || '');
  const [targetCgpa, setTargetCgpa] = useState(profile.targetCgpa?.toString() || '9.00');
  const [savedNotice, setSavedNotice] = useState(false);

  // PIN change state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null);

  const handleProfileSave = (e) => {
    e.preventDefault();
    saveProfile({ name, studentId, targetCgpa: parseFloat(targetCgpa) || 0 });
    setIsEditingProfile(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handlePinChangeSubmit = (e) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMessage({ type: 'error', text: 'New PIN must be exactly 4 digits.' });
      return;
    }
    saveProfile({ ...profile, pin: newPin });
    setIsEditingPin(false);
    setPinMessage({ type: 'success', text: '4-Digit PIN updated successfully!' });
    setCurrentPin('');
    setNewPin('');
    setTimeout(() => setPinMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border-strong">
        <div>
          <h2 className="text-xl font-black text-text-primary flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            Settings & Preferences
          </h2>
          <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider mt-0.5">
            Manage student profile, PIN, target CGPA & data exports
          </p>
        </div>

        {savedNotice && (
          <Badge variant="success" size="sm" className="animate-[fade-in_200ms_ease-out_forwards]">
            ✓ Profile Saved
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SECTION 1: Student Profile */}
        <Card variant="elevated" className="col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border-strong">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-primary">Student Profile</h3>
                <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
                  Display name & registration number
                </p>
              </div>
            </div>

            {!isEditingProfile ? (
              <Button variant="outline" size="sm" icon={Edit2} onClick={() => setIsEditingProfile(true)}>
                Edit Profile
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setName(profile.name || '');
                  setStudentId(profile.studentId || '');
                  setTargetCgpa(profile.targetCgpa?.toString() || '9.00');
                }}
                className="text-xs font-extrabold text-text-tertiary hover:text-text-primary flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <Input
              id="profile-name"
              label="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={!isEditingProfile}
              required
            />
            <Input
              id="profile-id"
              label="Register / Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your reg no"
              disabled={!isEditingProfile}
              required
            />
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-extrabold text-text-secondary w-full">Target CGPA Goal</label>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border dark:border-border-strong text-black font-extrabold text-sm bg-surface dark:bg-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-stone-50 dark:disabled:bg-stone-800 disabled:text-text-disabled disabled:cursor-not-allowed"
                  disabled={!isEditingProfile}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-text-tertiary">
                  out of 10.0
                </span>
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="md" icon={Check}>
                  Save Profile Changes
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* SECTION 2: Security & PIN */}
        <Card variant="elevated" className="col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border-strong">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-warning-light text-warning flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-primary">Security & PIN</h3>
                <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
                  Profile unlock security PIN
                </p>
              </div>
            </div>

            {!isEditingPin ? (
              <Button variant="outline" size="sm" icon={Edit2} onClick={() => setIsEditingPin(true)}>
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
                className="text-xs font-extrabold text-text-tertiary hover:text-text-primary flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handlePinChangeSubmit} className="space-y-4">
            <Input
              id="current-pin"
              label="Current PIN"
              type="password"
              maxLength={4}
              inputMode="numeric"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••"
              disabled={!isEditingPin}
            />
            <Input
              id="new-pin"
              label="New 4-Digit PIN"
              type="password"
              maxLength={4}
              inputMode="numeric"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••"
              disabled={!isEditingPin}
            />

            {pinMessage && (
              <div className={`p-3 rounded-lg text-xs font-extrabold ${
                pinMessage.type === 'success'
                  ? 'bg-success-light text-success-text border-success-border'
                  : 'bg-danger-light text-danger-text border-danger-border'
              }`}>
                {pinMessage.text}
              </div>
            )}

            {isEditingPin && (
              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="md" icon={Check}>
                  Update Security PIN
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* SECTION 3: Data Management */}
      <Card variant="elevated">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border dark:border-border-strong">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-text-primary">Data Management</h3>
            <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
              Reset all semester grades to default
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all selected grades back to unselected?')) {
                handleResetGrades();
              }
            }}
          >
            Reset All Grades
          </Button>
        </div>
      </Card>
    </div>
  );
}
