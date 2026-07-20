import React, { useContext } from 'react';
import './Navbar.css';
import './Navbar.responsive.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { VanitysContext } from '../../context';

//TO-DO: FIX ERRORS
const Navbar = () => {
	const {
		showModalRegister,
		toggleModalRegister,
		toggleModalLogin,
		showModalLogin,
		showCookieBanner,
		renderButtonWithTooltip,
	} = useContext(VanitysContext);

	return (
		<>
			<header className='header'>
				<h1 className='header__title'>
					My Vanity's
				</h1>

				{renderButtonWithTooltip(
					'Log in',
					toggleModalLogin,
					'header__login',
					'header'
				)}
				{renderButtonWithTooltip(
					'Register',
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
