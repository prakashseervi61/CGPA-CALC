import { useState, useEffect } from 'react';

/**
 * Custom hook to synchronize state with localStorage.
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if key doesn't exist in localStorage
 * @returns {[state, setState]} - State setter pair
 */
const useLocalStorage = (key, initialValue) => {
  // Get from localStorage then
  const readValue = () => {
    // Prevent build error "window is undefined" but keep keep
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = (value) => {
    // Allow value to be a function so we have same API as useState
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;