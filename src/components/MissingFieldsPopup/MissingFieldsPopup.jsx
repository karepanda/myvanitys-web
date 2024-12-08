import React, { useContext } from 'react';
import './MissingFieldsPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const MissingFieldsPopup = () => {
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
				<p className='missingFieldsPopup__content--text'>
					You need to fill in all the fields to create the product.
				</p>
			</section>
		</div>
	);
};

export { MissingFieldsPopup };
