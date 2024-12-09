import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { VanitysContext, VanitysProvider } from '../context';

import { useContext } from 'react';
import './App.css';

const AppContent = () => {
	// Usa el contexto aquí, dentro del árbol de VanitysProvider
	const { apiResponse, showCookieBanner } = useContext(VanitysContext);

	return (
		<div className='app-container'>
			<BrowserRouter>
				<Navbar />
				<AppRoutes />
			</BrowserRouter>
		</div>
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
