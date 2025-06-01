// src/components/Navbar/Navbar.jsx
import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { VanitysContext } from '../../context';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';
import { useNavigate } from 'react-router-dom';
import { usePublicProducts } from '../../hooks/usePublicProducts';
import { useProductSearch } from '../../hooks/useProductSearch';
import searchIcon from '../../assets/icon _search.png';

const Navbar = () => {
	const {
		showModalRegister,
		toggleModalRegister,
		toggleModalLogin,
		showModalLogin,
		apiResponse,
		authInitialized,
		showCreateProductPopup,
		toggleCreateProductPopup,
		searchText,
		handleSearch,
		setApiResponse,
		toggleUserProfile,
		showCookieBanner,
		logout,
	} = useContext(VanitysContext);

	const {
		publicProducts,
		allProducts,
		userProducts,
		loading,
		error,
		hasLoaded,
		loadPublicProducts,
	} = usePublicProducts();

	const { searchProducts, isSearching } = useProductSearch();
	
	const [isSearchMode, setIsSearchMode] = useState(false);

	const navigate = useNavigate();

	const goToMyVanity = () => {
		setIsSearchMode(false);
		navigate('/dashboard');
	};

	const handleLogout = () => {
		logout();
		setIsSearchMode(false);
	};

	// Función para ejecutar búsqueda
	const handleSearchSubmit = async () => {
		if (showCookieBanner || !searchText.trim()) return;
		
		if (searchText.trim().length < 2) {
			console.warn('Search query must be at least 2 characters long');
			return;
		}

		console.log('🔍 === SEARCH EXECUTION ===');
		console.log(`Search query: "${searchText}"`);
		
		if (isSearching) {
			console.log('⏳ Search already in progress...');
			return;
		}

		// Navigate to dashboard in search mode
		navigate('/dashboard?mode=search');
		setIsSearchMode(true);

		// Execute search
		const success = await searchProducts(searchText);
		
		if (success) {
			console.log('✅ Search completed successfully');
		} else {
			console.error('❌ Search failed');
		}
		
		console.log('🏁 === END SEARCH ===');
	};

	const handleSearchKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSearchSubmit();
		}
	};

	const handleProductsClick = async () => {
		if (showCookieBanner) return;

		if (loading) {
			return;
		}

		setIsSearchMode(false);
		navigate('/dashboard?mode=add-products');
	};

	const renderButtonWithTooltip = (label, onClick, className) => (
		<div className='tooltip-wrapper'>
			<button
				className={`${className} ${showCookieBanner ? 'disabled' : ''}`}
				onClick={onClick}
				disabled={showCookieBanner}
			>
				{label}
			</button>
			{showCookieBanner && (
				<span className='tooltip'>Accept cookies to use this</span>
			)}
		</div>
	);

	const isAuthenticated = authInitialized && apiResponse?.token;
	const showLoginButtons = authInitialized && !apiResponse?.token;

	const getProductsButtonText = () => {
		if (loading) {
			return 'Loading...';
		} else if (error) {
			return 'Products (Error)';
		} else if (hasLoaded) {
			return `Products (${publicProducts?.length || 0})`;
		} else {
			return 'Products';
		}
	};

	const getSearchPlaceholder = () => {
		if (!isAuthenticated) return 'Search...';
		return isSearching ? 'Searching...' : 'Search products...';
	};

	return (
		<>
			<header className={isAuthenticated ? 'header-dashboard' : 'header'}>
				<h1 className='header__title' onClick={goToMyVanity}>
					My Vanity´s
				</h1>
				<div className='search-input-container'>
					<div className='tooltip-wrapper'>
						<input
							className={`header__input ${
								showCookieBanner ? 'disabled' : ''
							} ${isSearching ? 'searching' : ''}`}
							type='text'
							placeholder={getSearchPlaceholder()}
							value={searchText}
							onChange={handleSearch}
							onKeyDown={handleSearchKeyDown}
							disabled={showCookieBanner || isSearching}
						/>
						{showCookieBanner && (
							<span className='tooltip'>Accept cookies to search</span>
						)}
					</div>
					{isAuthenticated && !isSearching && (
						<img
							src={searchIcon}
							alt="Search"
							className={`search-icon ${
								showCookieBanner || !searchText.trim() || searchText.trim().length < 2
									? 'disabled' 
									: ''
							}`}
							onClick={handleSearchSubmit}
							title="Search products"
						/>
					)}
					
					{isAuthenticated && isSearching && (
						<div className="search-loading-indicator">⟳</div>
					)}
				</div>

				{showLoginButtons && (
					<>
						{renderButtonWithTooltip(
							'Log in',
							toggleModalLogin,
							'header__login'
						)}
						{renderButtonWithTooltip(
							'Register',
							toggleModalRegister,
							'header__register'
						)}
					</>
				)}

				{!authInitialized && (
					<div className='auth-loading'>
						<span className='loading-text'>Loading...</span>
					</div>
				)}

				{showModalLogin && (
					<Modal>
						<Login />
					</Modal>
				)}

				{showModalRegister && (
					<Modal>
						<Register />
					</Modal>
				)}
				
				{isAuthenticated && (
					<>
						<div className='tooltip-wrapper'>
							<p
								className={`header__products ${
									showCookieBanner ? 'disabled' : ''
								} ${loading ? 'loading' : ''}`}
								onClick={handleProductsClick}
								style={{
									cursor:
										showCookieBanner || loading
											? 'not-allowed'
											: 'pointer',
								}}
							>
								{getProductsButtonText()}
							</p>
							{showCookieBanner && (
								<span className='tooltip'>
									Accept cookies to load products
								</span>
							)}
						</div>

						{renderButtonWithTooltip(
							'Create Product',
							toggleCreateProductPopup,
							'header__create'
						)}

						<div className='tooltip-wrapper'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='46'
								height='46'
								viewBox='0 0 24 24'
								onClick={() => !showCookieBanner && toggleUserProfile()}
								className={`header__icon ${
									showCookieBanner ? 'disabled-icon' : ''
								}`}
								style={{
									cursor: showCookieBanner ? 'not-allowed' : 'pointer',
								}}
							>
								<path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
							</svg>
							{showCookieBanner && (
								<span className='tooltip'>
									Accept cookies to open profile
								</span>
							)}
						</div>
					</>
				)}

				{showCreateProductPopup && (
					<Modal>
						<CreateProductPopup />
					</Modal>
				)}
			</header>
		</>
	);
};

export { Navbar };