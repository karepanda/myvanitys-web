// src/components/SearchedProductCard/SearchedProductCard.jsx
import React, { useContext, useState } from 'react';
import './SearchedProductCard.css';
import { VanitysContext } from '../../context/index';
import { ProductPopup } from '../ProductPopup/ProductPopup';
import { Modal } from '../Modal/Modal';

const SearchedProductCard = ({ product }) => {
	const {
		toggleProductPopup,
		toggleNotification,
		showProductPopup,
		apiResponse,
		errorHandler,
		addExistingProductToVanity,
	} = useContext(VanitysContext);

	const [isAdding, setIsAdding] = useState(false);

	const averageRating = product.averageRating || 0;

	const isInCollection = product.inUserCollection;

	// Handle adding product to vanity
	const handleAddToVanity = async (e) => {
		e.stopPropagation(); // Prevent triggering the card click

		if (isInCollection) {
			console.log('Product already in collection');
			return;
		}

		const token = apiResponse?.token;

		if (!token) {
			errorHandler?.showErrorMessage?.(
				'You are not authenticated. Please log in to continue.',
				'Authentication error',
				'error'
			);
			return;
		}

		setIsAdding(true);

		try {
			console.log(`Adding searched product ${product.name} to vanity...`);

			const success = await addExistingProductToVanity?.(token, product);

			if (success) {
				// Show notification
				toggleNotification();
				// The refresh is automatically handled in handleAddToVanity of the context.
			} else {
				throw new Error('Failed to add product to vanity');
			}
		} catch (error) {
			console.error('Error adding searched product to vanity:', error);
			errorHandler?.showGenericError?.();
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<div className='searchedProductCard'>
			<div
				className='searchedProductCard__left'
				onClick={() => toggleProductPopup()}
			>
				<p className='searchedProductCard__left--name'>{product.name}</p>
				<p className='searchedProductCard__left--brand'>{product.brand}</p>
				<p className='searchedProductCard__left--category'>
					{product.category?.name || product.category || 'No category'}
				</p>
				<div className='searchedProductCard__starts'>
					<img
						className='searchedProductCard__start--icon'
						src='src/assets/start_icon.png'
						alt='Start Icon'
					/>
					<p className='searchedProductCard__start--number'>
						{averageRating.toFixed(1)}
					</p>
				</div>
			</div>
			<div className='searchedProductCard__right'>
				{isInCollection ? (
					<div className='searchedProductCard__right--collected'>
						<span style={{ color: 'green', fontSize: '24px' }}>✓</span>
					</div>
				) : (
					<img
						className={`searchedProductCard__right--icon ${
							isAdding ? 'adding' : ''
						}`}
						src='src/assets/plus_icon.png'
						alt='Plus icon'
						onClick={handleAddToVanity}
						style={{
							cursor: isAdding ? 'not-allowed' : 'pointer',
							opacity: isAdding ? 0.5 : 1,
						}}
					/>
				)}
			</div>
			{showProductPopup && (
				<Modal>
					<ProductPopup
						color={product.colorHex || product.color}
						reviews={product.reviews || []}
						product={product}
					/>
				</Modal>
			)}
		</div>
	);
};

export { SearchedProductCard };