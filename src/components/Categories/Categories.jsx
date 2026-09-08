import { getCategoryLabel } from '../../utils/dashboardProducts';
import { useTranslation } from 'react-i18next';
import './Categories.css';

const Categories = ({ categories, selected, onSelect }) => {
	const { t } = useTranslation('products');

	return (
		<div className='categories' aria-label={t('categories.ariaLabel')}>
			{categories.map((category) => (
				<button
					key={category}
					type='button'
					className={`categories__chip${selected === category ? ' categories__chip--active' : ''}`}
					onClick={() => onSelect(category)}
					aria-pressed={selected === category}
				>
					{getCategoryLabel(category)}
				</button>
			))}
		</div>
	);
};

export { Categories };
