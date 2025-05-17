// src/hooks/useFetchUserProducts.js
import { useState, useEffect, useContext } from 'react';
import { VanitysContext } from '../context';

/**
 * Hook personalizado para obtener los productos asociados al usuario actual
 * Su única responsabilidad es obtener y gestionar datos de productos
 * 
 * @returns {Object} Objeto con productos, error y estado de carga
 */
export const useFetchUserProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    apiResponse, 
    findProductsByUserId, 
    errorHandler 
  } = useContext(VanitysContext);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserProducts = async () => {
      // Verificar si tenemos los datos necesarios para hacer la petición
      if (!apiResponse?.token || !apiResponse?.user?.id) {
        console.warn('No token or user ID available to fetch products');
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      
      // Verificar explícitamente que el token sea una cadena no vacía
      if (typeof apiResponse.token !== 'string' || apiResponse.token.trim() === '') {
        console.error('Invalid authentication token:', apiResponse.token);
        
        if (isMounted) {
          // Usar errorHandler para mostrar un mensaje apropiado
          errorHandler.handleApiError('auth', 'withoutToken');
          setError(new Error('Token de autenticación inválido'));
          setLoading(false);
        }
        return;
      }
      
      try {
        console.log(`Fetching products for user: ${apiResponse.user.id}`);
        console.log(`Using authentication token: ${apiResponse.token.substring(0, 10)}...`);
        
        // Obtener productos del usuario pasando explícitamente el token
        const userProducts = await findProductsByUserId(
          apiResponse.token, 
          apiResponse.user.id
        );
        
        // Actualizar estado solo si el componente sigue montado
        if (isMounted) {
          if (userProducts) {
            console.log(`Successfully fetched ${userProducts.length} products`);
            setProducts(userProducts);
          } else {
            console.log('No products returned from API');
            setProducts([]);
          }
          setLoading(false);
        }
      } catch (fetchError) {
        console.error('Error fetching user products:', fetchError);
        
        if (isMounted) {
          setError(fetchError);
          setLoading(false);
          
          // Usar el errorHandler del contexto
          errorHandler.showGenericError();
        }
      }
    };
    
    if (apiResponse) {
      fetchUserProducts();
    } else {
      setLoading(false);
    }
    
    // Función de limpieza para evitar actualizar estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [apiResponse, findProductsByUserId, errorHandler]);
  
  return { products, error, loading };
};