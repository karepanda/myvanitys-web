// src/Routes/index.jsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { UserDashboard } from '../Pages/UserDashboard/UserDashboard';
import { AuthCallbackHandler } from '../components/Auth/AuthCallbackHandler';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/dashboard', element: <UserDashboard /> }, 
		{ path: '/callback', element: <AuthCallbackHandler /> },
	]);

	return routes;
};

export { AppRoutes };