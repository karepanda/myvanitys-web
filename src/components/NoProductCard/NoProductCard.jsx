import React, { useContext } from 'react';
import './NoProductCard.css';
import { VanitysContext } from '../../context/index';
import createProduct from '../../assets/CreateProduct.png';

const NoProductCard = () => {
	const { toggleCreateProductPopup } = useContext(VanitysContext);

	return (
		<div className='noProductCard'>
			<img
				className='noProductCard__image'
				src={createProduct}
				alt='No product image'
			/>
			<div className='noProductCard__text'>
				<p className='noProductCard__text--regular'>
					No products for the moment,
				</p>
				<p className='noProductCard__text--bold'>
					Be the first to create a product!!
				</p>
			</div>
			<button
				onClick={() => toggleCreateProductPopup()}
				className='noProductCard__button'
			>
				Create Product
			</button>
		</div>
	);
};

export { NoProductCard };
