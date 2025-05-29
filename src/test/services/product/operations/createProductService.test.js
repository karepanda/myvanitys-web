// src/test/services/product/operations/createProductService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductService } from '../../../../services/product/operations/createProductService';
import { productApiAdapter } from '../../../../services/product/adapters/productApiAdapter';

// Mockeamos el adaptador de la API
vi.mock('../../../../services/product/adapters/productApiAdapter', () => ({
	productApiAdapter: {
		post: vi.fn(),
	},
}));

describe('createProductService', () => {
	// Creamos algunos datos de prueba que usaremos en varios tests
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

	// Antes de cada test, limpiamos todos los mocks
	beforeEach(() => {
		vi.clearAllMocks();
		// Restauramos la consola para evitar ruido en los tests
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('debería llamar al adaptador con los datos correctos y añadir Bearer al token', async () => {
		// Configuramos el mock para devolver una respuesta exitosa
		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });

		// Ejecutamos la función que queremos probar
		const result = await createProductService.createProduct(
			token,
			productData,
			errorHandler
		);

		// Verificamos que el adaptador fue llamado con los parámetros correctos
		// Nota: El servicio siempre añade "Bearer " al token, por lo que verificamos eso
		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			{
				name: productData.name,
				brand: productData.brand,
				categoryId: productData.categoryId,
				colorHex: productData.color,
			},
			// Aquí está el cambio clave - esperamos "Bearer test-token" en lugar de "test-token"
			'Bearer test-token',
			errorHandler
		);

		// Verificamos que el resultado es el esperado
		expect(result).toEqual({ id: 1, ...productData });
	});

	it('debería mantener el prefijo "Bearer " en el token si ya lo tiene', async () => {
		// Configuramos el mock para devolver una respuesta exitosa
		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });

		// Ejecutamos la función con un token que ya tiene el prefijo "Bearer"
		await createProductService.createProduct(
			tokenWithBearer,
			productData,
			errorHandler
		);

		// Verificamos que el adaptador fue llamado con el token sin duplicar el prefijo
		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			expect.any(Object),
			tokenWithBearer,
			errorHandler
		);
	});

	it('debería añadir el prefijo "Bearer " al token si no lo tiene', async () => {
		// Configuramos el mock para devolver una respuesta exitosa
		productApiAdapter.post.mockResolvedValue({ id: 1, ...productData });

		// Ejecutamos la función sin el prefijo Bearer en el token
		const tokenSinBearer = 'test-token-sin-bearer';
		await createProductService.createProduct(
			tokenSinBearer,
			productData,
			errorHandler
		);

		// Verificamos que el adaptador fue llamado con el token corregido
		expect(productApiAdapter.post).toHaveBeenCalledWith(
			'/products',
			expect.any(Object),
			'Bearer test-token-sin-bearer',
			errorHandler
		);
	});

	it('debería manejar errores y llamar a errorHandler.showGenericError', async () => {
		// Configuramos el mock para lanzar un error
		productApiAdapter.post.mockRejectedValue(new Error('API Error'));

		// Ejecutamos la función que esperamos que maneje el error
		const result = await createProductService.createProduct(
			token,
			productData,
			errorHandler
		);

		// Verificamos que el manejador de errores fue llamado
		expect(errorHandler.showGenericError).toHaveBeenCalled();

		// Verificamos que la función devolvió null en caso de error
		expect(result).toBeNull();
	});

	it('debería funcionar correctamente sin un manejador de errores', async () => {
		// Configuramos el mock para lanzar un error
		productApiAdapter.post.mockRejectedValue(new Error('API Error'));

		// Ejecutamos la función sin un manejador de errores
		const result = await createProductService.createProduct(
			token,
			productData,
			null
		);

		// Verificamos que la función no falla y devuelve null
		expect(result).toBeNull();
	});
});
