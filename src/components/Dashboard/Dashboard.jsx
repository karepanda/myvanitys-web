import { Categories } from '../Categories/Categories';
import React, { useContext } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';

import { VanitysContext } from '../../context/index';
import './Dashboard.css';

const Dashboard = () => {
	const { apiResponse } = useContext(VanitysContext);

	const products = apiResponse?.products || [];

	const getStyleClass = () => {
		return apiResponse.products.length === 0
			? 'dashboard__noProducts'
			: 'dashboard';
	};

	return (
		<div className={getStyleClass()}>
			{apiResponse.products.length === 0 ? (
				<NoProductCard />
			) : (
				<>
					<div className='dashboard__categories'>
						<Categories />
					</div>
					<div className='dashboard__products'>
						{products.map((product, index) => (
							<ProductCard key={index} product={product} />
						))}
					</div>
				</>
			)}
		</div>
	);
};

export { Dashboard };
