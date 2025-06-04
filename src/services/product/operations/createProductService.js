import { productApiAdapter } from '../adapters/productApiAdapter';

export const createProductService = {
	createProduct: async (token, productData, errorHandler) => {
		try {

			if (token && !token.startsWith('Bearer ')) {
				console.warn(
					'The token does not have the prefix “Bearer ”. Adding the prefix...'
				);
				token = `Bearer ${token}`;
			}
			const apiData = {
				name: productData.name,
				brand: productData.brand,
				categoryId: productData.categoryId,
				colorHex: productData.color || productData.colorHex,
			};


			const endpoint = '/products';
			return await productApiAdapter.post(
				endpoint,
				apiData,
				token,
				errorHandler
			);
		} catch (error) {
			console.error('Error in createProductService:', error);
			if (errorHandler) {
				errorHandler.showGenericError();
			}
			return null;
		}
	},
};
