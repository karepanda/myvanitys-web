import { FiChevronDown } from 'react-icons/fi';
import './SortControl.css';

const SortControl = ({ value, onChange }) => (
	<label className='sortControl'>
		<span className='sortControl__label'>Sort</span>
		<select
			className='sortControl__select'
			value={value}
			onChange={(event) => onChange(event.target.value)}
			aria-label='Sort products'
		>
			<option value='default'>Default</option>
			<option value='name'>Name A–Z</option>
			<option value='brand'>Brand A–Z</option>
			<option value='rating'>Rating: High to Low</option>
		</select>
		<FiChevronDown aria-hidden='true' />
	</label>
);

export { SortControl };
