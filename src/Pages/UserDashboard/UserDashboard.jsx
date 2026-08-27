import { useEffect, useContext } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';
import './UserDashboard.css';

const UserDashboard = () => {
	const {
		apiResponse,
		showWelcomePopup,
		setShowWelcomePopup,
		setShowModalLogin,
		setShowModalRegister,
	} = useContext(VanitysContext);

	useEffect(() => {
		if (setShowModalLogin) setShowModalLogin(false);
		if (setShowModalRegister) setShowModalRegister(false);

		if (apiResponse.isNewUser && !sessionStorage.getItem('welcomeShow')) {
			setShowWelcomePopup(true);
			sessionStorage.setItem('welcomeShow', 'true');
		}
	}, [
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

	return (
		<>
			{showWelcomePopup && <WelcomePopup onClose={closePopup} />}
			<Dashboard />
		</>
	);
};

export { UserDashboard };
