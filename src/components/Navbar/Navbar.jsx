import React, { useState } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { useContext } from 'react';
import { VanitysContext } from '../../context';

const Navbar = () => {
	const {
		showModalRegister,
		toggleModalRegister,
		toggleModalLogin,
		showModalLogin,
		apiResponse,
	} = useContext(VanitysContext);

	return (
		<>
			<header className='header'>
				<div className='header__left'>
					<h1 className='header__left--title'>My Vanity´s</h1>
				</div>
				<div className='header__right'>
					<input
						className='header__right--input'
						type='text'
						placeholder={apiResponse && 'Products'}
					/>
					<div className='header__right'>
						{!apiResponse && (
							<>
								<button
									onClick={() => toggleModalLogin()}
									className='header__right--login'
								>
									Log in
								</button>

								<button
									className='header__right--register'
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
								<button
									onClick={() => toggleModalRegister()}
									className='header__right--create'
								>
									Create Product
								</button>

								<div>
									<img
										src='src/assets/user_photo.png'
										alt='User Photo'
									/>
								</div>
							</>
						)}
					</div>
				</div>
			</header>
		</>
	);
};

export { Navbar };
