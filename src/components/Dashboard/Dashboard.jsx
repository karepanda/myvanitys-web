import React, { useContext } from 'react';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import './Dashboard.css';

const Dashboard = () => {
	const { apiResponse, searchText } = useContext(VanitysContext);

	const products = apiResponse?.products || [];

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchText.toLowerCase())
	);

	const getStyleClass = () => {
		return products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
	};

	return (
		<div className={getStyleClass()}>
			{products.length === 0 ? (
				<NoProductCard />
			) : searchText && filteredProducts.length === 0 ? (
				<p>No products found</p>
			) : (
				<>
					<div className='dashboard__categories'>
						<Categories />
					</div>
					{searchText ? (
						<div className='productCard__wrapper'>
							{filteredProducts.map((product, index) => (
								<SearchedProductCard key={index} product={product} />
							))}
						</div>
					) : (
						<div className='productCard__wrapper'>
							{products.map((product, index) => (
								<ProductCard key={index} product={product} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export { Dashboard };
