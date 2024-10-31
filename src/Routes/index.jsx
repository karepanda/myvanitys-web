import { useRoutes } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { Products } from '../Pages/Products/Products';
import { Prueba } from '../Pages/Prueba/Prueba';

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/', element: <Home /> },
		{ path: '/products', element: <Products /> },
		{ path: '/prueba', element: <Prueba /> },
	]);

	return routes;
};

export { AppRoutes };
