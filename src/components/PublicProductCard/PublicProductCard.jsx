import React, { useContext, useState } from 'react';
import { VanitysContext } from '../../context/index';
import './PublicProductCard.css';

const PublicProductCard = ({ product }) => {
	const {
		apiResponse,
		errorHandler,
		showNotificationTemporarily,
		addExistingProductToVanity,
	} = useContext(VanitysContext);

	const [isAdding, setIsAdding] = useState(false);

	const handleAddToVanity = async () => {
		const token = apiResponse?.token;

		if (!token) {
			errorHandler.showErrorMessage(
				'You are not authenticated. Please log in to continue.',
				'Authentication error',
				'error'
			);
			return;
		}

		setIsAdding(true);

		try {
			const success = await addExistingProductToVanity(token, product);

			if (success) {
			} else {
				throw new Error('Failed to add product to vanity');
			}
		} catch (error) {
			errorHandler.showGenericError();
		} finally {
			setIsAdding(false);
		}
	};

	const stars =
		product.reviews && product.reviews.length > 0
			? product.reviews[0].stars
			: 0;

	return (
		<div className='publicProductCard'>
			<div className='publicProductCard__left'>
				<p className='publicProductCard__left--name'>{product.name}</p>
				<p className='publicProductCard__left--description'>
					{product.brand}
				</p>
				<div>
					<img
						className='publicProductCard__left--startIcon'
						src='src/assets/start_icon.png'
						alt='Review icons'
					/>
					<p className='publicProductCard__left--reviews'>4</p>
				</div>
			</div>
			<div className='publicProductCard__right'>
				<img
					src='/src/assets/plus_icon.png'
					alt='Plus icon to add product'
					className='publicProductCard__right--plusIcon'
					onClick={() => handleAddToVanity()}
				/>
			</div>
		</div>
	);
};

export { PublicProductCard };
