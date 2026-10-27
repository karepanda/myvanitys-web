/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginService } from '../../../services/auth/loginService';

describe('loginService.authenticate', () => {
	let errorHandler;
	let fetchMock;

	const httpResponse = (status, body = '') => ({
		ok: status >= 200 && status < 300,
		status,
		text: vi.fn().mockResolvedValue(body),
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
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('signals requiresRegistration when /auth/google returns 401 (no account)', async () => {
		fetchMock.mockResolvedValue(httpResponse(401, '{}'));

		const result = await loginService.authenticate('code-123', errorHandler);

		expect(result).toEqual({ requiresRegistration: true });
		expect(errorHandler.handleApiError).not.toHaveBeenCalled();
	});

	it('routes other failures through the error handler and returns null', async () => {
		fetchMock.mockResolvedValue(httpResponse(500, '{}'));

		const result = await loginService.authenticate('code-123', errorHandler);

		expect(result).toBeNull();
		expect(errorHandler.handleApiError).toHaveBeenCalledWith('auth', 500, '{}');
	});
});
