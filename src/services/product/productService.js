// services/productService.js
import { apiUtils } from '../utils/apiUtils';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Product-related services
 */
const productService = {
  /**
   * Fetches all products for a user
   * @param {string} token - User authentication token
   * @param {ErrorHandler} errorHandler - Error handler instance
   * @returns {Array|null} - Array of products or null in case of error
   */
  getUserProducts: async (token, errorHandler) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/products`, {
        method: 'GET',
        headers: apiUtils.getCommonHeaders(token)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        
        if (errorHandler) {
          errorHandler.handleApiError('product', response.status, errorText);
        }
        
        return null;
      }

      const productsData = await response.text();
      
      if (!productsData) {
        if (errorHandler) {
          errorHandler.showErrorMessage(
            "No se pudieron obtener los productos",
            "Error de productos",
            "error"
          );
        }
        return null;
      }

      return JSON.parse(productsData);
    } catch (error) {
      console.error('Product service error:', error);
      
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError();
        } else {
          errorHandler.showGenericError();
        }
      }
      
      return null;
    }
  },

  /**
   * Creates a new product
   * @param {string} token - User authentication token
   * @param {Object} productData - Product data to be created
   * @param {ErrorHandler} errorHandler - Error handler instance
   * @returns {Object|null} - Created product or null in case of error
   */
  createProduct: async (token, productData, errorHandler) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/products`, {
        method: 'POST',
        headers: apiUtils.getCommonHeaders(token),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        
        if (errorHandler) {
          errorHandler.handleApiError('product', response.status, errorText);
        }
        
        return null;
      }

      const newProductData = await response.text();
      
      if (!newProductData) {
        if (errorHandler) {
          errorHandler.showErrorMessage(
            "No se pudo crear el producto",
            "Error de creación",
            "error"
          );
        }
        return null;
      }

      return JSON.parse(newProductData);
    } catch (error) {
      console.error('Product creation error:', error);
      
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError();
        } else {
          errorHandler.showGenericError();
        }
      }
      
      return null;
    }
  },

};

export default productService;