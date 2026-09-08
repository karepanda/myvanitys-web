import { useContext } from 'react';
import './MissingFieldsPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';
import { useTranslation } from 'react-i18next';

const MissingFieldsPopup = ({
	message,
	title,
	type = 'warning',
	onClose,
	redirectToHome = false, 
}) => {
	const { t } = useTranslation('common');
	const { setShowMissingFieldsPopup } = useContext(VanitysContext);
	const messageTitle = title || t('messages.missingFieldsPopupTitle');

	// Función para manejar el cierre
	const handleClose = () => {
		console.log('Closing popup');

		if (onClose) {
			onClose();
		} else {

			setShowMissingFieldsPopup(false);
		}

		if (redirectToHome) {
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
				return baseClass; 
		}
	};

	return (
		<div className='missingFieldsPopup' role='alertdialog' aria-modal='true' aria-labelledby='message-title'>
			<div className='missingFieldsPopup__panel'>
			<section className={getHeaderClass()}>
				<span className='missingFieldsPopup__marker' aria-hidden='true'>!</span>
				<button type='button' onClick={handleClose} className='missingFieldsPopup__header--icon' aria-label={t('messages.close')}><IoClose aria-hidden='true' /></button>
			</section>
			<section className='missingFieldsPopup__content'>
				<h1 id='message-title' className='missingFieldsPopup__header--title'>{messageTitle}</h1>
				<p className='missingFieldsPopup__content--text'>{message}</p>
				<button type='button' className='missingFieldsPopup__action' onClick={handleClose}>{t('messages.dismiss')}</button>
			</section>
			</div>
		</div>
	);
};

export { MissingFieldsPopup };
