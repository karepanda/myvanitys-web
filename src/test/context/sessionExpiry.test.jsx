/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useContext } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VanitysProvider, VanitysContext } from '../../context';

const token = 'token-A';

const seedAuth = (authToken) => {
	localStorage.setItem(
		'vanitys_auth',
		JSON.stringify({
			token: authToken,
			user: { id: 'user-1' },
			expiresAt: Date.now() + 60 * 60 * 1000,
		})
	);
};

const Probe = () => {
	const ctx = useContext(VanitysContext);
	return (
		<div>
			<span data-testid='auth-state'>
				{ctx.isAuthenticated ? 'authenticated' : 'unauthenticated'}
			</span>
			<span data-testid='error-message'>{ctx.errorMessage}</span>
			<span data-testid='popup-state'>{String(ctx.showMissingFieldsPopup)}</span>
			<button
				data-testid='fire-401'
				onClick={() =>
					ctx.errorHandler.handleApiError(
						'product',
						401,
						'{}',
						ctx.apiResponse?.token
					)
				}
			>
				fire 401
			</button>
			<button
				data-testid='fire-stale-401'
				onClick={() =>
					ctx.errorHandler.handleApiError('product', 401, '{}', 'stale-token')
				}
			>
				fire stale 401
			</button>
			<button
				data-testid='fire-401-a'
				onClick={() =>
					ctx.errorHandler.handleApiError('product', 401, '{}', 'token-A')
				}
			>
				fire 401 A
			</button>
			<button
				data-testid='re-auth-same-token'
				onClick={() =>
					ctx.updateAuthData(
						{
							token: 'token-A',
							user: { id: 'user-1' },
							expiresAt: Date.now() + 60 * 60 * 1000,
						},
						false
					)
				}
			>
				re-auth same token
			</button>
			<button
				data-testid='re-auth-then-late-401'
				onClick={() => {
					ctx.updateAuthData(
						{
							token: 'token-B',
							user: { id: 'user-1' },
							expiresAt: Date.now() + 60 * 60 * 1000,
						},
						false
					);
					ctx.errorHandler.handleApiError('product', 401, '{}', 'token-A');
				}}
			>
				re-auth then late 401
			</button>
		</div>
	);
};

const waitForAuthState = (state) =>
	waitFor(() =>
		expect(screen.getByTestId('auth-state').textContent).toBe(state)
	);

describe('VanitysProvider session expiry flow', () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	it('removes vanitys_auth, clears in-memory auth, keeps unrelated storage, and keeps the message visible', async () => {
		seedAuth(token);
		localStorage.setItem('analytics_consent', 'granted');
		localStorage.setItem('preferred_language', 'es');
		localStorage.setItem('cached_image', 'data:image/png;base64,abc');
		sessionStorage.setItem('welcomeShow', 'true');

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		await waitForAuthState('authenticated');

		fireEvent.click(screen.getByTestId('fire-401'));

		await waitForAuthState('unauthenticated');

		expect(localStorage.getItem('vanitys_auth')).toBeNull();
		expect(localStorage.getItem('analytics_consent')).toBe('granted');
		expect(localStorage.getItem('preferred_language')).toBe('es');
		expect(localStorage.getItem('cached_image')).toBe('data:image/png;base64,abc');
		expect(sessionStorage.getItem('welcomeShow')).toBeNull();

		// The session-expired message remains visible after the in-app logout.
		expect(screen.getByTestId('popup-state').textContent).toBe('true');
		expect(screen.getByTestId('error-message').textContent).toContain('expired');
	});

	it('does not log out a newer session for a stale 401 from an old token', async () => {
		seedAuth(token);

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		await waitForAuthState('authenticated');

		fireEvent.click(screen.getByTestId('fire-stale-401'));

		await waitForAuthState('authenticated');
		expect(localStorage.getItem('vanitys_auth')).not.toBeNull();
	});

	it('handles two concurrent 401s for the same token without leaving a stale session', async () => {
		seedAuth(token);

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		await waitForAuthState('authenticated');

		fireEvent.click(screen.getByTestId('fire-401'));
		fireEvent.click(screen.getByTestId('fire-401'));

		await waitForAuthState('unauthenticated');
		expect(localStorage.getItem('vanitys_auth')).toBeNull();
	});

	it('does not log out the new session when a late 401 for the old token arrives before re-render', async () => {
		seedAuth('token-A');

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		await waitForAuthState('authenticated');

		// Re-auth to token-B and fire the old token-A 401 in the same tick,
		// before React re-renders the provider.
		fireEvent.click(screen.getByTestId('re-auth-then-late-401'));

		await waitForAuthState('authenticated');
		const stored = JSON.parse(localStorage.getItem('vanitys_auth'));
		expect(stored.token).toBe('token-B');
	});

	it('can invalidate a new session that reuses a previously invalidated token', async () => {
		seedAuth('token-A');

		render(
			<VanitysProvider>
				<Probe />
			</VanitysProvider>
		);

		await waitForAuthState('authenticated');

		// First expiry of token-A.
		fireEvent.click(screen.getByTestId('fire-401-a'));
		await waitForAuthState('unauthenticated');

		// New session that reuses the same token value.
		fireEvent.click(screen.getByTestId('re-auth-same-token'));
		await waitForAuthState('authenticated');

		// The dedup must have been reset, so token-A can expire again.
		fireEvent.click(screen.getByTestId('fire-401-a'));
		await waitForAuthState('unauthenticated');
		expect(localStorage.getItem('vanitys_auth')).toBeNull();
	});
});
