// src/hooks/useProductSearch.js
import { useState, useContext } from 'react';
import { VanitysContext } from '../context';
import { productFacade } from '../services/product/productFacade';

export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const { 
    apiResponse, 
    authInitialized,
    errorHandler
  } = useContext(VanitysContext);

  /**
   * Search products by query string
   */
  const searchProducts = async (query, options = {}) => {
    console.log('🔍 SEARCH: Starting search...');

    if (!query || query.trim().length < 2) {
      console.warn('🔍 SEARCH: Query must be at least 2 characters long');
      setSearchError('Search query must be at least 2 characters long');
      return false;
    }

    if (!authInitialized || !apiResponse?.token) {
      console.log('⏳ SEARCH: Not authenticated, cannot search...');
      setSearchError('User not authenticated');
      return false;
    }

    console.log(`🚀 SEARCH: Starting search for: "${query}"`);
    setIsSearching(true);
    setSearchError(null);
    setLastSearchQuery(query.trim());

    try {
      console.log('📡 SEARCH: Calling search API...');
      
      const results = await productFacade.searchProducts(
        apiResponse.token,
        query.trim(),
        options,
        errorHandler
      );

      console.log('📦 SEARCH: Search results returned:', results?.length || 0);

      const searchResults = results || [];

      // 🔥 UPDATE STATES
      setSearchResults(searchResults);
      setSearchError(null);
      setHasSearched(true);

      console.log('✅ SEARCH: Search completed successfully');
      console.log('🎯 SEARCH: Found products:', searchResults.map(p => `${p.name} by ${p.brand}`));

      return true;

    } catch (err) {
      console.error('❌ SEARCH: Error searching products:', err);
      
      // Error handling similar to usePublicProducts
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError('noConnection');
        } else if (err.status >= 500) {
          errorHandler.handleApiError('search', err.status, 'Server error searching products');
        } else {
          console.warn('Non-critical error searching products:', err);
        }
      }
      
      setSearchResults([]);
      setSearchError(err.message || 'Search failed');
      setHasSearched(true);
      
      console.log('🏁 SEARCH: Search completed with error');
      return false;

    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Search products by category
   */
  const searchByCategory = async (categoryId) => {
    console.log('🔍 CATEGORY SEARCH: Starting category search...');

    if (!categoryId) {
      console.warn('🔍 CATEGORY SEARCH: Category ID is required');
      setSearchError('Category ID is required');
      return false;
    }

    if (!authInitialized || !apiResponse?.token) {
      console.log('⏳ CATEGORY SEARCH: Not authenticated, cannot search...');
      setSearchError('User not authenticated');
      return false;
    }

    console.log(`🚀 CATEGORY SEARCH: Starting search for category: ${categoryId}`);
    setIsSearching(true);
    setSearchError(null);
    setLastSearchQuery(`Category: ${categoryId}`);

    try {
      console.log('📡 CATEGORY SEARCH: Calling category search API...');
      
      const results = await productFacade.searchProductsByCategory(
        apiResponse.token,
        categoryId,
        errorHandler
      );

      console.log('📦 CATEGORY SEARCH: Category results returned:', results?.length || 0);

      const categoryResults = results || [];

      // 🔥 UPDATE STATES
      setSearchResults(categoryResults);
      setSearchError(null);
      setHasSearched(true);

      console.log('✅ CATEGORY SEARCH: Category search completed successfully');
      return true;

    } catch (err) {
      console.error('❌ CATEGORY SEARCH: Error searching by category:', err);
      
      // Error handling
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError('noConnection');
        } else if (err.status >= 500) {
          errorHandler.handleApiError('category-search', err.status, 'Server error searching by category');
        } else {
          console.warn('Non-critical error searching by category:', err);
        }
      }
      
      setSearchResults([]);
      setSearchError(err.message || 'Category search failed');
      setHasSearched(true);
      
      console.log('🏁 CATEGORY SEARCH: Category search completed with error');
      return false;

    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Clear search results and reset state
   */
  const clearSearch = () => {
    console.log('🧹 SEARCH: Clearing search data...');
    setSearchResults([]);
    setSearchError(null);
    setHasSearched(false);
    setLastSearchQuery('');
  };

  /**
   * Filter current search results by additional criteria
   */
  const filterSearchResults = (filterFn) => {
    if (!hasSearched) {
      console.warn('SEARCH: Cannot filter - no search performed yet');
      return;
    }

    const filteredResults = searchResults.filter(filterFn);
    setSearchResults(filteredResults);
  };

  console.log('🔍 SEARCH Hook state:', { 
    searchResultsCount: searchResults.length,
    isSearching, 
    hasError: !!searchError,
    hasSearched,
    lastSearchQuery
  });

  return { 
    // Data
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    lastSearchQuery,
    
    // Functions
    searchProducts,
    searchByCategory, 
    clearSearch,
    filterSearchResults
  };
};