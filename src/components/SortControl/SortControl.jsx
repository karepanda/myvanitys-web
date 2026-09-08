import { FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './SortControl.css';

const SortControl = ({ value, onChange }) => {
	const { t } = useTranslation('products');

	return (
		<label className='sortControl'>
			<span className='sortControl__label'>{t('sort.label')}</span>
			<select
				className='sortControl__select'
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-label={t('sort.ariaLabel')}
			>
				<option value='default'>{t('sort.default')}</option>
				<option value='name'>{t('sort.name')}</option>
				<option value='brand'>{t('sort.brand')}</option>
				<option value='rating'>{t('sort.rating')}</option>
			</select>
			<FiChevronDown aria-hidden='true' />
		</label>
	);
};

export { SortControl };
