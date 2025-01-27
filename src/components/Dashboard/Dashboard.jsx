import React, { useContext } from 'react';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import './Dashboard.css';
import { Modal } from '../Modal/Modal';
import { ProductPopup } from '../ProductPopup/ProductPopup';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';

const Dashboard = () => {
	const {
		apiResponse,
		searchText,
		showProductPopup,
		showUserProfile,
		showNotification,
	} = useContext(VanitysContext);

	// hacer fetch a la api y obtener los productos nuevamente

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

			{showProductPopup && (
				<Modal>
					<ProductPopup />
				</Modal>
			)}

			{showUserProfile && (
				<Modal>
					<UserProfile />
				</Modal>
			)}

			{showNotification && (
				<Notification
					description={'Product has been added to your Vanity'}
					highlight={'Vanity'}
				/>
			)}
		</div>
	);
};

export { Dashboard };
