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
		<div className='popup fixed h-screen inset-0 bg-background bg-opacity-60 flex items-center flex-col justify-center align-middle backdrop-blur-sm'>
			<div className='popup__container shadow-lg'>
				<section className='popup__header'>
					<h1 className='popup__header--title'>{title}</h1>
					<IoClose
						onClick={handleClose}
						size={40}
						className='popup__header--icon'
					/>
				</section>
				<img className='popup__image' src={imageUrl} alt='Register image' />
				<section className='popup__description'>
					<h1 className='popup__description--title'>{descriptionTitle}</h1>
					<p className='popup__description--text'>{description}</p>
					<button
						className='popup__description--btn'
						onClick={() => redirectToGoogleOAuth()}
					>
						<IoLogoGoogle />
						{textButtom}
					</button>
				</section>
			</div>
		</div>
	);
};

export { Popup };
