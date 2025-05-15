// services/product/operations/searchProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const searchProductService = {
  /**
   * Search products by name, description or other attributes
   * @param {string} token - Authorization token
   * @param {string} query - Search query string
   * @param {Object} options - Additional search options (category, price range, etc.)
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Array|null>} - Array of matching products or null in case of error
   */
  searchProducts: async (token, query, options = {}, errorHandler) => {

    const searchParams = new URLSearchParams();
    if (query) searchParams.append('query', query);
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    
    return await productApiAdapter.get(
      `/products/search?${searchParams.toString()}`, 
      token, 
      errorHandler
    );
  },
  
  /**
   * Search products by category
   * @param {string} token - Authorization token
   * @param {string} categoryId - Category identifier
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Array|null>} - Array of products in category or null in case of error
   */
  searchProductsByCategory: async (token, categoryId, errorHandler) => {
    return await productApiAdapter.get(
      `/products/category/${categoryId}`, 
      token, 
      errorHandler
    );
  },
  

};