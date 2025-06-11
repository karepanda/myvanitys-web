import React from 'react';
import './Categories.css';

const Categories = ({ selectedCategory, onCategoryChange }) => {
	const categories = [
		'Face',
		'Eyes',
		'Eyelash',
		'Brows',
		'Lips',
		'Cream',
		'Serum',
		'Toner',
	];

	return (
		<div className='categories'>
			<ul className='categories__list'>
				{categories.map((category) => (
					<li
						key={category}
						className={
							selectedCategory === category
								? 'categories__item--active'
								: 'categories__item'
						}
						onClick={() => onCategoryChange(category)}
					>
						{category}
					</li>
				))}
			</ul>
		</div>
	);
};

export { Categories };
