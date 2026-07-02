import { getCategoryLabel } from '../../utils/dashboardProducts';
import './Categories.css';

const Categories = ({ categories, selected, onSelect }) => (
	<div className='categories' aria-label='Product categories'>
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

export { Categories };
