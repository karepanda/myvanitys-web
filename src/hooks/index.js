// src/hooks/index.js
/**
 * Central export file for all custom hooks
 * Simplifies importing and updating hooks in the application
 */

// Basic hooks
export { useFetch } from './useFetch';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';

// Hooks related to user data
export { useFetchUserData } from './useFetchUserData';
export { useFetchUserProducts } from './useFetchUserProducts';

// Hooks related to products
export { useProductSearch } from './useProductSearch';
export { useProductCategories } from './useProductCategories';

/**
 * Guide on using hooks:
 *
 * - useFetch: Generic hook to make HTTP requests with authentication and error handling
 * Example: const { data, error, loading } = useFetch('/endpoint', 'GET', {}, errorHandler);
 *
 * - useFetchUserData: Fetches user profile and preferences data (NOT products)
 * Example: const { userData, error, loading } = useFetchUserData();
 *
 * - useFetchUserProducts: Fetches the products associated with the current user
 * Example: const { products, error, loading } = useFetchUserProducts();
 *
 * - useProductSearch: Allows searching for products with filter parameters
 * Example: const { results, loading, search } = useProductSearch();
 *
 * - useProductCategories: Fetches and manages product categories
 * Example: const { categories, loading, selectedCategory, setSelectedCategory } = useProductCategories();
 */