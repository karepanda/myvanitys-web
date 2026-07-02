import React, { useContext } from 'react';
import './UserMessage.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const UserMessage = ({
	message,
	title = 'Missing fields',
	type = 'warning',
	onClose,
}) => {
	const { setShowMissingFieldsPopup } = useContext(VanitysContext);

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
				<button type='button' className='missingFieldsPopup__header--icon' onClick={() => onClose ? onClose() : setShowMissingFieldsPopup(false)} aria-label='Close message'><IoClose aria-hidden='true' /></button>
			</section>
			<section className='missingFieldsPopup__content'>
				<h1 className='missingFieldsPopup__header--title'>{title}</h1>
				<p className='missingFieldsPopup__content--text'>{message}</p>
				<button type='button' className='missingFieldsPopup__action' onClick={() => onClose ? onClose() : setShowMissingFieldsPopup(false)}>Got it</button>
			</section>
			</div>
		</div>
	);
};

export { UserMessage };
