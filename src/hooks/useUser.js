import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook to access user authentication state and methods.
 */
export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};