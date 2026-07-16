import { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cgpa_app_current_user')) || null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = useMemo(() => !!user, [user]);

  const handleLogin = (profile) => {
    setUser(profile);
    localStorage.setItem('cgpa_app_current_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cgpa_app_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useUser must be used within an AuthProvider');
  return context;
};

export default AuthContext;
