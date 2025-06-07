import React, { useContext } from 'react';
import './UserMessage.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const UserMessage = ({
	message,
	title = 'Missing fields',
	type = 'warning', // Fixed: Added missing closing parenthesis
}) => { // Fixed: Added missing arrow function syntax
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
		<div className='missingFieldsPopup'>
			<section className={getHeaderClass()}>
				<h1 className='missingFieldsPopup__header--title'>{title}</h1>
				<IoClose
					onClick={() => setShowMissingFieldsPopup(false)}
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

export { UserMessage };