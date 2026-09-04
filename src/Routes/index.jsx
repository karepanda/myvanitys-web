// src/Routes/index.jsx
import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { UserDashboard } from '../Pages/UserDashboard/UserDashboard';
import { PageNotFound } from '../components/PageNotFound/PageNotFound';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';

import { AuthCallbackHandler } from '../components/Auth/AuthCallbackHandler';
import { LegalPage } from '../Pages/Legal/LegalPage';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/dashboard', element: <ProtectedRoute><UserDashboard /></ProtectedRoute> },
		{ path: '/callback', element: <AuthCallbackHandler /> },
		{ path: '/privacy', element: <LegalPage type='privacy' /> },
		{ path: '/terms', element: <LegalPage type='terms' /> },
		{ path: '/*', element: <PageNotFound /> },
	]);

	return routes;
};

export { AppRoutes };
