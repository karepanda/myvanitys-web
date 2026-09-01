import { useContext } from 'react';
import './WelcomePopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const WelcomePopup = () => {
	const { setShowWelcomePopup } = useContext(VanitysContext);

	return (
		<div className='welcomePopup' role='dialog' aria-modal='true' aria-labelledby='welcome-title'>
			<div className='welcomePopup__panel'>
			<section className='welcomePopup__header'>
				<p className='welcomePopup__eyebrow'>You’re all set</p>
				<button type='button' onClick={() => setShowWelcomePopup(false)} className='welcomePopup__header--icon' aria-label='Close welcome message'><IoClose aria-hidden='true' /></button>
			</section>
			<section className='welcomePopup__content'>
				<h1 id='welcome-title' className='welcomePopup__header--title'>Welcome to My Vanity’s</h1>
				<p className='welcomePopup__content--text'>
					Your personal beauty shelf is ready. Add your products, discover new favorites and make the collection yours.
				</p>
				<button type='button' className='welcomePopup__action' onClick={() => setShowWelcomePopup(false)}>Explore my vanity</button>
			</section>
			</div>
		</div>
	);
};

export { WelcomePopup };
