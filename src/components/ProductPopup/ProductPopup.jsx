import React, { useContext, useState } from 'react';
import './ProductPopup.css';
import { IoClose } from 'react-icons/io5';
import { FaRegStar } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';
import { VanitysContext } from '../../context/index';
import { CreateReviewPopup } from '../CreateReviewPopup/CreateReviewPopup';
import { useReviews } from '../../hooks';

const ProductPopup = () => {
	const {
		toggleProductPopup,
		selectedProduct,
		handleAddToVanity,
		isAdding,
		isAuthenticated,
		toggleCreateReviewPopup,
	} = useContext(VanitysContext);

	const {
		reviews,
		loading: reviewsLoading,
		loadReviews,
	} = useReviews(selectedProduct?.id);

	const handleReviewCreated = (newReview) => {
		console.log('New review created:', newReview);
		setReviewsRefreshTrigger((prev) => prev + 1);
	};

	const handleCloseReviewPopup = () => {
		setShowCreateReviewPopup(false);
	};

	const displayReviews = selectedProduct?.reviews || reviews;

	return (
		<>
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
					{reviewsLoading ? (
						<p className='productPopup__reviews--loading'>
							Loading reviews...
						</p>
					) : displayReviews && displayReviews.length > 0 ? (
						displayReviews.map((review) => (
							<div
								key={review.id}
								className='productPopup__reviews--one'
							>
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
								{review.createdAt && (
									<p className='productPopup__reviews--date'>
										{new Date(review.createdAt).toLocaleDateString()}
									</p>
								)}
							</div>
						))
					) : (
						<div className='productPopup__reviews--noReviews'>
							<p>This product has no reviews available.</p>
							{isAuthenticated && (
								<p className='productPopup__reviews--encouragement'>
									Be the first to review this product!
								</p>
							)}
						</div>
					)}
				</section>

				<section className='productPopup__add'>
					{!selectedProduct.inUserCollection ? (
						<button
							className='productPopup__add--buttom'
							onClick={() => {
								handleAddToVanity(selectedProduct);
								toggleProductPopup();
							}}
							disabled={isAdding}
						>
							Add to my Vanitys
						</button>
					) : (
						<button
							onClick={() => {
								toggleProductPopup();
								toggleCreateReviewPopup(selectedProduct.id);
							}}
							className='productPopup__add--buttonReview'
						>
							Write a Review
						</button>
					)}
				</section>
			</div>
		</>
	);
};

export { ProductPopup };
