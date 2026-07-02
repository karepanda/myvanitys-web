import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiMoreHorizontal, FiPlus, FiStar, FiTrash2, FiEdit3 } from 'react-icons/fi';
import {
	getCategoryLabel,
	getCategoryName,
	getSafeHexColor,
} from '../../utils/dashboardProducts';
import './ProductCard.css';

const categoryClass = (category) =>
	String(category || 'other').toLowerCase().replace(/[^a-z0-9]+/g, '-');

const ProductCard = ({
	product,
	variant,
	onOpen,
	onAdd,
	onReview,
	onDelete,
	isAdding = false,
}) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	const category = getCategoryName(product);
	const color = getSafeHexColor(product?.colorHex);
	const rating = Number(product?.averageRating || 0);
	const reviewCount = Array.isArray(product?.reviews) ? product.reviews.length : null;
	const isCollected = Boolean(product?.inUserCollection);

	useEffect(() => {
		if (!menuOpen) return undefined;
		const close = (event) => {
			if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
		};
		document.addEventListener('pointerdown', close);
		return () => document.removeEventListener('pointerdown', close);
	}, [menuOpen]);

	return (
		<article
			className={`productCard productCard--${variant} productCard--${categoryClass(category)}`}
		>
			<button
				type='button'
				className='productCard__content'
				onClick={() => onOpen(product)}
				aria-label={`Open details for ${product?.name || 'product'}`}
			>
				<div className='productCard__details'>
					{category && <span className='productCard__category'>{getCategoryLabel(category)}</span>}
					<p className='productCard__brand'>{product?.brand}</p>
					<h2 className='productCard__name'>{product?.name}</h2>
					<div className='productCard__rating' aria-label={`${rating.toFixed(1)} out of 5 stars`}>
						<FiStar aria-hidden='true' />
						<strong>{rating.toFixed(1)}</strong>
						{reviewCount !== null && (
							<span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
						)}
					</div>
				</div>
				<div className='productCard__swatch'>
					<svg viewBox='0 0 64 64' role='img' aria-label={`Color ${color}`}>
						<circle cx='32' cy='32' r='29' fill={color} />
					</svg>
					<code>{color}</code>
				</div>
			</button>

			{variant === 'collection' ? (
				<div className='productCard__menu' ref={menuRef}>
					<button
						type='button'
						className='productCard__menuTrigger'
						onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }}
						aria-label={`Actions for ${product?.name}`}
						aria-expanded={menuOpen}
					>
						<FiMoreHorizontal aria-hidden='true' />
					</button>
					{menuOpen && (
						<div className='productCard__menuPanel'>
							<button type='button' onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onReview(product); }}>
								<FiEdit3 aria-hidden='true' /> Write review
							</button>
							<button type='button' className='productCard__delete' onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onDelete(product); }}>
								<FiTrash2 aria-hidden='true' /> Delete
							</button>
						</div>
					)}
				</div>
			) : (
				<button
					type='button'
					className={`productCard__add${isCollected ? ' productCard__add--collected' : ''}`}
					onClick={(event) => { event.stopPropagation(); if (!isCollected) onAdd(product); }}
					disabled={isCollected || isAdding}
				>
					{isCollected ? <FiCheck aria-hidden='true' /> : <FiPlus aria-hidden='true' />}
					{isCollected ? 'Already in your vanity' : isAdding ? 'Adding…' : 'Add to My Vanity'}
				</button>
			)}
		</article>
	);
};

export { ProductCard };
