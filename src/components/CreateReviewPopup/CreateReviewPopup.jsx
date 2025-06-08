import React, { useContext } from 'react';
import './CreateReviewPopup.css';
import { VanitysContext } from '../../context/index';
import { UserMessage } from '../UserMessage/UserMessage';
import { productFacade } from '../../services/product/productFacade';

const CreateReviewPopup = ({ productId, onClose, onReviewCreated }) => {
	const {
		toggleCreateReviewPopup,
		hoveredRating,
		selectedRating,
		setSelectedRating,
		reviewText,
		setReviewText,
		handleMouseOver,
		handleMouseOut,
		handleClick,
		showMissingFieldsPopup,
		setShowMissingFieldsPopup,
		userToken,
	} = useContext(VanitysContext);

	console.log('productId', productId);

	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [messageConfig, setMessageConfig] = React.useState({
		message: '',
		title: '',
		type: 'warning',
	});

	const showMessage = (message, title, type) => {
		setMessageConfig({ message, title, type });
		setShowMissingFieldsPopup(true);
	};

	const handleSubmitCreateReview = async (e) => {
		e.preventDefault();

		// Validation
		if (selectedRating === 0) {
			showMessage(
				'Please select a rating for the product.',
				'Rating Required',
				'warning'
			);
			return;
		}

		if (!reviewText.trim()) {
			showMessage(
				'Please write a comment about the product.',
				'Comment Required',
				'warning'
			);
			return;
		}

		if (!productId || !userToken) {
			showMessage(
				'Authentication required. Please log in to continue.',
				'Authentication Error',
				'error'
			);
			return;
		}

		setIsSubmitting(true);

		try {
			const reviewData = {
				rating: selectedRating,
				comment: reviewText.trim(), // Changed from 'text' to 'comment' to match API
			};

			console.log('Submitting review:', reviewData);

			// Call the actual API
			const result = await productFacade.addReviewToProduct(
				userToken,
				productId,
				reviewData,
				null // errorHandler placeholder
			);

			if (result) {
				console.log('Review created successfully:', result);

				// Show success message
				showMessage(
					'Your review has been added successfully!',
					'Review Added',
					'info'
				);

				// Reset form
				setSelectedRating(0);
				setReviewText('');

				// Notify parent component that review was created
				if (onReviewCreated) {
					onReviewCreated(result);
				}

				// Close popup after a short delay to show success message
				setTimeout(() => {
					handleClosePopup();
				}, 1500);
			}
		} catch (error) {
			console.error('Error creating review:', error);

			// Show error message
			const errorMsg =
				error.message || 'Failed to create review. Please try again.';
			showMessage(errorMsg, 'Error Creating Review', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClosePopup = () => {
		setSelectedRating(0);
		setReviewText('');

		if (onClose) {
			onClose();
		} else {
			toggleCreateReviewPopup();
		}
	};

	return (
		<>
			<div className='createReviewPopup'>
				<div className='createReviewPopup__container'>
					<div className='createReviewPopup__header'>
						<h1 className='createReviewPopup__header--title'>
							Add Review to Product
						</h1>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='38'
							height='38'
							viewBox='0 0 24 24'
							className='createReviewPopup__header--close'
							onClick={handleClosePopup}
						>
							<path
								fill='currentColor'
								d='m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z'
							/>
						</svg>
					</div>
					<div className='createReviewPopup__left'>
						<picture className='createReviewPopup__left--picture'>
							<img
								src='src/assets/product_review_illustration.png'
								alt='Product Review Illustration'
								className='createReviewPopup__left--image'
							/>
						</picture>
					</div>
					<div className='createReviewPopup__right'>
						<p className='createReviewPopup__right--title'>
							Create Your Review
						</p>

						<form
							className='createReviewPopup__right--form'
							onSubmit={handleSubmitCreateReview}
						>
							<div className='createReviewPopup__stars'>
								{[1, 2, 3, 4, 5].map((star) => (
									<svg
										key={star}
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										className={`star ${
											star <= (hoveredRating || selectedRating)
												? 'active'
												: ''
										}`}
										onMouseOver={() => handleMouseOver(star)}
										onMouseOut={handleMouseOut}
										onClick={() => handleClick(star)}
									>
										<path
											fill='f1f1f1'
											d='m8.587 8.236l2.598-5.232a.911.911 0 0 1 1.63 0l2.598 5.232l5.808.844a.902.902 0 0 1 .503 1.542l-4.202 4.07l.992 5.75c.127.738-.653 1.3-1.32.952L12 18.678l-5.195 2.716c-.666.349-1.446-.214-1.319-.953l.992-5.75l-4.202-4.07a.902.902 0 0 1 .503-1.54z'
										/>
									</svg>
								))}
							</div>
							<label className='createReviewPopup__right--label'>
								Insert your opinion about the product
							</label>
							<textarea
								className='createReviewPopup__right--textarea'
								value={reviewText}
								onChange={(e) => setReviewText(e.target.value)}
								placeholder='Write your review here...'
								disabled={isSubmitting}
							></textarea>
							<button
								type='submit'
								className='createReviewPopup__right--button'
								disabled={
									isSubmitting ||
									selectedRating === 0 ||
									!reviewText.trim()
								}
							>
								{isSubmitting ? 'Creating Review...' : 'Create Review'}
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* UserMessage component for all messages */}
			{showMissingFieldsPopup && (
				<UserMessage
					message={messageConfig.message}
					title={messageConfig.title}
					type={messageConfig.type}
				/>
			)}
		</>
	);
};

export { CreateReviewPopup };
