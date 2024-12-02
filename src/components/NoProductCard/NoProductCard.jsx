import React from 'react';
import './NoProductCard.css';

const NoProductCard = () => {
	return (
		<div className='noProductCard'>
			<img
				className='noProductCard__image'
				src='src/assets/CreateProduct.png'
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
			<button className='noProductCard__button'>Create Product</button>
		</div>
	);
};

export { NoProductCard };
