// services/product/operations/readProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const readProductService = {
  /**
   * Gets all products
   * @param {string} token - Authorization token
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Array|null>} - Array of products or null in case of error
   */
  getProducts: async (token, errorHandler) => {
    return await productApiAdapter.get('/products', token, errorHandler);
  },

  /**
   * Gets a product by id
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Product object or null in case of error
   */
  getProductById: async (token, productId, errorHandler) => {
    return await productApiAdapter.get(`/products/${productId}`, token, errorHandler);
  },

  /**
   * Finds products by user ID
   * @param {string} token - Authorization token
   * @param {string} userId - User identifier to filter products
   * @param {Object} errorHandler - Error handler instance (optional)
   * @returns {Promise<Array|null>} - Array of user's products or null in case of error
   */
  findProductsByUserId: async (token, userId, errorHandler) => {
    try {
      // Validar parámetros básicos
      if (!token || !userId) {
        console.warn('Missing token or userId for findProductsByUserId');
        return [];
      }
      
      console.log(`Calling API to fetch products for user: ${userId}`);
      
      // Llamar a la API usando el adaptador
      // Utilizando la ruta correcta: /users/{userId}/products
      const products = await productApiAdapter.get(`/users/${userId}/products`, token, errorHandler);
      
      // Devolver productos o array vacío si no hay productos
      return products || [];
    } catch (error) {
      // Solo loguear el error, no usar errorHandler para evitar ciclos
      console.error(`Error in findProductsByUserId for user ${userId}:`, error);
      return [];
    }
  },

  /**
   * Gets featured products
   * @param {string} token - Authorization token
   * @param {number} limit - Maximum number of products to return
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Array|null>} - Array of featured products or null in case of error
   */
  getFeaturedProducts: async (token, limit = 5, errorHandler) => {
    return await productApiAdapter.get(`/products/featured?limit=${limit}`, token, errorHandler);
  }
};

export default readProductService;