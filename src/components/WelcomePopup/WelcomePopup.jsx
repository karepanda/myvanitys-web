import React, { useContext } from 'react';
import './WelcomePopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const WelcomePopup = () => {
	const { setShowWelcomePopup } = useContext(VanitysContext);

	return (
		<div className='welcomePopup'>
			<section className='welcomePopup__header'>
				<h1 className='welcomePopup__header--title'>Congrats!</h1>
				<IoClose
					onClick={() => setShowWelcomePopup(false)}
					size={40}
					className='welcomePopup__header--icon'
				/>
			</section>
			<section className='welcomePopup__content'>
				<p className='welcomePopup__content--text'>
					Welcome to <span>My Vanity's</span>
				</p>
			</section>
		</div>
	);
};

export { WelcomePopup };
