import { useContext } from 'react';
import './UserMessage.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';
import { useTranslation } from 'react-i18next';

const UserMessage = ({
	message,
	title,
	type = 'warning',
	onClose,
}) => {
	const { t } = useTranslation('common');
	const { setShowMissingFieldsPopup } = useContext(VanitysContext);
	const messageTitle = title || t('messages.missingFieldsTitle');

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
		<div className='missingFieldsPopup' role='alertdialog' aria-modal='true'>
			<div className='missingFieldsPopup__panel'>
			<section className={getHeaderClass()}>
				<span className='missingFieldsPopup__marker' aria-hidden='true'>!</span>
				<button type='button' className='missingFieldsPopup__header--icon' onClick={() => onClose ? onClose() : setShowMissingFieldsPopup(false)} aria-label={t('messages.close')}><IoClose aria-hidden='true' /></button>
			</section>
			<section className='missingFieldsPopup__content'>
				<h1 className='missingFieldsPopup__header--title'>{messageTitle}</h1>
				<p className='missingFieldsPopup__content--text'>{message}</p>
				<button type='button' className='missingFieldsPopup__action' onClick={() => onClose ? onClose() : setShowMissingFieldsPopup(false)}>{t('messages.dismiss')}</button>
			</section>
			</div>
		</div>
	);
};

export { UserMessage };
