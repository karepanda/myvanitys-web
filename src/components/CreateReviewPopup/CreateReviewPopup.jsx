import { useContext, useState } from 'react';
import './CreateReviewPopup.css';
import { VanitysContext } from '../../context/index';
import { MissingFieldsPopup } from '../MissingFieldsPopup/MissingFieldsPopup';
import { Modal } from '../Modal/Modal';

const CreateReviewPopup = () => {
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
		errorMessage,
		errorTitle,
		errorType,
        errorHandler
	} = useContext(VanitysContext);

    const handleSubmitCreateReview = (e) => {
        e.preventDefault();

        if (selectedRating === 0) {
            errorHandler.showValidationError('requiredFields');
            return;
        }

        if (!reviewText.trim()) {
            errorHandler.showValidationError('requiredFields');
            return;
        }

        const reviewData = {
            rating: selectedRating,
            text: reviewText,
        };

        console.log('Review submitted:', reviewData);

        setSelectedRating(0);
        setReviewText('');
        toggleCreateReviewPopup();
    };

	return (
		<div className='createReviewPopup'>
			<div className='createReviewPopup__container'>
				<div className='createReviewPopup__header'>
					<h1 className='createReviewPopup__header--title'>
						Add Products to your Vanity
					</h1>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='38'
						height='38'
						viewBox='0 0 24 24'
						className='createReviewPopup__header--close'
						onClick={() => toggleCreateReviewPopup()}
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
                        {/* Resto del formulario */}
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
							type='text'
							className='createReviewPopup__right--textarea'
							value={reviewText}
							onChange={(e) => setReviewText(e.target.value)}
						></textarea>
						<button
							type='submit'
							className='createReviewPopup__right--button'
						>
							Create Review
						</button>
					</form>
				</div>
			</div>

			{showMissingFieldsPopup && (
				<Modal>
					<MissingFieldsPopup
						message={errorMessage || 'You need to fill in all the fields to create the review.'}
						title={errorTitle}
						type={errorType}
						onClose={() => {
							setShowMissingFieldsPopup(false);
						}}
					/>
				</Modal>
			)}
		</div>
	);
};

export { CreateReviewPopup };