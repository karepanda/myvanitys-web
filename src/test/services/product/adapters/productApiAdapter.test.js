/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { productApiAdapter } from '../../../../services/product/adapters/productApiAdapter';

describe('productApiAdapter session expiry', () => {
	const token = 'access-token-123';
	let errorHandler;
	let fetchMock;

	const httpResponse = (status, body = '{}') => ({
		ok: status >= 200 && status < 300,
		status,
		text: vi.fn().mockResolvedValue(body),
		json: vi.fn().mockResolvedValue({}),
	});

	beforeEach(() => {
		errorHandler = {
			handleApiError: vi.fn(),
			showNetworkError: vi.fn(),
			showGenericError: vi.fn(),
		};
		fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	const verbs = [
		{
			name: 'GET',
			run: () => productApiAdapter.get('/products', token, errorHandler),
			expected: null,
		},
		{
			name: 'POST',
			run: () => productApiAdapter.post('/products', { name: 'X' }, token, errorHandler),
			expected: null,
		},
		{
			name: 'PUT',
			run: () => productApiAdapter.put('/products/1', { name: 'X' }, token, errorHandler),
			expected: null,
		},
		{
			name: 'DELETE',
			run: () => productApiAdapter.delete('/products/1', token, errorHandler),
			expected: false,
		},
	];

	it.each(verbs)(
		'authenticated $name 401 triggers session invalidation with the token and returns $expected',
		async ({ run, expected }) => {
			fetchMock.mockResolvedValue(httpResponse(401));

			const result = await run();

			expect(errorHandler.handleApiError).toHaveBeenCalledWith(
				'product',
				401,
				'{}',
				token
			);
			expect(result).toBe(expected);
		}
	);

	it('passes a null token for a no-token 401 so the session is not invalidated', async () => {
		fetchMock.mockResolvedValue(httpResponse(401));

		const result = await productApiAdapter.get('/products', null, errorHandler);

		expect(errorHandler.handleApiError).toHaveBeenCalledWith(
			'product',
			401,
			'{}',
			null
		);
		expect(result).toBeNull();
	});

	it('passes the token for non-401 errors but leaves invalidation to the error handler', async () => {
		fetchMock.mockResolvedValue(httpResponse(500));

		const result = await productApiAdapter.get('/products', token, errorHandler);

		expect(errorHandler.handleApiError).toHaveBeenCalledWith(
			'product',
			500,
			'{}',
			token
		);
		expect(result).toBeNull();
	});

	it('routes network failures to showNetworkError without invoking handleApiError', async () => {
		Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
		fetchMock.mockRejectedValue(new Error('Network down'));

		const result = await productApiAdapter.get('/products', token, errorHandler);

		expect(errorHandler.showNetworkError).toHaveBeenCalled();
		expect(errorHandler.handleApiError).not.toHaveBeenCalled();
		expect(result).toBeNull();
	});
});
