import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { Products } from '../Pages/Products/Products';
import { CallbackAuth } from '../components/CallbackAuth/CallbackAuth';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/products', element: <Products /> },
		{ path: '/callback', element: <CallbackAuth /> },
	]);

	return routes;
};

export { AppRoutes };
