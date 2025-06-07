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
		userToken, // Asumiendo que tienes el token en el contexto
		isAuthenticated // Asumiendo que tienes el estado de autenticación
	} = useContext(VanitysContext);

	const [showCreateReviewPopup, setShowCreateReviewPopup] = useState(false);
	const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);

	// Hook para manejar reviews si necesitas funcionalidades adicionales
	const {
		reviews,
		loading: reviewsLoading,
		loadReviews
	} = useReviews(selectedProduct?.id);

	const handleReviewCreated = (newReview) => {
		console.log('New review created:', newReview);
		// Trigger refresh of reviews - esto podría recargar selectedProduct desde el contexto
		setReviewsRefreshTrigger(prev => prev + 1);
		
		// Opcional: Si quieres actualizar inmediatamente sin recargar desde el servidor
		// Podrías actualizar selectedProduct en el contexto directamente
	};

	const handleCloseReviewPopup = () => {
		setShowCreateReviewPopup(false);
	};

	// Usar reviews del producto seleccionado o del hook si prefieres
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
						<p className='productPopup__reviews--loading'>Loading reviews...</p>
					) : displayReviews && displayReviews.length > 0 ? (
						displayReviews.map((review) => (
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
								{/* Opcional: mostrar fecha y usuario */}
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

					{/* Botón para agregar review */}
					{isAuthenticated && (
						<div className='productPopup__reviews--addButton'>
							<button
								onClick={() => setShowCreateReviewPopup(true)}
								className='productPopup__reviews--addReviewBtn'
							>
								Write a Review
							</button>
						</div>
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

			{/* Popup para crear review */}
			{showCreateReviewPopup && (
				<CreateReviewPopup 
					productId={selectedProduct.id} 
					token={userToken}
					onClose={handleCloseReviewPopup}
					onReviewCreated={handleReviewCreated}
				/>
			)}
		</>
	);
};

export { ProductPopup };