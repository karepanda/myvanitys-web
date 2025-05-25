import React, { useContext } from 'react';
import './MissingFieldsPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const MissingFieldsPopup = ({
	message,
	title = 'Missing fields!',
	type = 'warning',
	onClose,
	redirectToHome = false, 
}) => {
	const { setShowMissingFieldsPopup } = useContext(VanitysContext);

	// Función para manejar el cierre
	const handleClose = () => {
		console.log('Closing popup');

		if (onClose) {
			console.log('Using provided onClose function');
			onClose();
		} else {
			console.log('Using context setShowMissingFieldsPopup');
			setShowMissingFieldsPopup(false);
		}

		// 🔥 SOLO redirigir si explícitamente se solicita
		if (redirectToHome) {
			console.log('Redirecting to home as requested');
			window.location.href = '/';
		}
	};

	// Get the appropriate class according to type
	const getHeaderClass = () => {
		const baseClass = 'missingFieldsPopup__header';

		switch (type) {
			case 'error':
				return `${baseClass} ${baseClass}--error`;
			case 'info':
				return `${baseClass} ${baseClass}--info`;
			case 'warning':
			default:
				return baseClass; // Original style is warning
		}
	};

	return (
		<div className='missingFieldsPopup'>
			<section className={getHeaderClass()}>
				<h1 className='missingFieldsPopup__header--title'>{title}</h1>
				<IoClose
					onClick={handleClose}
					size={40}
					className='missingFieldsPopup__header--icon'
				/>
			</section>
			<section className='missingFieldsPopup__content'>
				<p className='missingFieldsPopup__content--text'>{message}</p>
			</section>
		</div>
	);
};

export { MissingFieldsPopup };