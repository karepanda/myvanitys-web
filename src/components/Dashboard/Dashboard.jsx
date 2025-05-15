import React, { useContext, useEffect, useState } from 'react';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import './Dashboard.css';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';

const Dashboard = () => {
	const { 
		apiResponse, 
		searchText, 
		showUserProfile, 
		showNotification,
		findProductsByUserId,
		loading,
		errorHandler
	} = useContext(VanitysContext);

	// Local status for products
	const [products, setProducts] = useState([]);
	// Status to control the initial load
	const [initialLoading, setInitialLoading] = useState(true);

	// Obtain the products when the component is assembled
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				// Check if we have a token and a user ID
				if (apiResponse?.token && apiResponse?.user?.id) {
					// Use the context function to get the user's products
					const userProducts = await findProductsByUserId(
						apiResponse.token,
						apiResponse.user.id
					);

					if (userProducts) {
						setProducts(userProducts);
					} else {
						// If there are no products, set an empty array
						setProducts([]);
					}
				} else {
					// If there is no token or user ID, we cannot obtain products.
					console.warn('No token or user ID available to fetch products');
					setProducts([]);
				}
			} catch (error) {
				console.error('Error fetching user products:', error);
				errorHandler.showGenericError();
				setProducts([]);
			} finally {
				setInitialLoading(false);
			}
		};

		fetchProducts();
	}, [apiResponse, findProductsByUserId, errorHandler]);

	// Use local state products instead of apiResponse.products
	const productId = products[0]?.reviews?.[0]?.productId || null;

	// Filter products based on search text
	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchText.toLowerCase())
	);

	// Determine the style class based on the number of products
	const getStyleClass = () => {
		return products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
	};

	// Show a loading status if we are obtaining products
	if (initialLoading || loading) {
		return <div className="dashboard__loading">Loading your products...</div>;
	}

	return (
		<div className={getStyleClass()}>
			{products.length === 0 ? (
				<NoProductCard />
			) : searchText && filteredProducts.length === 0 ? (
				<p>Products not found</p>
			) : (
				<>
					<div className='dashboard__categories'>
						<Categories />
					</div>
					{searchText ? (
						<div className='productCard__wrapper'>
							{filteredProducts.map((product) => (
								<SearchedProductCard 
									key={product.id || `product-${Math.random()}`} 
									product={product} 
								/>
							))}
						</div>
					) : (
						<div className='productCard__wrapper'>
							{products.map((product) => (
								<ProductCard
									key={product.id || `product-${Math.random()}`}
									product={product}
									id={productId}
								/>
							))}
						</div>
					)}
				</>
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