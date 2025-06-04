import React, { useContext } from 'react';
import './ProductPopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';

const ProductPopup = ({ product }) => {
	const { toggleProductPopup, toggleNotification, apiResponse } =
		useContext(VanitysContext);

	console.log('product:', product);

	return (
		<div className='productPopup'>
			<div className='productPopup__wrapper'>
				<section className='productPopup__header'>
					<p className='productPopup__header--title'>
						<strong>{product.name} - </strong>
						{product.brand}
					</p>
					<IoClose
						size={40}
						className='productPopup__header--icon'
						onClick={() => toggleProductPopup()}
					/>
				</section>

				<section className='productPopup__reviews'>
					<p className='productPopup__reviews--text'>
						Lorem ipsum dolor sit amet consectetur adipiscing elit dictum
						habitant nibh, natoque eget interdum massa velit tristique
						suscipit curabitur augue.
					</p>
					<p className='productPopup__reviews--text'>
						Lorem ipsum dolor sit amet consectetur adipiscing elit dictum
						habitant nibh, natoque eget interdum massa velit tristique
						suscipit curabitur augue.
					</p>
					{/* {reviews.map((review) => (
						<div key={review.id} className='productPopup__reviews--one'>
							<div className='productPopup__reviews--stars'>
								{Array.from({ length: 5 }, (_, i) => (
									<span key={i}>{i < review.stars ? '★' : '☆'}</span>
								))}
							</div>
							<p className='productPopup__reviews--text'>
								Lorem ipsum dolor sit amet consectetur adipiscing elit
								dictum habitant nibh, natoque eget interdum massa velit
								tristique suscipit curabitur augue.
							</p>
						</div>
					))} */}
				</section>
				<section className='productPopup__add'>
					<button className='productPopup__add--buttom'>
						Add Product to My Vanity
					</button>
				</section>
			</div>
		</div>
	);
};

export { ProductPopup };
