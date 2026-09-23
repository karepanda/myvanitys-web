/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useContext } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { VanitysContext, VanitysProvider } from '../../context';
import { productFacade } from '../../services/product/productFacade';
import { ErrorHandler } from '../../utils/errorHandler';

const Probe = () => {
	const context = useContext(VanitysContext);
	return (
		<>
			<span data-testid='error-message'>{context.errorMessage}</span>
			<span data-testid='is-adding'>{String(context.isAdding)}</span>
			<span data-testid='products-refresh'>
				{context.productsRefreshTrigger}
			</span>
			<span data-testid='public-products-refresh'>
				{context.publicProductsRefreshTrigger}
			</span>
			<button
				onClick={() =>
					context.handleAddToVanity({ id: 'product-1', name: 'Test product' })
				}
			>
				add product
			</button>
		</>
	);
};

describe('VanitysProvider add-to-vanity error flow', () => {
	afterEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.restoreAllMocks();
	});

	it('preserves the session-expired error when adding a product receives 401', async () => {
		localStorage.setItem(
			'vanitys_auth',
			JSON.stringify({
				token: 'token-A',
				user: { id: 'user-1' },
				expiresAt: Date.now() + 60_000,
			})
		);

		const showGenericError = vi.spyOn(ErrorHandler.prototype, 'showGenericError');
		const addProduct = vi
			.spyOn(productFacade, 'addProductToUserVanity')
			.mockImplementation(async (_token, _productId, errorHandler) => {
				errorHandler.handleApiError('product', 401, '{}', 'token-A');
				return null;
			});

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		fireEvent.click(screen.getByText('add product'));

		await waitFor(() =>
			expect(screen.getByTestId('error-message').textContent).toBe(
				'Your session has expired. Please log in again.'
			)
		);
		expect(addProduct).toHaveBeenCalledWith(
			'token-A',
			'product-1',
			expect.any(ErrorHandler)
		);
		expect(showGenericError).not.toHaveBeenCalled();
		expect(screen.getByTestId('is-adding').textContent).toBe('false');
		expect(screen.getByTestId('products-refresh').textContent).toBe('0');
		expect(screen.getByTestId('public-products-refresh').textContent).toBe('0');
		expect(localStorage.getItem('vanitys_auth')).toBeNull();
	});

	it('shows one generic error when adding a product fails without reporting an error', async () => {
		localStorage.setItem(
			'vanitys_auth',
			JSON.stringify({
				token: 'token-A',
				user: { id: 'user-1' },
				expiresAt: Date.now() + 60_000,
			})
		);

		const showGenericError = vi.spyOn(ErrorHandler.prototype, 'showGenericError');
		vi.spyOn(productFacade, 'addProductToUserVanity').mockResolvedValue(null);

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		fireEvent.click(screen.getByText('add product'));

		await waitFor(() => expect(showGenericError).toHaveBeenCalledOnce());
		expect(screen.getByTestId('error-message').textContent).toBe(
			'An unexpected error occurred. Please try again.'
		);
		expect(screen.getByTestId('is-adding').textContent).toBe('false');
		expect(screen.getByTestId('products-refresh').textContent).toBe('0');
		expect(screen.getByTestId('public-products-refresh').textContent).toBe('0');
	});
});
