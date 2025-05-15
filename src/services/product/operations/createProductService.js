// services/product/operations/createProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const createProductService = {
  /**
   * Creates a new product
   * @param {string} token - Authorization token
   * @param {Object} productData - Product data to be created
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Created product or null in case of error
   */
  createProduct: async (token, productData, errorHandler) => {
    return await productApiAdapter.post('/product', productData, token, errorHandler);
  },
  
  /**
   * Creates a product variation
   * @param {string} token - Authorization token
   * @param {string} productId - Parent product ID
   * @param {Object} variationData - Variation data
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Created variation or null in case of error
   */
  createProductVariation: async (token, productId, variationData, errorHandler) => {
    return await productApiAdapter.post(
      `/products/${productId}/variations`, 
      variationData, 
      token, 
      errorHandler
    );
  }
};