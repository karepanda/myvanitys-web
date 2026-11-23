/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import { VanitysContext } from '../../context';
import { AuthCallbackHandler } from '../../components/Auth/AuthCallbackHandler';
import { authService } from '../../services/auth/authService';
import { trackEvent } from '../../services/analytics/googleAnalytics';

vi.mock('../../services/auth/authService', () => ({
	authService: {
		handleAuthentication: vi.fn(),
	},
}));

vi.mock('../../services/analytics/googleAnalytics', () => ({
	trackEvent: vi.fn(),
}));

const buildContextValue = (overrides = {}) => ({
	updateAuthData: vi.fn(),
	errorHandler: {
		handleApiError: vi.fn(),
		showGenericError: vi.fn(),
		showErrorMessage: vi.fn(),
	},
	setShowWelcomePopup: vi.fn(),
	setShowModalLogin: vi.fn(),
	initiateRegister: vi.fn(),
	...overrides,
});

const renderCallback = (contextValue) =>
	render(
		<I18nextProvider i18n={i18n}>
			<VanitysContext.Provider value={contextValue}>
				<MemoryRouter>
					<AuthCallbackHandler />
				</MemoryRouter>
			</VanitysContext.Provider>
		</I18nextProvider>
	);

describe('AuthCallbackHandler', () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		await i18n.changeLanguage('en');
		window.history.replaceState({}, '', '/');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('completes a successful login callback and stores the session', async () => {
		window.history.replaceState({}, '', '/callback?code=abc123&state=login');
		authService.handleAuthentication.mockResolvedValue({
			token: 'jwt-token',
			userId: 'user-1',
			name: 'Test User',
			email: 'test@example.com',
			isNewUser: false,
		});

		const contextValue = buildContextValue();
		renderCallback(contextValue);

		await waitFor(() => expect(contextValue.updateAuthData).toHaveBeenCalled());

		expect(trackEvent).toHaveBeenCalledWith('login', { method: 'google' });
		expect(contextValue.updateAuthData).toHaveBeenCalledWith(
			expect.objectContaining({
				token: 'jwt-token',
				user: expect.objectContaining({
					id: 'user-1',
					email: 'test@example.com',
				}),
			})
		);
	});

	it('completes a successful registration callback without signing the user in', async () => {
		window.history.replaceState({}, '', '/callback?code=abc123&state=register');
		authService.handleAuthentication.mockResolvedValue({
			userId: 'user-1',
			email: 'test@example.com',
			name: 'Test User',
			isNewUser: true,
			requiresLogin: true,
		});

		const contextValue = buildContextValue();
		renderCallback(contextValue);

		await waitFor(() =>
			expect(contextValue.setShowWelcomePopup).toHaveBeenCalledWith(true)
		);

		expect(trackEvent).toHaveBeenCalledWith('sign_up', { method: 'google' });
		expect(contextValue.updateAuthData).not.toHaveBeenCalled();
	});

	it('shows the error state and reports a failed callback', async () => {
		window.history.replaceState({}, '', '/callback?code=abc123&state=login');
		authService.handleAuthentication.mockResolvedValue(null);

		const contextValue = buildContextValue();
		renderCallback(contextValue);

		expect(await screen.findByText('Authentication error')).toBeInTheDocument();
		expect(contextValue.errorHandler.handleApiError).toHaveBeenCalledWith(
			'auth',
			'withoutUserData',
			'Login failed'
		);
	});
});
