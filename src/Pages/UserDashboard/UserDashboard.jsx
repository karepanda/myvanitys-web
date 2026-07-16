import  { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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

	const navigate = useNavigate();

	useEffect(() => {
		if (!authInitialized) {
			return;
		}

		if (setShowModalLogin) setShowModalLogin(false);
		if (setShowModalRegister) setShowModalRegister(false);

		if (!apiResponse?.token) {
			navigate('/', { replace: true });
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
		navigate,
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
			{showWelcomePopup && <WelcomePopup onClose={closePopup} />}
			{apiResponse?.token && <Dashboard />}
		</>
	);
};

export { UserDashboard };
