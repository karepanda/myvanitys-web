import React, { useContext } from 'react';
import './ProductPopup.css';
import { IoClose } from 'react-icons/io5';
import { FaRegStar } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';
import { VanitysContext } from '../../context/index';

const ProductPopup = () => {
	const { toggleProductPopup, selectedProduct, handleAddToVanity, isAdding } =
		useContext(VanitysContext);

	return (
		<div className='productPopup'>
			<section className='productPopup__header'>
				<p className='productPopup__header--title'>
					<strong>{selectedProduct.name} - </strong>
					{selectedProduct.brand}
				</p>
				<IoClose
					size={40}
					className='productPopup__header--icon'
					onClick={() => toggleProductPopup()}
				/>
			</section>

			<section className='productPopup__reviews'>
				{selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
					selectedProduct.reviews.map((review) => (
						<div key={review.id} className='productPopup__reviews--one'>
							<div className='productPopup__reviews--stars'>
								{Array.from({ length: 5 }, (_, i) => (
									<span key={i}>
										{i < review.rating ? (
											<FaStar size={20} />
										) : (
											<FaRegStar size={20} />
										)}
									</span>
								))}
							</div>
							<p className='productPopup__reviews--text'>
								{review.comment}
							</p>
						</div>
					))
				) : (
					<p className='productPopup__reviews--noReviews'>
						This product has no reviews available.
					</p>
				)}
			</section>
			<section className='productPopup__add'>
				<button
					className='productPopup__add--buttom'
					style={{
						display: selectedProduct.inUserCollection ? 'none' : 'block',
					}}
					onClick={() => {
						handleAddToVanity(selectedProduct);
						toggleProductPopup();
					}}
					disabled={isAdding}
				>
					{!selectedProduct.inUserCollection ? 'Add to my Vanitys' : ''}
				</button>
			</section>
		</div>
	);
};

export { ProductPopup };
