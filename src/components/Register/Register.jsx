import React, { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Popup } from '../Popup/Popup';
import registerLogin from '../../assets/register_logIn.png';

const Register = () => {
	const { toggleModalRegister } = useContext(VanitysContext);

	const handleCloseRegister = () => {
		toggleModalRegister();
	};

	return (
		<Popup
			title='Register'
			descriptionTitle='Organize your beauty collection effortlessly'
			description='Keep track of your skincare and makeup products with ease – no more wasting time trying to remember what you already have!'
			textButtom='Sign up with Google'
			imageUrl={registerLogin}
			closeFunction={handleCloseRegister}
			authMode='register'
		/>
	);
};

export { Register };
