// src/hooks/useFetchUserData.js
import { useContext } from 'react';
import { useFetch } from './useFetch';
import { VanitysContext } from '../context';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to fetch user data for the dashboard
 * @returns {Object} Object with data, error, and loading states
 */
const useFetchUserData = () => {
  // Get errorHandler and loading from context
  const { errorHandler, loading: contextLoading, setLoading } = useContext(VanitysContext);

  // Using useFetch with errorHandler
  const { data, error, loading: fetchLoading } = useFetch(
    `${API_URL}/dashboard`,
    'GET',
    {},
    errorHandler
  );

  // Synchronize load status with context if necessary
  if (fetchLoading !== contextLoading) {
    setLoading(fetchLoading);
  }

  return { 
    data, 
    error, 
    // We use local loading state for faster responses in the UI
    loading: fetchLoading
  };
};

export { useFetchUserData };