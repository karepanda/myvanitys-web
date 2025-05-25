// src/hooks/useFetchUserProducts.js
import { useState, useEffect, useContext } from 'react';
import { VanitysContext } from '../context';

export const useFetchUserProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { 
    apiResponse, 
    authInitialized,
    findProductsByUserId, 
    errorHandler,
    productsRefreshTrigger // 🔥 Trigger for refresh
  } = useContext(VanitysContext);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('🔄 SIMPLE: Starting fetch...');
      console.log('🔄 Auth initialized:', authInitialized);
      console.log('🔄 Has token:', !!apiResponse?.token);
      console.log('🔄 Has user ID:', !!apiResponse?.user?.id);
      console.log('🔄 Refresh trigger:', productsRefreshTrigger);

      if (!authInitialized || !apiResponse?.token || !apiResponse?.user?.id) {
        console.log('⏳ SIMPLE: Not ready yet, skipping...');
        setLoading(false);
        setProducts([]);
        setError(null);
        return;
      }

      console.log('🚀 SIMPLE: Ready to fetch products for user:', apiResponse.user.id);
      setLoading(true);
      setError(null);

      try {
        const result = await findProductsByUserId(
          apiResponse.token,
          apiResponse.user.id,
          errorHandler
        );

        console.log('📦 SIMPLE: API returned:', result);
        console.log('📦 SIMPLE: Is array?', Array.isArray(result));
        console.log('📦 SIMPLE: Length:', result?.length);

        if (result && Array.isArray(result)) {
          console.log('✅ SIMPLE: Setting products:', result.length);
          setProducts(result);
          setError(null);
        } else {
          console.log('📭 SIMPLE: No products or invalid format');
          setProducts([]);
          setError(null);
        }

      } catch (err) {
        console.error('❌ SIMPLE: Error fetching products:', err);
        setProducts([]);
        setError(err);
      } finally {
        setLoading(false);
        console.log('🏁 SIMPLE: Fetch completed');
      }
    };

    fetchProducts();
  }, [
    authInitialized, 
    apiResponse?.token, 
    apiResponse?.user?.id,
    productsRefreshTrigger // 🔥 Dependency triggering re-fetch
  ]); 

  console.log('🔍 SIMPLE Hook state:', { 
    productsCount: products.length, 
    loading, 
    hasError: !!error,
    refreshTrigger: productsRefreshTrigger
  });

  return { products, error, loading };
};