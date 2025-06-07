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
			if (!token || !userId) {
				console.warn('Missing token or userId for findProductsByUserId');
				return [];
			}

			const products = await productApiAdapter.get(
				`/users/${userId}/products`,
				token,
				errorHandler
			);

			return (products || []).map((product) => ({
				...product,
				inUserCollection: true,
			}));
		} catch (error) {
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
	 * Gets all products with collection status for the current user
	 * @param {string} token - Authorization token
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Array|null>} - Array of products with collection status or null in case of error
	 */
	getAllProductsWithCollectionStatus: async (token, errorHandler) => {
		try {
			// Validate required parameters
			if (!token) {
				console.warn(
					'Missing token for getAllProductsWithCollectionStatus'
				);
				return [];
			}

			// CORRECTO: Usar el endpoint /products que mapea a getAllProductsWithCollectionStatus
			// Según tu OpenAPI spec, este GET /products devuelve productos con collection status
			const products = await productApiAdapter.get(
				'/products', //  Endpoint correcto según tu OpenAPI spec
				token,
				errorHandler
			);

			// Return products or empty array if none
			return products || [];
		} catch (error) {
			console.error(' Error in getAllProductsWithCollectionStatus:', error);

			// Return empty array to avoid breaking the UI
			return [];
		}
	},

	/**
	 *  NUEVA: Adds an existing product to user's vanity
	 * @param {string} token - Authorization token
	 * @param {string} productId - Product identifier to add to vanity
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Object|null>} - Product object or null in case of error
	 */
	addProductToUserVanity: async (token, productId, errorHandler) => {
		try {
			// Validate required parameters
			if (!token || !productId) {
				console.warn(
					'Missing token or productId for addProductToUserVanity'
				);
				return null;
			}

			// Call the API using the adapter
			const product = await productApiAdapter.post(
				`/products/${productId}/add-to-vanity`,
				{}, // No body needed, productId is in URL
				token,
				errorHandler
			);

			return product;
		} catch (error) {
			console.error('Error in addProductToUserVanity:', error);

			// Return null to indicate failure
			return null;
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
		return await productApiAdapter.get(
			'/products/categories',
			token,
			errorHandler
		);
	},
};

export default readProductService;
