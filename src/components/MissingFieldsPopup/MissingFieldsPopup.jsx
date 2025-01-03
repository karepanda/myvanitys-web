import React, { useContext } from 'react';
import './MissingFieldsPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const MissingFieldsPopup = ({ message }) => {
	const { setShowMissingFieldsPopup } = useContext(VanitysContext);

	return (
		<div className='missingFieldsPopup'>
			<section className='missingFieldsPopup__header'>
				<h1 className='missingFieldsPopup__header--title'>
					Missing fields!
				</h1>
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

export { MissingFieldsPopup };
