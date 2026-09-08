import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './NoProductCard.css';
import { VanitysContext } from '../../context/index';
import createProduct from '../../assets/CreateProduct.optimized.png';

const NoProductCard = () => {
	const { t } = useTranslation('products');
	const { toggleCreateProductPopup } = useContext(VanitysContext);

	return (
		<div className='noProductCard'>
			<img
				className='noProductCard__image'
				src={createProduct}
				alt={t('emptyCard.imageAlt')}
				width='900'
				height='900'
				loading='lazy'
				decoding='async'
			/>
			<div className='noProductCard__text'>
				<p className='noProductCard__text--regular'>
					{t('emptyCard.noProducts')}
				</p>
				<p className='noProductCard__text--bold'>
					{t('emptyCard.encouragement')}
				</p>
			</div>
			<button
				onClick={() => toggleCreateProductPopup()}
				className='noProductCard__button'
			>
				{t('emptyCard.create')}
			</button>
		</div>
	);
};

export { NoProductCard };
