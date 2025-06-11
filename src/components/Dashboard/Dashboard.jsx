import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { PublicProductCard } from '../PublicProductCard/PublicProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import { useFetchUserProducts, usePublicProducts } from '../../hooks';
import { useProductSearch } from '../../hooks/useProductSearch';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';

import './Dashboard.css';

const Dashboard = () => {
	const { searchText, showUserProfile, showNotification } =
		useContext(VanitysContext);

	const [dashboardMode, setDashboardMode] = useState('my-vanity');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();

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

	const {
		searchResults,
		isSearching,
		searchError,
		hasSearched,
		lastSearchQuery,
		clearSearch,
	} = useProductSearch();

	useEffect(() => {
		const modeFromUrl = searchParams.get('mode');
		const newMode =
			modeFromUrl === 'search'
				? 'search'
				: modeFromUrl === 'add-products'
				? 'add-products'
				: 'my-vanity';

		if (newMode !== dashboardMode) {
			setSelectedCategory('');
		}

		if (modeFromUrl === 'search') {
			setDashboardMode('search');
		} else if (modeFromUrl === 'add-products') {
			setDashboardMode('add-products');

			if (!publicHasLoaded && !publicLoading) {
				loadPublicProducts();
			}
		} else {
			setDashboardMode('my-vanity');

			if (hasSearched) {
				clearSearch();
			}
		}
	}, [
		searchParams,
		dashboardMode,
		publicHasLoaded,
		publicLoading,
		loadPublicProducts,
		hasSearched,
		clearSearch,
	]);

	const getProducts = () => {
		switch (dashboardMode) {
			case 'search':
				return searchResults;
			case 'add-products':
				return publicProducts;
			case 'my-vanity':
			default:
				return userProducts;
		}
	};

	const getError = () => {
		switch (dashboardMode) {
			case 'search':
				return searchError;
			case 'add-products':
				return publicError;
			case 'my-vanity':
			default:
				return userError;
		}
	};

	const getLoading = () => {
		switch (dashboardMode) {
			case 'search':
				return isSearching;
			case 'add-products':
				return publicLoading;
			case 'my-vanity':
			default:
				return userLoading;
		}
	};

	const products = getProducts();
	const error = getError();
	const loading = getLoading();

	const productId = userProducts[0]?.reviews?.[0]?.productId || null;

	const filterBySearchText = (products) => {
		if (!searchText || dashboardMode === 'search') return products;
		return products.filter((product) =>
			product.name.toLowerCase().includes(searchText.toLowerCase())
		);
	};

	const filterByCategory = (products) => {
		if (!selectedCategory) return products;
		return products.filter(
			(product) =>
				product.category?.name?.toLowerCase() ===
				selectedCategory.toLowerCase()
		);
	};

	const filteredProducts = filterByCategory(filterBySearchText(products));

	const getStyleClass = () => {
		return products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
	};

	const handleModeChange = (newMode) => {
		setDashboardMode(newMode);
		setSelectedCategory('');
		if (newMode === 'add-products') {
			setSearchParams({ mode: 'add-products' });
			if (!publicHasLoaded && !publicLoading) {
				loadPublicProducts();
			}
		} else {
			setSearchParams({});
			if (hasSearched) {
				clearSearch();
			}
		}
	};

	const handleCategoryChange = (category) => {
		if (selectedCategory === category) {
			setSelectedCategory('');
		} else {
			setSelectedCategory(category);
		}
	};

	const getLoadingMessage = () => {
		switch (dashboardMode) {
			case 'search':
				return 'Searching products...';
			case 'add-products':
				return 'Loading available products...';
			case 'my-vanity':
			default:
				return 'Loading your products...';
		}
	};

	if (loading) {
		return (
			<div className='dashboard__loading'>
				<div className='loading-spinner'></div>
				<p>{getLoadingMessage()}</p>
			</div>
		);
	}

	if (error) {
		const errorMessage =
			dashboardMode === 'search'
				? `Search failed: ${error}`
				: error.message ||
				  'Could not load your products. Please try again.';

		return (
			<div className='dashboard__error'>
				<div className='error-icon'>⚠️</div>
				<h3>
					Error {dashboardMode === 'search' ? 'searching' : 'loading'}{' '}
					products
				</h3>
				<p>{errorMessage}</p>
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
			{dashboardMode === 'search' && (
				<div className='dashboard__search-status'>
					{isSearching ? (
						<div className='search-status search-status--loading'>
							<div className='loading-spinner-small'></div>
							<p>Searching products...</p>
						</div>
					) : !hasSearched ? (
						<div className='search-status search-status--info'>
							<p>Use the search bar to find products</p>
						</div>
					) : searchResults.length === 0 ? (
						<div className='search-status search-status--warning'>
							<p>No products found for "{lastSearchQuery}"</p>
						</div>
					) : (
						<div className='search-status search-status--success'>
							<p>
								✨ Found {searchResults.length} products for "
								{lastSearchQuery}"
							</p>
						</div>
					)}
				</div>
			)}

			{products.length === 0 ? (
				dashboardMode === 'search' ? (
					<div className='no-search-results'>
						{!hasSearched ? (
							<>
								<h3>Ready to search</h3>
								<p>Use the search bar above to find products</p>
							</>
						) : (
							<>
								<h3>No products found</h3>
								<p>No products found for "{lastSearchQuery}"</p>
								<p>Try a different search term</p>
							</>
						)}
					</div>
				) : dashboardMode === 'my-vanity' ? (
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
							<div className='dashboard__noProduct'>
								<h3 className='dashboard__noProducts--title'>
									No products available to add
								</h3>
								<p className='dashboard__noProduct--phrase'>
									You already have all available products!
								</p>
								<button
									className='dashboard__noProduct--button'
									onClick={() => handleModeChange('my-vanity')}
								>
									View My Vanity
								</button>
							</div>
						)}
					</div>
				)
			) : (
				<>
					<div className='dashboard__categories'>
						<Categories
							selectedCategory={selectedCategory}
							onCategoryChange={handleCategoryChange}
						/>
					</div>

					{filteredProducts.length === 0 ? (
						<div className='no-search-results'>
							{selectedCategory && searchText ? (
								<>
									<h3>No products found</h3>
									<p>
										No products found for "{searchText}" in category "
										{selectedCategory}"
									</p>
									<p>Try a different search term or category</p>
								</>
							) : selectedCategory ? (
								<>
									<h3>No products in this category</h3>
									<p>
										No products found in category "{selectedCategory}"
									</p>
									<p>Try selecting a different category</p>
								</>
							) : searchText ? (
								<>
									<h3>No products found</h3>
									<p>No products found for "{searchText}"</p>
									<p>Try a different search term</p>
								</>
							) : null}
						</div>
					) : (
						<div className='productCard__wrapper'>
							{filteredProducts.map((product) =>
								dashboardMode === 'search' ? (
									<SearchedProductCard
										key={product.id || `product-${Math.random()}`}
										product={product}
									/>
								) : (searchText && dashboardMode !== 'search') ||
								  selectedCategory ? (
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
					description='Product has been added to your Vanity'
					highlight='Vanity'
				/>
			)}
		</div>
	);
};

export { Dashboard };
