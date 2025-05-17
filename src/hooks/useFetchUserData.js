// src/hooks/useFetchUserData.js
import { useContext } from 'react';
import { useFetch } from './useFetch';
import { VanitysContext } from '../context';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook to fetch user profile and preferences data
 * NOTE: This hook does NOT fetch the user's products (for that, use useFetchUserProducts)
 *
 * @returns {Object} User data, error state, and loading state
 */
const useFetchUserData = () => {
  // Get error handler and loading state from the context
  const { errorHandler, loading: contextLoading, setLoading } = useContext(VanitysContext);

  // Use useFetch to get user profile data
  const { data, error, loading: fetchLoading } = useFetch(
    `${API_URL}/users/profile`,  // Changed from /dashboard to /users/profile for clarity
    'GET',
    {},
    errorHandler
  );

  // Synchronize loading state with the context if necessary
  if (fetchLoading !== contextLoading) {
    setLoading(fetchLoading);
  }

  return {
    userData: data,
    error,
    loading: fetchLoading
  };
};

export { useFetchUserData };