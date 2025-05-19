// services/product/productFacade.js
import { createProductService } from './operations/createProductService';
import { readProductService } from './operations/readProductService';
import { updateProductService } from './operations/updateProductService';
import { deleteProductService } from './operations/deleteProductService';
import { searchProductService } from './operations/searchProductService';

/**
 * Fachada para el servicio de productos
 * Proporciona una interfaz unificada para todas las operaciones relacionadas con productos
 */
export const productFacade = {
	// Métodos de creación
	createProduct: createProductService.createProduct,
	createProductVariation: createProductService.createProductVariation,

	// Métodos de lectura
	getProducts: readProductService.getProducts,
	getProductById: readProductService.getProductById,
	findProductsByUserId: readProductService.findProductsByUserId,
	getProductCategories: readProductService.getProductCategories,
	getFeaturedProducts: readProductService.getFeaturedProducts,
	getProductsPaginated: readProductService.getProductsPaginated,

	// Métodos de actualización
	updateProduct: updateProductService.updateProduct,
	updateProductStatus: updateProductService.updateProductStatus,
	updateProductPrice: updateProductService.updateProductPrice,

	// Métodos de eliminación
	deleteProduct: deleteProductService.deleteProduct,
	deleteProductVariation: deleteProductService.deleteProductVariation,

	// Métodos de búsqueda
	searchProducts: searchProductService.searchProducts,
	searchProductsByCategory: searchProductService.searchProductsByCategory,
	searchProductsByPriceRange: searchProductService.searchProductsByPriceRange,
};

export default productFacade;
