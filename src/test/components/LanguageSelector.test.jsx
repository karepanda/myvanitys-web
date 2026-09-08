/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageSelector } from '../../components/LanguageSelector/LanguageSelector';
import { Navbar } from '../../components/Navbar/Navbar';
import { UserProfile } from '../../components/UserProfile/UserProfile';
import { VanitysContext } from '../../context';
import i18n from '../../i18n/config';

describe('LanguageSelector', () => {
	beforeEach(async () => {
		localStorage.clear();
		await act(async () => {
			await i18n.changeLanguage('en');
		});
	});

	afterEach(async () => {
		await act(async () => {
			await i18n.changeLanguage('en');
		});
		localStorage.clear();
	});

	it('changes language and lets the configured detector persist it', async () => {
		render(<LanguageSelector />);

		fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
			target: { value: 'es' },
		});

		await waitFor(() => {
			expect(i18n.resolvedLanguage).toBe('es');
			expect(localStorage.getItem('i18nextLng')).toBe('es');
		});
		expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveValue('es');
	});

	it('renders in exactly one navigation according to authentication state', () => {
		const buildContext = (apiResponse) => ({
			apiResponse,
			showUserProfile: Boolean(apiResponse?.token),
			showModalRegister: false,
			showModalLogin: false,
			toggleModalRegister: () => {},
			toggleModalLogin: () => {},
			toggleUserProfile: () => {},
			toggleCreateProductPopup: () => {},
			logout: () => {},
			renderButtonWithTooltip: (label) => <button>{label}</button>,
		});
		const navigations = (apiResponse) => (
			<VanitysContext.Provider value={buildContext(apiResponse)}>
				<MemoryRouter>
					<Navbar />
					<UserProfile />
				</MemoryRouter>
			</VanitysContext.Provider>
		);
		const { rerender } = render(navigations(null));

		expect(screen.getAllByRole('combobox', { name: 'Language' })).toHaveLength(1);

		rerender(navigations({ token: 'test-token' }));

		expect(screen.getAllByRole('combobox', { name: 'Language' })).toHaveLength(1);
	});
});
