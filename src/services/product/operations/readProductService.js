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
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Array|null>} - Array of user's products or null in case of error
   */
  findProductsByUserId: async (token, userId, errorHandler) => {
    // Actualizando la ruta según el ejemplo de curl proporcionado
    // El curl muestra: http://localhost:8080/myvanitys/api/v1/users/{userId}/products
    return await productApiAdapter.get(`/users/${userId}/products`, token, errorHandler);
  },
  
  /**
   * Gets product categories
   * @param {string} token - Authorization token
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Array|null>} - Array of categories or null in case of error
   */
  getProductCategories: async (token, errorHandler) => {
    return await productApiAdapter.get('/product-categories', token, errorHandler);
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
  },
  
  /**
   * Gets products with pagination
   * @param {string} token - Authorization token
   * @param {number} page - Page number (starting from 1)
   * @param {number} pageSize - Number of items per page
   * @param {Object} filters - Optional filters to apply
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Paginated products data or null in case of error
   */
  getProductsPaginated: async (token, page = 1, pageSize = 10, filters = {}, errorHandler) => {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page);
    searchParams.append('pageSize', pageSize);
    
    // Añadir filtros adicionales a los parámetros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    
    return await productApiAdapter.get(
      `/products/paginated?${searchParams.toString()}`, 
      token, 
      errorHandler
    );
  }
};

export default readProductService;