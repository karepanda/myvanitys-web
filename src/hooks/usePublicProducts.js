// src/hooks/usePublicProducts.js - VERSIÓN MANUAL
import { useState, useContext } from 'react';
import { VanitysContext } from '../context';

export const usePublicProducts = () => {
  const [publicProducts, setPublicProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false); // 🔥 NUEVO: Track si ya se cargó

  const { 
    apiResponse, 
    authInitialized,
    getProducts,
    findProductsByUserId,
    errorHandler
  } = useContext(VanitysContext);

  // 🔥 NUEVA FUNCIÓN: Cargar productos manualmente
  const loadPublicProducts = async () => {
    console.log('🔄 MANUAL: Starting manual fetch...');
    console.log('🔄 Auth initialized:', authInitialized);
    console.log('🔄 Has token:', !!apiResponse?.token);
    console.log('🔄 Has user ID:', !!apiResponse?.user?.id);

    if (!authInitialized || !apiResponse?.token || !apiResponse?.user?.id) {
      console.log('⏳ MANUAL: Not ready yet, cannot fetch...');
      setError(new Error('User not authenticated'));
      return false;
    }

    console.log('🚀 MANUAL: Starting manual products fetch...');
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Calling APIs...');
      const [allProductsResult, userProductsResult] = await Promise.all([
        getProducts(apiResponse.token, errorHandler),
        findProductsByUserId(apiResponse.token, apiResponse.user.id, errorHandler)
      ]);

      console.log('📦 MANUAL: All products returned:', allProductsResult?.length || 0);
      console.log('📦 MANUAL: User products returned:', userProductsResult?.length || 0);

      const allProds = allProductsResult || [];
      const userProds = userProductsResult || [];

      const userProductIds = new Set(userProds.map(product => product.id));
      const availableProducts = allProds.filter(product => !userProductIds.has(product.id));

      console.log('✅ MANUAL: Products available to add:', availableProducts.length);

      // 🔥 UPDATE STATES
      setAllProducts(allProds);
      setUserProducts(userProds);
      setPublicProducts(availableProducts);
      setFilteredProducts(availableProducts);
      setError(null);
      setHasLoaded(true);

      console.log('🏁 MANUAL: Manual fetch completed successfully');
      return true;

    } catch (err) {
      console.error('❌ MANUAL: Error fetching products:', err);
      
      // Error handling
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError('noConnection');
        } else if (err.status >= 500) {
          errorHandler.handleApiError('product', err.status, 'Server error loading public products');
        } else {
          console.warn('Non-critical error loading public products:', err);
        }
      }
      
      setAllProducts([]);
      setUserProducts([]);
      setPublicProducts([]);
      setFilteredProducts([]);
      setError(err);
      setHasLoaded(false);
      
      console.log('🏁 MANUAL: Manual fetch completed with error');
      return false;

    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNCIÓN: Limpiar datos
  const clearData = () => {
    console.log('🧹 MANUAL: Clearing all data...');
    setAllProducts([]);
    setUserProducts([]);
    setPublicProducts([]);
    setFilteredProducts([]);
    setError(null);
    setHasLoaded(false);
  };

  // 🔍 Search functionality for public products (mantener)
  const searchPublicProducts = (searchTerm) => {
    if (!hasLoaded) {
      console.warn('Cannot search - data not loaded yet');
      return;
    }

    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredProducts(publicProducts);
      return;
    }

    const searchResults = publicProducts.filter(product => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredProducts(searchResults);
  };

  // 🔍 Filter by category (mantener)
  const filterByCategory = (categoryId) => {
    if (!hasLoaded) {
      console.warn('Cannot filter - data not loaded yet');
      return;
    }

    if (!categoryId) {
      setFilteredProducts(publicProducts);
      return;
    }

    const categoryResults = publicProducts.filter(product => 
      product.categoryId === categoryId
    );

    setFilteredProducts(categoryResults);
  };

  console.log('🔍 MANUAL Hook state:', { 
    totalProducts: allProducts.length,
    userProducts: userProducts.length,
    availableProducts: publicProducts.length,
    filteredProducts: filteredProducts.length,
    loading, 
    hasError: !!error,
    hasLoaded
  });

  return { 
    // Data
    publicProducts: filteredProducts,
    allProducts,
    userProducts,
    loading, 
    error,
    hasLoaded,
    
    // Functions
    loadPublicProducts, 
    clearData,
    searchPublicProducts,
    filterByCategory
  };
};