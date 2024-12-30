import React, { useContext } from 'react';
import './SearchedProductCard.css';
import { VanitysContext } from '../../context/index';

const SearchedProductCard = ({ product }) => {
	const { toggleProductPopup } = useContext(VanitysContext);
	return (
		<div className='searchedProductCard'>
			<div className='searchedProductCard__left'>
				<p className='searchedProductCard__left--name'>{product.name}</p>
				<p className='searchedProductCard__left--brand'>{product.brand}</p>
				<p className='searchedProductCard__left--category'>
					{product.category}
				</p>
				<div className='searchedProductCard__starts'>
					<img
						className='searchedProductCard__start--icon'
						src='src/assets/start_icon.png'
						alt='Start Icon'
					/>
					<p className='searchedProductCard__start--number'>
						{product.reviews[0].stars}
					</p>
				</div>
			</div>
			<div className='searchedProductCard__right'>
				<img
					className='searchedProductCard__right--icon'
					src='src/assets/plus_icon.png'
					alt='Plus icon'
					onClick={() => toggleProductPopup()}
				/>
			</div>
		</div>
	);
};

export { SearchedProductCard };
