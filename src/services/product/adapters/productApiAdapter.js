// services/product/adapters/productApiAdapter.js
import { apiUtils } from '../../../utils/apiUtils';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Adapter to connect to the product API
 * Handles HTTP communication and basic error handling
 */
export const productApiAdapter = {
  /**
   * Realiza una petición GET a la API de productos
   */
  get: async (endpoint, token, errorHandler) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: apiUtils.getCommonHeaders(token)
      });

      return await handleResponse(response, errorHandler, 'fetch');
    } catch (error) {
      return handleError(error, errorHandler);
    }
  },

  /**
   * Make a POST request to the product API
   */
  post: async (endpoint, data, token, errorHandler) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: apiUtils.getCommonHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response, errorHandler, 'creation');
    } catch (error) {
      return handleError(error, errorHandler);
    }
  },

  /**
   * Make a PUT request to the product API
   */
  put: async (endpoint, data, token, errorHandler) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: apiUtils.getCommonHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response, errorHandler, 'update');
    } catch (error) {
      return handleError(error, errorHandler);
    }
  },

  /**
   * make a DELETE request to the product API
   */
  delete: async (endpoint, token, errorHandler) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: apiUtils.getCommonHeaders(token)
      });

      return await handleResponse(response, errorHandler, 'deletion', true);
    } catch (error) {
      return handleError(error, errorHandler);
    }
  }
};

// Private auxiliary functions
const handleResponse = async (response, errorHandler, operation, returnBooleanOnSuccess = false) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    
    if (errorHandler) {
      errorHandler.handleApiError('product', response.status, errorText);
    }
    
    console.error(`Product ${operation} error: ${response.status}`);
    return returnBooleanOnSuccess ? false : null;
  }

  if (returnBooleanOnSuccess) {
    return true;
  }

  // For answers without content
  if (response.status === 204) {
    return true;
  }

  try {
    return await response.json();
  } catch (error) {
    console.error(`Error parsing JSON response: ${error}`);
    return null;
  }
};

const handleError = (error, errorHandler) => {
  console.error('API operation error:', error);
  
  if (errorHandler) {
    if (!navigator.onLine) {
      errorHandler.showNetworkError();
    } else {
      errorHandler.showGenericError();
    }
  }
  
  return null;
};