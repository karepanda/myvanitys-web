import React, { useContext } from 'react';
import './CreateReviewPopup.css';
import { VanitysContext } from '../../context/index';
import { UserMessage } from '../UserMessage/UserMessage';
import { productFacade } from '../../services/product/productFacade';
import { IoClose } from 'react-icons/io5';

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
		userToken,
		setProductsRefreshTrigger,
	} = useContext(VanitysContext);

	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [localMessageConfig, setLocalMessageConfig] = React.useState({
		message: '',
		title: '',
		type: 'warning',
		show: false,
	});

	const showMessage = (message, title, type) => {
		setLocalMessageConfig({
			message,
			title,
			type,
			show: true,
		});
	};

	const hideMessage = () => {
		setLocalMessageConfig((prev) => ({ ...prev, show: false }));
	};

	const handleSubmitCreateReview = async (e) => {
		e.preventDefault();

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
				comment: reviewText.trim(),
			};

			const result = await productFacade.addReviewToProduct(
				userToken,
				productId,
				reviewData,
				null
			);

			if (result) {
				showMessage(
					'Your review has been added successfully!',
					'Review Added',
					'info'
				);

				setSelectedRating(0);
				setReviewText('');

				if (setProductsRefreshTrigger) {
					setProductsRefreshTrigger((prev) => prev + 1);
				}

				if (onReviewCreated) {
					onReviewCreated(result);
				}

				setTimeout(() => {
					hideMessage();
					handleClosePopup();
				}, 1500);
			}
		} catch (error) {
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
		hideMessage();

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
							Write review
						</h1>
						<button type='button' aria-label='Close review form'
							className='createReviewPopup__header--close'
							onClick={handleClosePopup}
						>
							<IoClose aria-hidden='true' />
						</button>
					</div>
					<div className='createReviewPopup__right'>
						<p className='createReviewPopup__right--title'>
							Share your experience
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

			{localMessageConfig.show && (
				<UserMessage
					message={localMessageConfig.message}
					title={localMessageConfig.title}
					type={localMessageConfig.type}
					onClose={hideMessage}
				/>
			)}
		</>
	);
};

export { CreateReviewPopup };
