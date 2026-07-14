import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Multi-user profiles list state
  const [savedProfiles, setSavedProfiles] = useState(() => {
    const saved = localStorage.getItem('cgpa_app_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [];
  });

  // Currently logged-in active user profile
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cgpa_app_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { }
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('cgpa_app_current_user');
    return !!savedUser;
  });

  const handleLogin = (profile) => {
    setUser(profile);
    setIsLoggedIn(true);
    localStorage.setItem('cgpa_app_current_user', JSON.stringify(profile));

    // Save profile to profiles list if not present
    setSavedProfiles(prev => {
      const exists = prev.some(p => (p.studentId && p.studentId === profile.studentId) || (p.id && p.id === profile.id));
      if (!exists) {
        const updated = [...prev, profile];
        localStorage.setItem('cgpa_app_profiles', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('cgpa_app_current_user');
  };

  const handleDeleteProfile = (profileId) => {
    setSavedProfiles(prev => {
      const updated = prev.filter(p => p.id !== profileId && p.studentId !== profileId);
      localStorage.setItem('cgpa_app_profiles', JSON.stringify(updated));
      return updated;
    });
    // If deleting the currently logged-in user, log out
    if (user && (user.id === profileId || user.studentId === profileId)) {
      handleLogout();
    }
  };

  const handleUpdateUser = (updatedProfile) => {
    setUser(updatedProfile);
    setSavedProfiles(prev => prev.map(p => (p.id === updatedProfile.id || p.studentId === updatedProfile.studentId) ? updatedProfile : p));
    localStorage.setItem('cgpa_app_current_user', JSON.stringify(updatedProfile));
  };

  const value = {
    user,
    isLoggedIn,
    savedProfiles,
    handleLogin,
    handleLogout,
    handleDeleteProfile,
    handleUpdateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;