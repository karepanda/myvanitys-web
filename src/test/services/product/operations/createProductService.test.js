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
	const tokenWithBearer = 'Bearer test-token';
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

	it('debería llamar al adaptador con los datos correctos y añadir Bearer al token', async () => {
	
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
	
			'Bearer test-token',
			errorHandler
		);


		expect(result).toEqual({ id: 1, ...productData });
	});

	it('debería mantener el prefijo "Bearer " en el token si ya lo tiene', async () => {

		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });


		await createProductService.createProduct(
			tokenWithBearer,
			productData,
			errorHandler
		);


		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			expect.any(Object),
			tokenWithBearer,
			errorHandler
		);
	});

	it('debería añadir el prefijo "Bearer " al token si no lo tiene', async () => {

		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });


		const tokenSinBearer = 'test-token-sin-bearer';
		await createProductService.createProduct(
			tokenSinBearer,
			productData,
			errorHandler
		);


		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			expect.any(Object),
			'Bearer test-token-sin-bearer',
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
