import { Categories } from '../Categories/Categories';
import React, { useContext } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';

import { VanitysContext } from '../../context/index';
import './Dashboard.css';

const Dashboard = () => {
	const { apiResponse } = useContext(VanitysContext);

	return (
		<>
			{apiResponse.products.length === 0 ? (
				<div className='dashboard__noProducts'>
					<NoProductCard />
				</div>
			) : (
				<div className='dashboard'>
					<div className='dashboard__productCard'>
						{apiResponse.products.length === 0 ? (
							<NoProductCard />
						) : (
							<>
								<div className='dashboard__categories'>
									<Categories />
								</div>
								{apiResponse.products.map((product, index) => (
									<ProductCard key={index} product={product} />
								))}
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export { Dashboard };
