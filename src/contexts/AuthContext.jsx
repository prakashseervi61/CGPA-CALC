import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('cgpa_app_current_user');
  };

  const handleUpdateUser = (updatedProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('cgpa_app_current_user', JSON.stringify(updatedProfile));
  };

  const value = {
    user,
    isLoggedIn,
    handleLogin,
    handleLogout,
    handleUpdateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;