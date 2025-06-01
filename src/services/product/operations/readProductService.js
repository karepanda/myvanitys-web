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
	 * Gets a product by ID
	 * @param {string} token - Authorization token
	 * @param {string} productId - Product identifier
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Object|null>} - Product object or null in case of error
	 */
	getProductById: async (token, productId, errorHandler) => {
		return await productApiAdapter.get(
			`/products/${productId}`,
			token,
			errorHandler
		);
	},

	/**
	 * Finds products by user ID
	 * @param {string} token - Authorization token
	 * @param {string} userId - User identifier to filter products
	 * @param {Object} errorHandler - Error handler instance (optional)
	 * @returns {Promise<Array|null>} - Array of user's products or empty array in case of error
	 */
	findProductsByUserId: async (token, userId, errorHandler) => {
		try {
			// Validate required parameters
			if (!token || !userId) {
				console.warn('Missing token or userId for findProductsByUserId');
				return [];
			}

			console.log(`Calling API to fetch products for user: ${userId}`);

			// Call the API using the adapter
			// Using the correct route: /users/{userId}/products
			const products = await productApiAdapter.get(
				`/users/${userId}/products`,
				token,
				errorHandler
			);

			// Return products or empty array if none
			return products || [];
		} catch (error) {
			// Log the error only, avoid using errorHandler to prevent loops
			console.error(
				`Error in findProductsByUserId for user ${userId}:`,
				error
			);
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
		return await productApiAdapter.get(
			`/products/featured?limit=${limit}`,
			token,
			errorHandler
		);
	},

	/**
	 * @param {string} token - Authorization token
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Array|null>} - Array of products with collection status or null in case of error
	 */
	getAllProductsWithCollectionStatus: async (token, errorHandler) => {
		try {
			// Validate required parameters
			if (!token) {
				console.warn('Missing token for getAllProductsWithCollectionStatus');
				return [];
			}

			console.log('🔄 Calling API to fetch products with collection status...');

			const products = await productApiAdapter.get(
				'/products/collection-status',
				token,
				errorHandler
			);

			console.log('✅ Products with collection status fetched successfully:', products?.length || 0);

			// Return products or empty array if none
			return products || [];
		} catch (error) {
			console.error('❌ Error in getAllProductsWithCollectionStatus:', error);
			
			// Return empty array to avoid breaking the UI
			return [];
		}
	},

	/**
	 * Gets paginated products
	 * @param {string} token - Authorization token
	 * @param {number} page - Page number
	 * @param {number} size - Page size
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Object|null>} - Paginated products response or null in case of error
	 */
	getProductsPaginated: async (token, page = 0, size = 10, errorHandler) => {
		return await productApiAdapter.get(
			`/products?page=${page}&size=${size}`,
			token,
			errorHandler
		);
	},

	/**
	 * Gets product categories
	 * @param {string} token - Authorization token
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Array|null>} - Array of categories or null in case of error
	 */
	getProductCategories: async (token, errorHandler) => {
		return await productApiAdapter.get('/products/categories', token, errorHandler);
	},
};

export default readProductService;