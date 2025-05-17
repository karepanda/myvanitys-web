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
		showCreateProductPopup,
		toggleCreateProductPopup,
		searchText,
		handleSearch,
		setApiResponse,
		toggleUserProfile,
		showCookieBanner, // 👈 usamos esto
	} = useContext(VanitysContext);

	const navigate = useNavigate();

	const handleHomeClick = () => {
		setApiResponse(null);
		navigate('/');
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

	return (
		<>
			<header className={apiResponse ? 'header-dashboard' : 'header'}>
				<h1 className='header__title' onClick={handleHomeClick}>
					My Vanity´s
				</h1>

				<div className='tooltip-wrapper'>
					<input
						className={`header__input ${
							showCookieBanner ? 'disabled' : ''
						}`}
						type='text'
						placeholder={apiResponse && 'Products'}
						value={searchText}
						onChange={handleSearch}
						disabled={showCookieBanner}
					/>
					{showCookieBanner && (
						<span className='tooltip'>Accept cookies to search</span>
					)}
				</div>

				{!apiResponse && (
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

				{apiResponse && (
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
								{/* SVG paths */}
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
