import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { VanitysContext } from '../../context';
import { Popup } from '../Popup/Popup';
import registerLogin from '../../assets/register_logIn.optimized.png';

const Login = () => {
	const { t } = useTranslation('auth');
	const { toggleModalLogin } = useContext(VanitysContext);

	const handleCloseLogin = () => {
		console.log('Closing login modal');
		toggleModalLogin();
	};

	return (
		<Popup
			title={t('login.title')}
			descriptionTitle={t('shared.descriptionTitle')}
			description={t('shared.description')}
			textButtom={t('login.googleButton')}
			imageUrl={registerLogin}
			closeFunction={handleCloseLogin}
			authMode='login'
		/>
	);
};

export { Login };
