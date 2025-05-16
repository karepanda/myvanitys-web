// services/product/operations/createProductService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const createProductService = {
  createProduct: async (token, productData, errorHandler) => {
    
    try {

    console.log('Token used for authentication:', token ? 'Token present, first characters: ' + token.substring(0, 10) + '...' : 'Empty or null token');
    
    //Verify token format
    if (token && !token.startsWith('Bearer ')) {
      console.warn('The token does not have the prefix “Bearer ”. Adding the prefix...');
      token = `Bearer ${token}`;
    }
      const apiData = {
        name: productData.name,
        brand: productData.brand,
        categoryId: productData.categoryId,
        colorHex: productData.color || productData.colorHex
      };
      
      console.log('Sending product data to API:', apiData);
      
      const endpoint = '/products';
      return await productApiAdapter.post(endpoint, apiData, token, errorHandler);
    } catch (error) {
      console.error('Error in createProductService:', error);
      if (errorHandler) {
        errorHandler.showGenericError();
      }
      return null;
    }
  },
};