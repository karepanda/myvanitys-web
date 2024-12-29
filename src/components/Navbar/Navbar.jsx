import React, { useState } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { useContext } from 'react';
import { VanitysContext } from '../../context';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';

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
	} = useContext(VanitysContext);

	const getStyleClass = () => {
		return apiResponse ? 'header-dashboard' : 'header';
	};

	return (
		<>
			<header className={getStyleClass()}>
				<h1 className='header__title'>My Vanity´s</h1>
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
