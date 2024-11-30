import { Categories } from '../Categories/Categories';
import React, { useContext } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { VanitysContext } from '../../context/index';
import './Dashboard.css';

const Dashboard = () => {
	const { apiResponse } = useContext(VanitysContext);

	return (
		<div className='dashboard'>
			<div className='dashboard__categories'>
				<Categories />
			</div>
			<div className='dashboard__productCard'>
				{apiResponse.products.map((product, index) => (
					<ProductCard key={index} product={product} />
				))}
			</div>
		</div>
	);
};

export { Dashboard };
