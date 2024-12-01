import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { VanitysContext, VanitysProvider } from '../context';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { useContext } from 'react';

const AppContent = () => {
	// Usa el contexto aquí, dentro del árbol de VanitysProvider
	const { apiResponse } = useContext(VanitysContext);

	console.log(apiResponse);

	return (
		<BrowserRouter>
			<Navbar />
			{apiResponse && <Dashboard />}
			<AppRoutes />
		</BrowserRouter>
	);
};

const App = () => {
	return (
		<VanitysProvider>
			<AppContent />
		</VanitysProvider>
	);
};

export { App };
