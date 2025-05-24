// src/hooks/useFetchUserProducts.js (Con gestión de fallos mejorada)
import { useState, useEffect, useContext } from 'react';
import { VanitysContext } from '../context';

/**
 * Hook personalizado para obtener los productos asociados al usuario actual
 * Con mejor manejo de errores y reintentos
 * 
 * @returns {Object} Objeto con productos, error y estado de carga
 */
export const useFetchUserProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);
  
  const { 
    apiResponse, 
    findProductsByUserId, 
    errorHandler 
  } = useContext(VanitysContext);
  
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    
    const fetchUserProducts = async () => {
      // Si no hay datos de autenticación, no intentar cargar
      if (!apiResponse?.token || !apiResponse?.user?.id) {
        console.warn('No token or user ID available to fetch products');
        if (isMounted) {
          setLoading(false);
          setProducts([]);
        }
        return;
      }
      
      // Para evitar peticiones excesivas
      const now = Date.now();
      if (now - lastAttempt < 1000 && retryCount > 0) {
        return;
      }
      
      setLastAttempt(now);
      
      try {
        console.log(`Fetching products for user: ${apiResponse.user.id}, attempt: ${retryCount + 1}`);
        setLoading(true);
        
        // Llamar a la función del contexto para obtener productos
        const userProducts = await findProductsByUserId(
          apiResponse.token, 
          apiResponse.user.id
        );
        
        // Actualizar estado solo si el componente sigue montado
        if (isMounted) {
          if (userProducts) {
            console.log(`Successfully fetched ${userProducts.length} products`);
            setProducts(userProducts);
            setError(null);
          } else {
            console.log('No products returned from API');
            setProducts([]);
            
            // Si este fue un reintento y seguimos sin datos, considerar un error
            if (retryCount > 0) {
              setError(new Error('No se pudieron cargar los productos'));
            } else {
              // Programar un reintento
              timeoutId = setTimeout(() => {
                if (isMounted) {
                  setRetryCount(prev => prev + 1);
                }
              }, 1000);
            }
          }
          setLoading(false);
        }
      } catch (fetchError) {
        console.error('Error fetching user products:', fetchError);
        
        if (isMounted) {
          // Si es el primer error, reintentar
          if (retryCount < 1) {
            console.log('Scheduling retry...');
            timeoutId = setTimeout(() => {
              if (isMounted) {
                setRetryCount(prev => prev + 1);
              }
            }, 1000);
          } else {
            // Si ya reintentamos, reportar el error
            setError(fetchError);
            // No mostrar el error genérico en el primer intento
            if (retryCount > 1 && errorHandler) {
              errorHandler.showGenericError();
            }
          }
          setLoading(false);
        }
      }
    };
    
    // Si hay un cambio en apiResponse o un intento de reintento, intentar cargar
    fetchUserProducts();
    
    // Función de limpieza
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [apiResponse, findProductsByUserId, errorHandler, retryCount, lastAttempt]);
  
  return { products, error, loading };
};