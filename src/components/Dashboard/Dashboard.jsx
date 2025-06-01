// src/components/Dashboard/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { PublicProductCard } from '../PublicProductCard/PublicProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import { useFetchUserProducts, usePublicProducts } from '../../hooks';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';

import './Dashboard.css';

const Dashboard = () => {
	const { searchText, showUserProfile, showNotification } =
		useContext(VanitysContext);

	// Estado para modo del dashboard
	const [dashboardMode, setDashboardMode] = useState('my-vanity');
	const [searchParams, setSearchParams] = useSearchParams();

	// Hooks
	const {
		products: userProducts,
		error: userError,
		loading: userLoading,
	} = useFetchUserProducts();
	const {
		publicProducts,
		loading: publicLoading,
		error: publicError,
		hasLoaded: publicHasLoaded,
		loadPublicProducts,
	} = usePublicProducts();

	useEffect(() => {
		const modeFromUrl = searchParams.get('mode');
		if (modeFromUrl === 'add-products') {
			setDashboardMode('add-products');

			if (!publicHasLoaded && !publicLoading) {
				console.log(
					'🚀 Auto-loading public products for add-products mode...'
				);
				loadPublicProducts();
			}
		} else {
			setDashboardMode('my-vanity');
		}
	}, [searchParams, publicHasLoaded, publicLoading, loadPublicProducts]);

	const products =
		dashboardMode === 'my-vanity' ? userProducts : publicProducts;
	const error = dashboardMode === 'my-vanity' ? userError : publicError;
	const loading = dashboardMode === 'my-vanity' ? userLoading : publicLoading;

	console.log('🎯 Dashboard render:', {
		mode: dashboardMode,
		productsCount: products?.length || 0,
		loading,
		hasError: !!error,
		searchText,
		publicHasLoaded,
		userProductsCount: userProducts?.length || 0,
		publicProductsCount: publicProducts?.length || 0,
	});

	const productId = userProducts[0]?.reviews?.[0]?.productId || null;

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchText.toLowerCase())
	);

	const getStyleClass = () => {
		return products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
	};

	const handleModeChange = (newMode) => {
		setDashboardMode(newMode);
		if (newMode === 'add-products') {
			setSearchParams({ mode: 'add-products' });
			if (!publicHasLoaded && !publicLoading) {
				loadPublicProducts();
			}
		} else {
			setSearchParams({});
		}
	};

	if (loading) {
		const loadingMessage =
			dashboardMode === 'my-vanity'
				? 'Loading your products...'
				: 'Loading available products...';

		return (
			<div className='dashboard__loading'>
				<div className='loading-spinner'></div>
				<p>{loadingMessage}</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='dashboard__error'>
				<div className='error-icon'>⚠️</div>
				<h3>Error loading products</h3>
				<p>
					{error.message ||
						'Could not load your products. Please try again.'}
				</p>
				<button
					className='retry-button'
					onClick={() => window.location.reload()}
				>
					Try again
				</button>
			</div>
		);
	}

	return (
		<div className={getStyleClass()}>
			{/* Mode Selector */}
			<div className='dashboard__mode-selector'>
				<button
					className={`mode-button ${
						dashboardMode === 'my-vanity' ? 'active' : ''
					}`}
					onClick={() => handleModeChange('my-vanity')}
				>
					<span className='mode-icon'>💄</span>
					My Vanity ({userProducts.length})
				</button>
				<button
					className={`mode-button ${
						dashboardMode === 'add-products' ? 'active' : ''
					}`}
					onClick={() => handleModeChange('add-products')}
				>
					<span className='mode-icon'>➕</span>
					Add Products ({publicProducts.length})
				</button>
			</div>

			{/* Dynamic status bar */}
			{dashboardMode === 'add-products' && (
				<div className='dashboard__status-bar'>
					{publicLoading ? (
						<div className='dashboard__info-bar dashboard__info-bar--loading'>
							<div className='loading-spinner-small'></div>
							<p>Loading available products...</p>
						</div>
					) : !publicHasLoaded ? (
						<div className='dashboard__info-bar dashboard__info-bar--info'>
							<p>Products not loaded yet</p>
							<button
								onClick={loadPublicProducts}
								className='load-products-button'
							>
								Load Products Now
							</button>
						</div>
					) : publicProducts.length === 0 ? (
						<div className='dashboard__info-bar dashboard__info-bar--success'>
							<p>
								🎉 You already have all available products in your
								vanity!
							</p>
						</div>
					) : (
						<div className='dashboard__info-bar dashboard__info-bar--success'>
							<p>
								✨ Found {publicProducts.length} products you can add to
								your vanity
							</p>
						</div>
					)}
				</div>
			)}

			{/*  Empty product logic */}
			{products.length === 0 ? (
				dashboardMode === 'my-vanity' ? (
					<NoProductCard />
				) : (
					<div className='no-public-products'>
						{!publicHasLoaded ? (
							<>
								<h3>Products not loaded yet</h3>
								<p>
									Click "Load Products Now" above or use the "Products"
									button in the navbar
								</p>
							</>
						) : (
							<>
								<h3>No products available to add</h3>
								<p>You already have all available products! 🎉</p>
								<button
									className='switch-mode-button'
									onClick={() => handleModeChange('my-vanity')}
								>
									View My Vanity
								</button>
							</>
						)}
					</div>
				)
			) : searchText && filteredProducts.length === 0 ? (
				<div className='no-search-results'>
					<p>No products found for "{searchText}"</p>
					<p>Try a different search term</p>
				</div>
			) : (
				<>
					<div className='dashboard__categories'>
						<Categories />
					</div>

					{/*  Info bar for active mode */}
					<div className='dashboard__info-bar'>
						{dashboardMode === 'my-vanity' ? (
							<p>Showing your vanity collection</p>
						) : (
							<p>Showing products you can add to your vanity</p>
						)}
					</div>

					<div className='productCard__wrapper'>
						{(searchText ? filteredProducts : products).map((product) =>
							searchText ? (
								<SearchedProductCard
									key={product.id || `product-${Math.random()}`}
									product={product}
								/>
							) : dashboardMode === 'my-vanity' ? (
								<ProductCard
									key={product.id || `product-${Math.random()}`}
									product={product}
									id={productId}
								/>
							) : (
								<PublicProductCard
									key={product.id || `product-${Math.random()}`}
									product={product}
								/>
							)
						)}
					</div>
				</>
			)}

			{showUserProfile && (
				<Modal>
					<UserProfile />
				</Modal>
			)}

			{showNotification && (
				<Notification
					description='Product has been added to your Vanity'
					highlight='Vanity'
				/>
			)}
		</div>
	);
};

export { Dashboard };
