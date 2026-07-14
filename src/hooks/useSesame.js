import { useContext } from 'react';
import DataContext from '../contexts/DataContext';

/**
 * Hook to access semester data and related methods.
 */
export const useSesame = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useSesame must be used within a DataProvider');
  }
  return context;
};