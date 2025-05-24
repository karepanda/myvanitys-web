// src/components/Navbar/Navbar.jsx
import React, { useContext } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { VanitysContext } from '../../context';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const {
		showModalRegister,
		toggleModalRegister,
		toggleModalLogin,
		showModalLogin,
		apiResponse,
		authInitialized, // 🔥 NUEVO: Para controlar el renderizado
		showCreateProductPopup,
		toggleCreateProductPopup,
		searchText,
		handleSearch,
		setApiResponse,
		toggleUserProfile,
		showCookieBanner,
		logout, // 🔥 NUEVO: Función logout del context
	} = useContext(VanitysContext);

	const navigate = useNavigate();

	const handleHomeClick = () => {
		setApiResponse(null);
		navigate('/');
	};

	// 🔥 NUEVA FUNCIÓN: Logout mejorado
	const handleLogout = () => {
		logout(); // Usa la función del context que limpia todo
		// No necesitamos navigate('/') porque logout ya redirige
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

	// 🔥 LÓGICA MEJORADA: Determinar qué mostrar basado en authInitialized
	const isAuthenticated = authInitialized && apiResponse?.token;
	const showLoginButtons = authInitialized && !apiResponse?.token;

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
						placeholder={isAuthenticated ? 'Products' : 'Search...'} // 🔥 MEJORADO
						value={searchText}
						onChange={handleSearch}
						disabled={showCookieBanner}
					/>
					{showCookieBanner && (
						<span className='tooltip'>Accept cookies to search</span>
					)}
				</div>

				{/* 🔥 CAMBIO PRINCIPAL: Usar showLoginButtons en lugar de !apiResponse */}
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

				{/* 🔥 NUEVO: Mostrar loading mientras se inicializa */}
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

				{/* 🔥 CAMBIO: Usar isAuthenticated en lugar de apiResponse */}
				{isAuthenticated && (
					<>
						<p className='header__products'>Products</p>
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
								{/* 🔥 COMPLETAR: Agregar los paths del SVG */}
								<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
							</svg>
							{showCookieBanner && (
								<span className='tooltip'>
									Accept cookies to open profile
								</span>
							)}
						</div>

						{/* 🔥 NUEVO: Botón de logout */}
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