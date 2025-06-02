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

  const searchProducts = async (query, options = {}) => {
    console.log('🔍 SEARCH: Starting search...');

    if (!query || query.trim().length < 2) {
      console.warn('SEARCH: Query must be at least 2 characters long');
      setSearchError('Search query must be at least 2 characters long');
      return false;
    }

    if (!authInitialized || !apiResponse?.token) {
      setSearchError('User not authenticated');
      return false;
    }

    console.log(`🚀 SEARCH: Starting search for: "${query}"`);
    setIsSearching(true);
    setSearchError(null);
    setLastSearchQuery(query.trim());

    try {
      
      const results = await productFacade.searchProducts(
        apiResponse.token,
        query.trim(),
        options,
        errorHandler
      );

      const searchResults = results || [];

      setSearchResults(searchResults);
      setSearchError(null);
      setHasSearched(true);


      return true;

    } catch (err) {
      
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
      
      return false;

    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Search products by category
   */
  const searchByCategory = async (categoryId) => {

    if (!categoryId) {
      console.warn('🔍 CATEGORY SEARCH: Category ID is required');
      setSearchError('Category ID is required');
      return false;
    }

    if (!authInitialized || !apiResponse?.token) {
      setSearchError('User not authenticated');
      return false;
    }

    setIsSearching(true);
    setSearchError(null);
    setLastSearchQuery(`Category: ${categoryId}`);

    try {

      
      const results = await productFacade.searchProductsByCategory(
        apiResponse.token,
        categoryId,
        errorHandler
      );



      const categoryResults = results || [];


      setSearchResults(categoryResults);
      setSearchError(null);
      setHasSearched(true);


      return true;

    } catch (err) {
      console.error('CATEGORY SEARCH: Error searching by category:', err);
      
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
      

      return false;

    } finally {
      setIsSearching(false);
    }
  };


  const clearSearch = () => {
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

  console.log('SEARCH Hook state:', { 
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