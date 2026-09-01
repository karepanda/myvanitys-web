/**
 * @vitest-environment jsdom
 */
import 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { VanitysContext } from '../../context';
import { ProtectedRoute } from '../../components/ProtectedRoute/ProtectedRoute';

const renderProtectedRoute = (contextValue) => render(
	<VanitysContext.Provider value={contextValue}>
		<MemoryRouter initialEntries={['/dashboard']}>
			<Routes>
				<Route path='/' element={<div>Public home</div>} />
				<Route
					path='/dashboard'
					element={(
						<ProtectedRoute>
							<div>Private dashboard</div>
						</ProtectedRoute>
					)}
				/>
			</Routes>
		</MemoryRouter>
	</VanitysContext.Provider>
);

describe('ProtectedRoute', () => {
	it('renders nothing while authentication is initializing', () => {
		const { container } = renderProtectedRoute({
			authInitialized: false,
			isAuthenticated: false,
		});

		expect(container).toBeEmptyDOMElement();
	});

	it('redirects unauthenticated users to the home page', () => {
		renderProtectedRoute({
			authInitialized: true,
			isAuthenticated: false,
		});

		expect(screen.getByText('Public home')).toBeInTheDocument();
		expect(screen.queryByText('Private dashboard')).not.toBeInTheDocument();
	});

	it('renders protected content for authenticated users', () => {
		renderProtectedRoute({
			authInitialized: true,
			isAuthenticated: true,
		});

		expect(screen.getByText('Private dashboard')).toBeInTheDocument();
	});
});
