import React, { useContext, useState } from 'react';
import './Navbar.css';
import './Navbar.responsive.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { VanitysContext } from '../../context';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePublicProducts } from '../../hooks/usePublicProducts';
import { useProductSearch } from '../../hooks/useProductSearch';
import searchIcon from '../../assets/icon _search.png';
import userPhoto from '../../assets/user_photo.png';
import menuHamburguer from '../../assets/menu-hamburguer.png';

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
		toggleUserProfile,
		showCookieBanner,
		logout,
		renderButtonWithTooltip,
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

	const location = useLocation();
	const isActive =
		location.pathname === '/dashboard' &&
		location.search.includes('mode=add-products');

	const navigate = useNavigate();

	const goToMyVanity = () => {
		setIsSearchMode(false);
		navigate('/dashboard');
	};

	const handleLogout = () => {
		logout();
		setIsSearchMode(false);
	};

	const handleSearchSubmit = async () => {
		if (showCookieBanner || !searchText.trim()) return;

		if (searchText.trim().length < 2) {
			return;
		}

		if (isSearching) {
			return;
		}

		navigate('/dashboard?mode=search');
		setIsSearchMode(true);

		const success = await searchProducts(searchText);
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

	const isAuthenticated = authInitialized && apiResponse?.token;
	const showLoginButtons = authInitialized && !apiResponse?.token;

	const getSearchPlaceholder = () => {
		if (!isAuthenticated) return 'Search...';
		return isSearching ? 'Searching...' : 'Search products...';
	};

	return (
		<>
			<header className={isAuthenticated ? 'header-dashboard' : 'header'}>
				<div className='header__menu'>
					<img
						className='header__menu--icon'
						src={menuHamburguer}
						alt='Menu'
					/>
				</div>

				<h1
					className='header__title'
					disabled={showCookieBanner || !isAuthenticated}
					onClick={isAuthenticated ? goToMyVanity : undefined}
				>
					My Vanity´s
				</h1>

				<div className='header__search'>
					<img className='header__search--icon' src={searchIcon} alt='' />
				</div>

				<div className='search-input-container'>
					<div className='header__tooltip-wrapper'>
						<input
							className={`header__input ${
								showCookieBanner ? 'disabled' : ''
							} ${isSearching ? 'searching' : ''}`}
							type='text'
							placeholder={getSearchPlaceholder()}
							value={searchText}
							onChange={handleSearch}
							onKeyDown={handleSearchKeyDown}
							disabled={showCookieBanner || !isAuthenticated}
						/>
						{showCookieBanner && (
							<span className='tooltip'>Accept cookies to search</span>
						)}
					</div>
					<img
						src={searchIcon}
						alt='Search'
						className={`search-icon ${
							showCookieBanner ||
							!searchText.trim() ||
							searchText.trim().length < 2
								? 'disabled'
								: ''
						}`}
						onClick={handleSearchSubmit}
						title='Search products'
					/>

					{isAuthenticated && isSearching && (
						<div className='search-loading-indicator'>⟳</div>
					)}
				</div>

				{showLoginButtons && (
					<>
						{renderButtonWithTooltip(
							'Log in',
							toggleModalLogin,
							'header__login',
							'header'
						)}
						{renderButtonWithTooltip(
							'Register',
							toggleModalRegister,
							'header__register',
							'header'
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
						<p
							className={`header__products ${isActive ? 'active' : ''}`}
							onClick={handleProductsClick}
						>
							Products
						</p>

						{showCookieBanner && (
							<span className='tooltip'>
								Accept cookies to load products
							</span>
						)}

						{renderButtonWithTooltip(
							'Create Product',
							toggleCreateProductPopup,
							'header__create',
							'header'
						)}

						<div className='tooltip-wrapper'>
							<img
								src={userPhoto}
								alt='User Photo'
								onClick={() => !showCookieBanner && toggleUserProfile()}
								style={{
									cursor: showCookieBanner ? 'not-allowed' : 'pointer',
								}}
							/>
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
