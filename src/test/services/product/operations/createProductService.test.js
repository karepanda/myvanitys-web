// src/test/services/product/operations/createProductService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductService } from '../../../../services/product/operations/createProductService';
import { productApiAdapter } from '../../../../services/product/adapters/productApiAdapter';


vi.mock('../../../../services/product/adapters/productApiAdapter', () => ({
	productApiAdapter: {
		post: vi.fn(),
	},
}));

describe('createProductService', () => {
	
	const token = 'test-token';
	const productData = {
		name: 'Test Product',
		brand: 'Test Brand',
		categoryId: 1,
		color: '#FFFFFF',
	};
	const errorHandler = {
		showGenericError: vi.fn(),
	};

	
	beforeEach(() => {
		vi.clearAllMocks();
		
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('debería llamar al adaptador con los datos correctos y el token sin modificar', async () => {
	
		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });

		// Ejecutamos la función que queremos probar
		const result = await createProductService.createProduct(
			token,
			productData,
			errorHandler
		);


		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			{
				name: productData.name,
				brand: productData.brand,
				categoryId: productData.categoryId,
				colorHex: productData.color,
			},
	
			token,
			errorHandler
		);


		expect(result).toEqual({ id: 1, ...productData });
	});

	it('no debería añadir el prefijo Bearer antes de delegar en el adaptador', async () => {

		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });


		const rawToken = 'test-token-sin-bearer';
		await createProductService.createProduct(
			rawToken,
			productData,
			errorHandler
		);


		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			expect.any(Object),
			rawToken,
			errorHandler
		);
	});

	it('debería manejar errores y llamar a errorHandler.showGenericError', async () => {

		productApiAdapter.post.mockRejectedValue(new Error('API Error'));

		const result = await createProductService.createProduct(
			token,
			productData,
			errorHandler
		);

		expect(errorHandler.showGenericError).toHaveBeenCalled();


		expect(result).toBeNull();
	});

	it('debería funcionar correctamente sin un manejador de errores', async () => {

		productApiAdapter.post.mockRejectedValue(new Error('API Error'));


		const result = await createProductService.createProduct(
			token,
			productData,
			null
		);


		expect(result).toBeNull();
	});
});
