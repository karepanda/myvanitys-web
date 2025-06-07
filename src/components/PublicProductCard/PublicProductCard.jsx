import React, { useContext } from 'react';
import { VanitysContext } from '../../context/index';
import './PublicProductCard.css';
import startIcon from '../../assets/start_icon.png';
import plusIcon from '../../assets/plus_icon.png';
import { ProductPopup } from '../ProductPopup/ProductPopup';
import { Modal } from '../Modal/Modal';

const PublicProductCard = ({ product }) => {
	const { handleAddToVanity, toggleProductPopup, showProductPopup } =
		useContext(VanitysContext);

	const average =
		product.averageRating && product.averageRating !== 0
			? product.averageRating
			: 0;

	return (
		<div className='publicProductCard'>
			<div
				className='publicProductCard__left'
				onClick={() => toggleProductPopup(product)}
			>
				<p className='publicProductCard__left--name'>{product.name}</p>
				<p className='publicProductCard__left--description'>
					{product.brand}
				</p>
				<div>
					<img
						className='publicProductCard__left--startIcon'
						src={startIcon}
						alt='Review icons'
					/>
					<p className='publicProductCard__left--reviews'>{average}</p>
				</div>
			</div>
			<div className='publicProductCard__right'>
				<img
					src={plusIcon}
					alt='Plus icon to add product'
					className='publicProductCard__right--plusIcon'
					onClick={() => handleAddToVanity(product)}
				/>
			</div>
			{showProductPopup && (
				<Modal>
					<ProductPopup />
				</Modal>
			)}
		</div>
	);
};

export { PublicProductCard };
