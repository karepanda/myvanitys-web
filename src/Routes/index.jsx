import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { UserDashboard } from '../Pages/UserDashboard/UserDashboard';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/callback', element: <UserDashboard /> },
	]);

	return routes;
};

export { AppRoutes };
