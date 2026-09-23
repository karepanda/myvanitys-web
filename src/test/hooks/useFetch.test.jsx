/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import 'react';
import { VanitysContext } from '../../context';
import { useFetch } from '../../hooks';

describe('useFetch session expiry', () => {
	const token = 'access-token-123';
	const stableHeaders = {};
	let errorHandler;
	let fetchMock;

	const makeWrapper = (apiResponse) =>
		function Wrapper({ children }) {
			return (
				<VanitysContext.Provider value={{ apiResponse, errorHandler }}>
					{children}
				</VanitysContext.Provider>
			);
		};

	beforeEach(() => {
		errorHandler = {
			handleApiError: vi.fn(),
			showNetworkError: vi.fn(),
			showGenericError: vi.fn(),
			showErrorMessage: vi.fn(),
		};
		fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('triggers session invalidation with the token on an authenticated 401', async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 401,
			text: vi.fn().mockResolvedValue('{}'),
		});

		const { result } = renderHook(
			() => useFetch('https://api.test/products', 'GET', stableHeaders, errorHandler),
			{ wrapper: makeWrapper({ token }) }
		);

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(errorHandler.handleApiError).toHaveBeenCalledWith(
			'product',
			401,
			'{}',
			token
		);
		expect(result.current.error?.status).toBe(401);
	});

	it('passes the token for non-401 errors without deciding invalidation', async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 500,
			text: vi.fn().mockResolvedValue('{}'),
		});

		const { result } = renderHook(
			() => useFetch('https://api.test/products', 'GET', stableHeaders, errorHandler),
			{ wrapper: makeWrapper({ token }) }
		);

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(errorHandler.handleApiError).toHaveBeenCalledWith(
			'product',
			500,
			'{}',
			token
		);
	});

	it('does not fire a request or an API error when there is no access token', async () => {
		const { result } = renderHook(
			() => useFetch('https://api.test/products', 'GET', stableHeaders, errorHandler),
			{ wrapper: makeWrapper(null) }
		);

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(fetchMock).not.toHaveBeenCalled();
		expect(errorHandler.handleApiError).not.toHaveBeenCalled();
		expect(errorHandler.showErrorMessage).toHaveBeenCalled();
	});
});
