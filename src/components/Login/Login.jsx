import React, { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Popup } from '../Popup/Popup';

const Login = () => {
	const { toggleModalLogin } = useContext(VanitysContext);

	return (
		<Popup
			title='Register'
			descriptionTitle='Organize your beauty collection effortlessly'
			description='Keep track of your skincare and makeup products with ease – no more wasting time trying to remember what you already have!'
			textButtom='Sing up with Google'
			imageUrl='src/assets/register_logIn.png'
			closeFunction={toggleModalLogin}
		/>
	);
};

export { Login };
