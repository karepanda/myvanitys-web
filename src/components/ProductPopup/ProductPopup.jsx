import React, { useContext, useEffect } from 'react';
import './ProductPopup.css';
import { IoClose } from 'react-icons/io5';
import { FaRegStar } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';
import { VanitysContext } from '../../context/index';
import { CreateReviewPopup } from '../CreateReviewPopup/CreateReviewPopup';
import { useReviews } from '../../hooks';
import { getCategoryLabel, getCategoryName, getSafeHexColor } from '../../utils/dashboardProducts';

const ProductPopup = () => {
	const {
		toggleProductPopup,
		selectedProduct,
		handleAddToVanity,
		isAdding,
		isAuthenticated,
		toggleCreateReviewPopup,
	} = useContext(VanitysContext);

	const { reviews, loading: reviewsLoading, loadReviews } = useReviews(selectedProduct?.id);

	useEffect(() => {
		if (selectedProduct?.id && !selectedProduct?.reviews) loadReviews();
	}, [selectedProduct?.id, selectedProduct?.reviews, loadReviews]);

	if (!selectedProduct) return null;

	const displayReviews = selectedProduct?.reviews || reviews;
	const category = getCategoryName(selectedProduct);
	const color = getSafeHexColor(selectedProduct.colorHex);

	return (
		<>
			<div className='productPopup'>
				<section className='productPopup__header'>
					<div>
						{category && <span className='productPopup__category'>{getCategoryLabel(category)}</span>}
						<h1 className='productPopup__header--title'>{selectedProduct.name}</h1>
						<p>{selectedProduct.brand}</p>
					</div>
					<button type='button' className='productPopup__header--close' onClick={() => toggleProductPopup()} aria-label='Close product details'>
						<IoClose aria-hidden='true' />
					</button>
				</section>
				<section className='productPopup__color'>
					<svg viewBox='0 0 64 64' role='img' aria-label={`Color ${color}`}><circle cx='32' cy='32' r='29' fill={color} /></svg>
					<div><span>Color</span><code>{color}</code></div>
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
										{i < (review.rating || review.stars || 0) ? (
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
							Add to My Vanity
						</button>
					) : (
						<button
							onClick={() => {
								toggleProductPopup();
								toggleCreateReviewPopup(selectedProduct.id);
							}}
							className='productPopup__add--buttonReview'
						>
							Write review
						</button>
					)}
				</section>
			</div>
		</>
	);
};

export { ProductPopup };
