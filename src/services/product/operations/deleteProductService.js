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
		return await productApiAdapter.delete(
			`/products/${productId}`,
			token,
			errorHandler
		);
	},

	/**
	 * Deletes a product variation
	 * @param {string} token - Authorization token
	 * @param {string} productId - Product identifier
	 * @param {string} variationId - Variation identifier
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<boolean>} - Success flag
	 */
	deleteProductVariation: async (
		token,
		productId,
		variationId,
		errorHandler
	) => {
		return await productApiAdapter.delete(
			`/products/${productId}/variations/${variationId}`,
			token,
			errorHandler
		);
	},
};
