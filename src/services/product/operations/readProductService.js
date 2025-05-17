// services/product/operations/readProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const readProductService = {
  // [...otros métodos del servicio...]
  
  /**
   * Encuentra productos asociados a un usuario específico
   * @param {string} token - Token de autenticación
   * @param {string} userId - ID del usuario
   * @param {Object} errorHandler - Instancia del manejador de errores
   * @returns {Promise<Array|null>} - Lista de productos o null si hay error
   */
  findProductsByUserId: async (token, userId, errorHandler) => {
    try {
      // Validaciones más estrictas del token
      if (!token) {
        console.error('findProductsByUserId: No authentication token provided');
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'withoutToken');
        }
        return null;
      }
      
      if (typeof token !== 'string' || token.trim() === '') {
        console.error('findProductsByUserId: Invalid token format');
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'withoutToken');
        }
        return null;
      }
      
      if (!userId) {
        console.error('findProductsByUserId: No user ID provided');
        return null;
      }
      
      console.log(`Fetching products for user: ${userId}`);
      console.log(`Using authentication token: ${token.substring(0, 10)}...`);
      
      // Realizar petición a la API usando el adaptador
      // Ruta basada en el curl proporcionado: /users/{userId}/products
      const products = await productApiAdapter.get(`/users/${userId}/products`, token, errorHandler);
      
      // Log del resultado
      if (products) {
        console.log(`Retrieved ${products.length} products for user ${userId}`);
      } else {
        console.log(`No products found for user ${userId}`);
      }
      
      return products || [];
    } catch (error) {
      console.error(`Error in findProductsByUserId for user ${userId}:`, error);
      if (errorHandler) {
        errorHandler.showGenericError();
      }
      return null;
    }
  },
  
  // [...otros métodos del servicio...]
};
