import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { UserDashboard } from '../Pages/UserDashboard/UserDashboard';
import { Notification } from '../components/Notification/Notification';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/callback', element: <UserDashboard /> },
	]);

	return routes;
};

export { AppRoutes };
