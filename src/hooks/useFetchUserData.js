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
  const { errorHandler, loading: contextLoading, setLoading } = useContext(VanitysContext);

  const { data, error, loading: fetchLoading } = useFetch(
    `${API_URL}/users/profile`,  
    'GET',
    {},
    errorHandler
  );

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