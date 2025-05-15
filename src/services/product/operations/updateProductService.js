// services/product/operations/updateProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const updateProductService = {
  /**
   * Updates a product
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {Object} productData - Product data to update
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Updated product or null in case of error
   */
  updateProduct: async (token, productId, productData, errorHandler) => {
    return await productApiAdapter.put(
      `/products/${productId}`, 
      productData, 
      token, 
      errorHandler
    );
  },
  
  /**
   * Updates product status (active/inactive)
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {boolean} isActive - New status
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Updated product or null in case of error
   */
  updateProductStatus: async (token, productId, isActive, errorHandler) => {
    return await productApiAdapter.put(
      `/products/${productId}/status`, 
      { isActive }, 
      token, 
      errorHandler
    );
  },
  
  /**
   * Updates product price
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {number} price - New price
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Updated product or null in case of error
   */
  updateProductPrice: async (token, productId, price, errorHandler) => {
    return await productApiAdapter.put(
      `/products/${productId}/price`, 
      { price }, 
      token, 
      errorHandler
    );
  }
};