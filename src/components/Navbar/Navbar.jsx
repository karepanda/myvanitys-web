// src/components/Navbar/Navbar.jsx
import React, { useContext } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { VanitysContext } from '../../context';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';
import { useNavigate } from 'react-router-dom';
import { usePublicProducts } from '../../hooks/usePublicProducts';

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

	// 🔥 Hook con carga manual
	const { 
		publicProducts, 
		allProducts, 
		userProducts, 
		loading, 
		error,
		hasLoaded,
		loadPublicProducts // 🔥 Función para cargar datos
	} = usePublicProducts();

	const navigate = useNavigate();

	const handleHomeClick = () => {
		setApiResponse(null);
		navigate('/');
	};

	const handleLogout = () => {
		logout(); 
	};

	// MAIN FUNCTION: Load products by clicking AND browsing
	const handleProductsClick = async () => {
		if (showCookieBanner) return;
		
		console.log('🔄 === MANUAL LOAD PRODUCTS TEST ===');
		
		if (loading) {
			console.log('⏳ Already loading...');
			return;
		}

		navigate('/dashboard?mode=add-products');

		if (hasLoaded) {
			console.log('📊 SHOWING ALREADY LOADED DATA:');
			console.log('- All products count:', allProducts?.length || 0);
			console.log('- User products count:', userProducts?.length || 0);
			console.log('- Available products count:', publicProducts?.length || 0);
			console.log('📋 All products:', allProducts);
			console.log('👤 User products:', userProducts);
			console.log('➕ Available to add:', publicProducts);
			
			// If you want to reload automatically (commented for now)
			// console.log('🔄 Want to reload? Clearing and reloading...');
			// clearData();
			// setTimeout(async () => {
			// 	const success = await loadPublicProducts();
			// 	console.log('🔄 Reload result:', success ? 'Success ✅' : 'Failed ❌');
			// }, 500);
			
		} else {
			console.log('🚀 LOADING PRODUCTS FOR FIRST TIME...');
			const success = await loadPublicProducts();
			
			if (success) {
				console.log('✅ LOAD COMPLETED SUCCESSFULLY!');
				console.log('📊 FINAL RESULTS:');
				console.log('- Total products in system:', allProducts?.length || 0);
				console.log('- Products user already has:', userProducts?.length || 0);
				console.log('- Products available to add:', publicProducts?.length || 0);
				
				if (publicProducts?.length > 0) {
					console.log('🎯 USER CAN ADD THESE PRODUCTS:');
					publicProducts.forEach((product, index) => {
						console.log(`  ${index + 1}. ${product.name} by ${product.brand}`);
					});
				} else {
					console.log('🎉 User already has all available products!');
				}
			} else {
				console.error('❌ LOAD FAILED');
				console.error('Error details:', error);
			}
		}
		
		console.log('🏁 === END MANUAL LOAD TEST ===');
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

	// 🔥 Determine what to display based on authInitialized
	const isAuthenticated = authInitialized && apiResponse?.token;
	const showLoginButtons = authInitialized && !apiResponse?.token;

	// 🔥 Texto dinámico del botón (sin cambiar estilos)
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

	return (
		<>
			<header className={isAuthenticated ? 'header-dashboard' : 'header'}>
				<h1 className='header__title' onClick={handleHomeClick}>
					My Vanity´s
				</h1>

				<div className='tooltip-wrapper'>
					<input
						className={`header__input ${
							showCookieBanner ? 'disabled' : ''
						}`}
						type='text'
						placeholder={isAuthenticated ? 'Products' : 'Search...'}
						value={searchText}
						onChange={handleSearch}
						disabled={showCookieBanner}
					/>
					{showCookieBanner && (
						<span className='tooltip'>Accept cookies to search</span>
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
					<div className="auth-loading">
						<span className="loading-text">Loading...</span>
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
						{/* 🔥 Products - AHORA CLICKEABLE usando tu CSS existente */}
						<div className='tooltip-wrapper'>
							<p 
								className={`header__products ${showCookieBanner ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
								onClick={handleProductsClick}
								style={{
									cursor: showCookieBanner || loading ? 'not-allowed' : 'pointer',
								}}
							>
								{getProductsButtonText()}
							</p>
							{showCookieBanner && (
								<span className='tooltip'>Accept cookies to load products</span>
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
								<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
							</svg>
							{showCookieBanner && (
								<span className='tooltip'>
									Accept cookies to open profile
								</span>
							)}
						</div>
						
						{renderButtonWithTooltip(
							'Logout',
							handleLogout,
							'header__logout'
						)}
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