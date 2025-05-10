// src/pages/UserDashboard/UserDashboard.jsx
import React, { useEffect, useContext, useState } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { useLocation } from 'react-router';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';

const UserDashboard = () => {
	const {
		getAccessToken,
		setApiResponse,
		apiResponse,
		showWelcomePopup,
		setShowWelcomePopup,
		errorHandler // Añadir esto
	} = useContext(VanitysContext);
	
	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAccessToken(errorHandler); 
			if (data) {
				setApiResponse(data);
				if (!sessionStorage.getItem('welcomeShow')) {
					setShowWelcomePopup(true);
					sessionStorage.setItem('welcomeShow', 'true');
				}
			}
		};

		fetchData();
	}, [getAccessToken, setApiResponse, errorHandler]); 

	const closePopup = () => {
		setShowWelcomePopup(false);
	};

	return (
		<>
			{apiResponse && <Dashboard />}
			{showWelcomePopup && <WelcomePopup onClose={closePopup} />}
		</>
	);
};

export { UserDashboard };