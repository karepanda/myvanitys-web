import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import './Navbar.responsive.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { VanitysContext } from '../../context';

//TO-DO: FIX ERRORS
const Navbar = () => {
	const { t } = useTranslation('auth');
	const {
		showModalRegister,
		toggleModalRegister,
		toggleModalLogin,
		showModalLogin,
		renderButtonWithTooltip,
	} = useContext(VanitysContext);

	return (
		<>
			<header className='header'>
				<h1 className='header__title'>
					My Vanity's
				</h1>

				{renderButtonWithTooltip(
					t('navbar.login'),
					toggleModalLogin,
					'header__login',
					'header'
				)}
				{renderButtonWithTooltip(
					t('navbar.register'),
					toggleModalRegister,
					'header__register',
					'header'
				)}

				{showModalLogin && (
					<Modal>
						<Login />
					</Modal>
				)}

				{showModalRegister && (
					<Modal>
						<Register />
					</Modal>
				)}
			</header>
		</>
	);
};

export { Navbar };
