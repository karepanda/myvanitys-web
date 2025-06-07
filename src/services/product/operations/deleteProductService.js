// src/services/product/operations/deleteProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const deleteProductService = {
  /**
   * Deletes a product
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<boolean>} - Success flag
   */
  deleteProduct: async (token, productId, errorHandler) => {
    return await productApiAdapter.delete(`/products/${productId}`, token, errorHandler);
  },
  
};