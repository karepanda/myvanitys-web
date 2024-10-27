import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { VanitysProvider } from '../context';
import { useContext } from 'react';

const App = () => {
	return (
		<VanitysProvider>
			<BrowserRouter>
				<Navbar />
				<AppRoutes />
			</BrowserRouter>
		</VanitysProvider>
	);
};
export { App };
