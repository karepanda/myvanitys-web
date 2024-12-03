import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { CallbackAuth } from '../components/CallbackAuth/CallbackAuth';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/callback', element: <CallbackAuth /> },
	]);

	return routes;
};

export { AppRoutes };
