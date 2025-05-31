// src/pages/UserDashboard/UserDashboard.jsx
import React, { useEffect, useContext } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';
import './UserDashboard.css';

const UserDashboard = () => {
	const {
		apiResponse,
		authInitialized,
		showWelcomePopup,
		setShowWelcomePopup,
		setShowModalLogin,
		setShowModalRegister,
	} = useContext(VanitysContext);

	useEffect(() => {
		if (!authInitialized) {
			return;
		}

		if (setShowModalLogin) setShowModalLogin(false);
		if (setShowModalRegister) setShowModalRegister(false);

		if (!apiResponse?.token) {
			console.log(
				'🔐 No active session found. User needs to log in manually.'
			);
			return;
		}

		if (apiResponse.isNewUser && !sessionStorage.getItem('welcomeShow')) {
			setShowWelcomePopup(true);
			sessionStorage.setItem('welcomeShow', 'true');
		}
	}, [
		authInitialized,
		apiResponse,
		setShowModalLogin,
		setShowModalRegister,
		setShowWelcomePopup,
	]);

	const closePopup = () => {
		setShowWelcomePopup(false);
		if (setShowModalLogin) setShowModalLogin(false);
		if (setShowModalRegister) setShowModalRegister(false);
	};

	if (!authInitialized) {
		return (
			<div className='dashboard-loading'>
				<div className='loading-spinner'></div>
				<p>Initializing application...</p>
			</div>
		);
	}

	return (
		<>
			{apiResponse?.token ? (
				<Dashboard />
			) : (
				<div className='no-session-message'>
					<h2>Welcome to My Vanity's!</h2>
					<p>Please log in to access your dashboard.</p>
					<p>Use the login button in the navigation bar to get started.</p>
				</div>
			)}

			{showWelcomePopup && <WelcomePopup onClose={closePopup} />}
		</>
	);
};

export { UserDashboard };
