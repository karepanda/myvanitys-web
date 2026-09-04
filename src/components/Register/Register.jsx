import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { VanitysContext } from '../../context';
import { Popup } from '../Popup/Popup';
import registerLogin from '../../assets/register_logIn.optimized.png';

const Register = () => {
	const { t } = useTranslation('auth');
	const { toggleModalRegister } = useContext(VanitysContext);

	const handleCloseRegister = () => {
		toggleModalRegister();
	};

	return (
		<Popup
			title={t('register.title')}
			descriptionTitle={t('shared.descriptionTitle')}
			description={t('shared.description')}
			textButtom={t('register.googleButton')}
			imageUrl={registerLogin}
			closeFunction={handleCloseRegister}
			authMode='register'
		/>
	);
};

export { Register };
