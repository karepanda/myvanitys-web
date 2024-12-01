import './ProductCard.css';

const ProductCard = ({ product }) => {
	const stars = product.reviews.length > 0 ? product.reviews[0].stars : 0;

	return (
		<div className='productCard'>
			<div className='productCard__left'>
				<h1 className='productCard__left--name'>{product.name}</h1>

				<p className='productCard__left--brand'>{product.brand}</p>
				<p className='productCard__left--color'>Color</p>
				<div
					className='productCard__left--circle'
					style={{ backgroundColor: product.color }}
				></div>
				<div className='productCard__left--rating'>
					{Array(5)
						.fill(0)
						.map((_, index) => (
							<span
								key={index}
								className={
									index < stars
										? 'productCard__left--star filled'
										: 'productCard__left--star empty'
								}
							>
								★
							</span>
						))}
				</div>
			</div>
			<div className='productCard__right'>
				<div className='productCard__right--edit'>
					<img src='src/assets/edit-icon.png' alt='Edit' />
				</div>
				<div className='productCard__right--rating'>
					<img src='src/assets/rating-icon.png' alt='Rating' />
				</div>
				<div className='productCard__right--delete'>
					<img src='src/assets/delete.icon.png' alt='Delete' />
				</div>
			</div>
		</div>
	);
};

export { ProductCard };
