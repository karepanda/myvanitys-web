import React from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { useContext } from 'react';
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
	} = useContext(VanitysContext);

	const getStyleClass = () => {
		return apiResponse ? 'header-dashboard' : 'header';
	};

	const navigate = useNavigate();

	const handleHomeClick = () => {
		setApiResponse(null);
		navigate('/');
	};

	return (
		<>
			<header className={getStyleClass()}>
				<h1 className='header__title' onClick={handleHomeClick}>
					My Vanity´s
				</h1>
				<input
					className='header__input'
					type='text'
					placeholder={apiResponse && 'Products'}
					value={searchText}
					onChange={handleSearch}
				/>

				{!apiResponse && (
					<>
						<button
							onClick={() => toggleModalLogin()}
							className='header__login'
						>
							Log in
						</button>

						<button
							className='header__register'
							onClick={() => toggleModalRegister()}
						>
							Register
						</button>
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
						<button
							onClick={() => toggleCreateProductPopup()}
							className='header__create'
						>
							Create Product
						</button>

						<div>
							<img src='src/assets/user_photo.png' alt='User Photo' />
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
