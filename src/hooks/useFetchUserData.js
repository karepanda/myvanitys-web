// src/hooks/useFetchUserData.js
import { useContext } from 'react';
import { useFetch } from './useFetch';
import { VanitysContext } from '../context';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to fetch user data for the dashboard
 * @returns {Object} Object with data, error, and loading
 */
const useFetchUserData = () => {
  // Get errorHandler from the context
  const { errorHandler } = useContext(VanitysContext);

  // Use useFetch with errorHandler
  const { data, error, loading } = useFetch(
    `${API_URL}/dashboard`,
    'GET',
    {},
    errorHandler
  );

  return { data, error, loading };
};

export { useFetchUserData };