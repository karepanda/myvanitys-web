import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { Products } from '../Pages/Products/Products';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/products', element: <Products /> },
	]);

	return routes;
};

export { AppRoutes };
