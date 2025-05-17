// Routes/index.jsx
import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { UserDashboard } from '../Pages/UserDashboard/UserDashboard';
import { AuthCallbackHandler } from '../components/Auth/AuthCallbackHandler';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		
		// La ruta /callback sigue existiendo para Google,
		// pero ahora carga un componente específico para procesar la autenticación
		{ path: '/callback', element: <AuthCallbackHandler redirectTo="/dashboard" /> },
		
		// Ruta del dashboard donde se cargan los productos
		{ path: '/dashboard', element: <UserDashboard /> },
	]);

	return routes;
};

export { AppRoutes };