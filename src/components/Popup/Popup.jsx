import { IoClose, IoLogoGoogle } from 'react-icons/io5';
import { useContext } from 'react';
import { VanitysContext } from '../../context';
import './Popup.css';
import './Popup.responsive.css';

const Popup = ({
	title,
	descriptionTitle,
	description,
	textButtom,
	imageUrl,
	closeFunction,
	authMode,
}) => {
	// Using context to obtain authentication functions
	const { initiateLogin, initiateRegister } = useContext(VanitysContext);

	const redirectToGoogleOAuth = () => {
		console.log('Popup Auth mode:', authMode);

		// Use context-specific functions according to mode
		if (authMode === 'login') {
			initiateLogin();
		} else if (authMode === 'register') {
			initiateRegister();
		} else {
			console.error(`Modo de autenticación desconocido: ${authMode}`);
		}
	};

	const handleClose = (e) => {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}

		console.log(`Closing ${authMode} popup`);

		if (typeof closeFunction === 'function') {
			closeFunction();
		} else {
			console.error('closeFunction is not a function', closeFunction);
		}
	};

	return (
		<div className='popup' role='dialog' aria-modal='true' aria-labelledby='auth-popup-title'>
			<div className='popup__container'>
				<section className='popup__header'>
					<p className='popup__brand'>My Vanity’s</p>
					<button type='button' onClick={handleClose} className='popup__header--icon' aria-label={`Close ${title}`}><IoClose aria-hidden='true' /></button>
				</section>
				<div className='popup__imageWrap'><img className='popup__image' src={imageUrl} alt='' width='900' height='900' decoding='async' /></div>
				<section className='popup__description'>
					<p className='popup__eyebrow'>{title === 'Login' ? 'Welcome back' : 'Your vanity starts here'}</p>
					<h1 id='auth-popup-title' className='popup__description--title'>{descriptionTitle}</h1>
					<p className='popup__description--text'>{description}</p>
					<button
						className='popup__description--btn'
						onClick={() => redirectToGoogleOAuth()}
					>
						<IoLogoGoogle />
						{textButtom}
					</button>
					<p className='popup__privacy'>We only use Google to securely identify your account.</p>
				</section>
			</div>
		</div>
	);
};

export { Popup };
