/**
 * Central export file for all custom hooks
 * Simplifies importing and updating hooks in the application
 */

// Basic hooks
export { useFetch } from './useFetch';

// Hooks related to user data
export { useFetchUserData } from './useFetchUserData';
export { useFetchUserProducts } from './useFetchUserProducts';
export { usePublicProducts } from './usePublicProducts';

// Hooks for mutations/actions
export { useDeleteProduct } from './useDeleteProduct';

// Hooks for reviews
export { useReviews } from './useReviews';