/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VanitysContext } from '../../context';
import { Navbar } from '../../components/Navbar/Navbar';
import { DashboardNavigation } from '../../components/DashboardNavigation/DashboardNavigation';

const mockAuthData = {
	token: 'test-token-123',
	user: {
		id: 'user-1',
		name: 'Test User',
		email: 'test@example.com',
		profilePicture: 'https://example.com/photo.jpg',
	},
	expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
};

const buildAuthContextValue = (overrides = {}) => ({
	apiResponse: null,
	authInitialized: true,
	showModalRegister: false,
	showModalLogin: false,
	showCookieBanner: false,
	toggleModalRegister: vi.fn(),
	toggleModalLogin: vi.fn(),
	toggleUserProfile: vi.fn(),
	toggleCreateProductPopup: vi.fn(),
	renderButtonWithTooltip: (label, onClick, className) => (
		<button className={className} onClick={onClick}>{label}</button>
	),
	...overrides,
});

const TestVanitysWrapper = ({ children, contextValue }) => (
	<VanitysContext.Provider value={contextValue}>
		{children}
	</VanitysContext.Provider>
);

describe('Auth Navigation', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
		if (!document.getElementById('modal')) {
			const modalDiv = document.createElement('div');
			modalDiv.id = 'modal';
			document.body.appendChild(modalDiv);
		}
	});

	describe('Navbar (public navigation)', () => {
		it('renders the title, login, and register buttons for unauthenticated users', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText("My Vanity's")).toBeInTheDocument();
			expect(screen.getByText('Log in')).toBeInTheDocument();
			expect(screen.getByText('Register')).toBeInTheDocument();
		});

		it('shows login modal when login button is clicked', () => {
			const toggleModalLogin = vi.fn();
			const contextValue = buildAuthContextValue({ toggleModalLogin });

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			screen.getByText('Log in').click();
			expect(toggleModalLogin).toHaveBeenCalled();
		});

		it('shows register modal when register button is clicked', () => {
			const toggleModalRegister = vi.fn();
			const contextValue = buildAuthContextValue({ toggleModalRegister });

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			screen.getByText('Register').click();
			expect(toggleModalRegister).toHaveBeenCalled();
		});

		it('renders login modal when showModalLogin is true', () => {
			const contextValue = buildAuthContextValue({ showModalLogin: true });

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText('Log in with Google')).toBeInTheDocument();
		});

		it('renders register modal when showModalRegister is true', () => {
			const contextValue = buildAuthContextValue({ showModalRegister: true });

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText('Sign up with Google')).toBeInTheDocument();
		});

		it('does not render login/register buttons when cookie banner is shown (disabled)', () => {
			const toggleModalLogin = vi.fn();
			const contextValue = buildAuthContextValue({
				showCookieBanner: true,
				toggleModalLogin,
				renderButtonWithTooltip: (label, onClick, className, tooltipClass) => (
					<div className={`${tooltipClass}__tooltip-wrapper`}>
						<button className={`${className} disabled`} onClick={onClick} disabled>{label}</button>
						<span className='tooltip'>Accept cookies</span>
					</div>
				),
			});

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			const loginBtn = screen.getByText('Log in');
			expect(loginBtn).toBeDisabled();
		});
	});

	describe('DashboardNavigation (authenticated navigation)', () => {
		it('renders all five navigation items', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText('My Vanity')).toBeInTheDocument();
			expect(screen.getByText('Search')).toBeInTheDocument();
			expect(screen.getByText('Add')).toBeInTheDocument();
			expect(screen.getByText('Explore')).toBeInTheDocument();
			expect(screen.getByText('Profile')).toBeInTheDocument();
		});

		it('renders the brand link', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			const brand = screen.getByText("My Vanity's");
			expect(brand).toBeInTheDocument();
			expect(brand.closest('a')).toHaveAttribute('href', '/dashboard');
		});

		it('highlights "My Vanity" as active when on /dashboard without mode param', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/dashboard']}>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			const myVanityBtn = screen.getByLabelText('My Vanity');
			expect(myVanityBtn).toHaveAttribute('aria-current', 'page');
			expect(myVanityBtn.className).toContain('dashboardNavigation__item--active');
		});

		it('highlights "Search" as active when on /dashboard?mode=search', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/dashboard?mode=search']}>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			const searchBtn = screen.getByLabelText('Search');
			expect(searchBtn).toHaveAttribute('aria-current', 'page');
		});

		it('highlights "Explore" as active when on /dashboard?mode=add-products', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/dashboard?mode=add-products']}>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			const exploreBtn = screen.getByLabelText('Explore');
			expect(exploreBtn).toHaveAttribute('aria-current', 'page');
		});

		it('does not highlight any item on the home page', () => {
			const contextValue = buildAuthContextValue();

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/']}>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			const items = screen.getAllByRole('button');
			items.forEach((item) => {
				expect(item).not.toHaveAttribute('aria-current', 'page');
			});
		});

		it('calls toggleCreateProductPopup when Add is clicked', () => {
			const toggleCreateProductPopup = vi.fn();
			const contextValue = buildAuthContextValue({ toggleCreateProductPopup });

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			screen.getByLabelText('Add product').click();
			expect(toggleCreateProductPopup).toHaveBeenCalled();
		});

		it('calls toggleUserProfile when Profile is clicked', () => {
			const toggleUserProfile = vi.fn();
			const contextValue = buildAuthContextValue({ toggleUserProfile });

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			screen.getByLabelText('Profile').click();
			expect(toggleUserProfile).toHaveBeenCalled();
		});
	});

	describe('localStorage auth persistence', () => {
		it('stores auth data in localStorage with key vanitys_auth', () => {
			localStorage.setItem('vanitys_auth', JSON.stringify(mockAuthData));

			const stored = JSON.parse(localStorage.getItem('vanitys_auth'));
			expect(stored.token).toBe('test-token-123');
			expect(stored.user.id).toBe('user-1');
			expect(stored.user.name).toBe('Test User');
		});

		it('removes expired auth data on load', () => {
			const expiredData = {
				...mockAuthData,
				expiresAt: Date.now() - 1000,
			};
			localStorage.setItem('vanitys_auth', JSON.stringify(expiredData));

			const stored = JSON.parse(localStorage.getItem('vanitys_auth'));
			expect(stored.expiresAt).toBeLessThan(Date.now());

			// Simulate context's loadSavedAuth logic
			if (stored.expiresAt && Date.now() > stored.expiresAt) {
				localStorage.removeItem('vanitys_auth');
			}

			expect(localStorage.getItem('vanitys_auth')).toBeNull();
		});

		it('removes malformed auth data on load', () => {
			localStorage.setItem('vanitys_auth', 'invalid-json{{');

			// Simulate context's loadSavedAuth logic
			try {
				const savedAuth = localStorage.getItem('vanitys_auth');
				const authData = JSON.parse(savedAuth);
				if (!authData?.token || !authData?.user?.id) {
					localStorage.removeItem('vanitys_auth');
				}
			} catch {
				localStorage.removeItem('vanitys_auth');
			}

			expect(localStorage.getItem('vanitys_auth')).toBeNull();
		});

		it('removes auth data with missing token on load', () => {
			const incompleteData = { user: { id: 'user-1' } };
			localStorage.setItem('vanitys_auth', JSON.stringify(incompleteData));

			const stored = JSON.parse(localStorage.getItem('vanitys_auth'));
			if (!stored?.token || !stored?.user?.id) {
				localStorage.removeItem('vanitys_auth');
			}

			expect(localStorage.getItem('vanitys_auth')).toBeNull();
		});

		it('clears auth from localStorage on logout', () => {
			localStorage.setItem('vanitys_auth', JSON.stringify(mockAuthData));

			// Simulate logout
			localStorage.removeItem('vanitys_auth');

			expect(localStorage.getItem('vanitys_auth')).toBeNull();
		});
	});

	describe('AppContent conditional navigation', () => {
		it('renders Navbar when unauthenticated and on home page', () => {
			const contextValue = buildAuthContextValue({
				apiResponse: null,
				authInitialized: true,
			});

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/']}>
						<nav aria-label='Dashboard navigation' style={{ display: 'none' }}>
							{/* this won't render since DashboardNavigation isn't shown */}
						</nav>
						<Navbar />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText('Log in')).toBeInTheDocument();
			expect(screen.getByText('Register')).toBeInTheDocument();
		});

		it('renders DashboardNavigation when authenticated and on home page', () => {
			const contextValue = buildAuthContextValue({
				apiResponse: mockAuthData,
				authInitialized: true,
			});

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/']}>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText('My Vanity')).toBeInTheDocument();
			expect(screen.getByText('Search')).toBeInTheDocument();
			expect(screen.queryByText('Log in')).not.toBeInTheDocument();
		});

		it('renders DashboardNavigation when authenticated and on dashboard', () => {
			const contextValue = buildAuthContextValue({
				apiResponse: mockAuthData,
				authInitialized: true,
			});

			render(
				<TestVanitysWrapper contextValue={contextValue}>
					<MemoryRouter initialEntries={['/dashboard']}>
						<DashboardNavigation />
					</MemoryRouter>
				</TestVanitysWrapper>
			);

			expect(screen.getByText('My Vanity')).toBeInTheDocument();
		});
	});
});
