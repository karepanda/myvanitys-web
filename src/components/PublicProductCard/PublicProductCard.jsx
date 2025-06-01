// src/components/PublicProductCard/PublicProductCard.jsx
import React, { useContext, useState } from 'react';
import { VanitysContext } from '../../context/index';
import './PublicProductCard.css';

const PublicProductCard = ({ product }) => {
	const {
		apiResponse,
		errorHandler,
		showNotificationTemporarily, // 🔥 CORRECTO: Esta es la función real del contexto
		addExistingProductToVanity // 🔥 USAR: Función del contexto para añadir productos
	} = useContext(VanitysContext);

	const [isAdding, setIsAdding] = useState(false);

	// Handle adding existing product to user's vanity
	const handleAddToVanity = async () => {
		const token = apiResponse?.token;
		
		if (!token) {
			errorHandler.showErrorMessage(
				'You are not authenticated. Please log in to continue.',
				'Authentication error',
				'error'
			);
			return;
		}

		setIsAdding(true);

		try {
			console.log(`Adding product ${product.name} to vanity...`);
			
			// 🔥 USAR LA FUNCIÓN CORRECTA: addExistingProductToVanity del contexto
			const success = await addExistingProductToVanity(token, product);
			
			if (success) {
				console.log(`✅ Product ${product.name} added to vanity successfully`);
				// La notificación y refresh ya se manejan dentro de la función del contexto
			} else {
				throw new Error('Failed to add product to vanity');
			}
			
		} catch (error) {
			console.error('Error adding product to vanity:', error);
			errorHandler.showGenericError();
		} finally {
			setIsAdding(false);
		}
	};

	// Calculate the average rating (if any reviews)
	const stars = product.reviews && product.reviews.length > 0 
		? product.reviews[0].stars 
		: 0;

	return (
		<div className='publicProductCard'>
			<div className='publicProductCard__left'>
				<h1 className='publicProductCard__left--name'>{product.name}</h1>
				<p className='publicProductCard__left--brand'>{product.brand}</p>
				<p className='publicProductCard__left--color'>Color</p>
				<div
					className='publicProductCard__left--circle'
					style={{ backgroundColor: product.color || product.colorHex || '#D9D9D9' }}
				></div>
				<div className='publicProductCard__left--rating'>
					{Array(5)
						.fill(0)
						.map((_, index) => (
							<span
								key={index}
								className={
									index < stars
										? 'publicProductCard__left--star filled'
										: 'publicProductCard__left--star empty'
								}
							>
								★
							</span>
						))}
				</div>
			</div>
			
			<div className='publicProductCard__right'>
				<button
					className={`add-to-vanity-button ${isAdding ? 'adding' : ''}`}
					onClick={handleAddToVanity}
					disabled={isAdding}
					title="Add to your vanity"
				>
					{isAdding ? (
						'Adding...'
					) : (
						'Add to Vanity'
					)}
				</button>
			</div>
		</div>
	);
};

export { PublicProductCard };