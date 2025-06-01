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
		try {
			// Validate required parameters
			if (!token || !query) {
				console.warn('Missing token or query for searchProducts');
				return [];
			}

			// Validate minimum query length as per API spec
			if (query.trim().length < 2) {
				console.warn('Search query must be at least 2 characters long');
				return [];
			}

			console.log(`🔍 Searching products with query: "${query}"`);

			const searchParams = new URLSearchParams();
			searchParams.append('query', query.trim());

			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, value);
				}
			});

			const products = await productApiAdapter.get(
				`/products/search?${searchParams.toString()}`,
				token,
				errorHandler
			);

			console.log(`✅ Search completed. Found ${products?.length || 0} products`);

			return products || [];
		} catch (error) {
			console.error(`❌ Error in searchProducts for query "${query}":`, error);
			return [];
		}
	},

	/**
	 * Search products by category
	 * @param {string} token - Authorization token
	 * @param {string} categoryId - Category identifier
	 * @param {Object} errorHandler - Error handler instance
	 * @returns {Promise<Array|null>} - Array of products in category or null in case of error
	 */
	searchProductsByCategory: async (token, categoryId, errorHandler) => {
		try {
			// Validate required parameters
			if (!token || !categoryId) {
				console.warn('Missing token or categoryId for searchProductsByCategory');
				return [];
			}

			console.log(`🔍 Searching products in category: ${categoryId}`);

			const products = await productApiAdapter.get(
				`/products/category/${categoryId}`,
				token,
				errorHandler
			);

			console.log(`✅ Category search completed. Found ${products?.length || 0} products`);

			return products || [];
		} catch (error) {
			console.error(`❌ Error in searchProductsByCategory for category ${categoryId}:`, error);
			return [];
		}
	},
};