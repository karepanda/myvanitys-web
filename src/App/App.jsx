import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { DashboardNavigation } from '../components/DashboardNavigation/DashboardNavigation';
import { VanitysContext, VanitysProvider } from '../context';
import { MissingFieldsPopup } from '../components/MissingFieldsPopup/MissingFieldsPopup';
import { Modal } from '../components/Modal/Modal';

import { useContext } from 'react';
import { PublicFooter } from '../components/PublicFooter/PublicFooter';
import { Seo } from '../components/Seo/Seo';
import './App.css';

const AppContent = () => {
	const location = useLocation();
	const {
		showMissingFieldsPopup,
		setShowMissingFieldsPopup,
		errorMessage,
		errorTitle,
		errorType,
		apiResponse,
		authInitialized,
	} = useContext(VanitysContext);

	const isCallback = location.pathname === '/callback';
	const isAuthenticated = authInitialized && apiResponse?.token;
	const showPublicFooter = ['/', '/privacy', '/terms'].includes(location.pathname) && !isAuthenticated;

	return (
		<div className={`app-container${isAuthenticated ? ' app-container--authenticated' : ''}`}>
			<Seo />
			{!isCallback && !authInitialized && (
				<header className='header header--loading' aria-busy='true'>
					<h1 className='header__title'>My Vanity's</h1>
				</header>
			)}
			{!isCallback && !isAuthenticated && authInitialized && <Navbar />}
			{!isCallback && isAuthenticated && <DashboardNavigation />}
			<AppRoutes />
			{showPublicFooter && <PublicFooter />}
			{showMissingFieldsPopup && (
				<Modal>
					<MissingFieldsPopup
						message={errorMessage || 'An error occurred'}
						title={errorTitle}
						type={errorType}
						onClose={() => setShowMissingFieldsPopup(false)}
					/>
				</Modal>
			)}
		</div>
	);
};

const App = () => {
	return (
		<VanitysProvider>
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</VanitysProvider>
	);
};

export { App };
