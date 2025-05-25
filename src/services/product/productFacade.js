// services/product/productFacade.js
import { createProductService } from './operations/createProductService';
import { readProductService } from './operations/readProductService';
import { updateProductService } from './operations/updateProductService';
import { deleteProductService } from './operations/deleteProductService';
import { searchProductService } from './operations/searchProductService';

/**
 * Product service facade
 * Provides a unified interface for all product related operations
 */
export const productFacade = {
	// Create
	createProduct: createProductService.createProduct,
	createProductVariation: createProductService.createProductVariation,

	// Read
	getProducts: readProductService.getProducts,
	getProductById: readProductService.getProductById,
	findProductsByUserId: readProductService.findProductsByUserId,
	getProductCategories: readProductService.getProductCategories,
	getFeaturedProducts: readProductService.getFeaturedProducts,
	getProductsPaginated: readProductService.getProductsPaginated,

	// Update
	updateProduct: updateProductService.updateProduct,
	updateProductStatus: updateProductService.updateProductStatus,
	updateProductPrice: updateProductService.updateProductPrice,

	// Delete
	deleteProduct: deleteProductService.deleteProduct,
	deleteProductVariation: deleteProductService.deleteProductVariation,

	// Search
	searchProducts: searchProductService.searchProducts,
	searchProductsByCategory: searchProductService.searchProductsByCategory,
	searchProductsByPriceRange: searchProductService.searchProductsByPriceRange,
};

export default productFacade;
