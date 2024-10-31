import React, { useState } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { NavLink } from 'react-router-dom';
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
	} = useContext(VanitysContext);

	return (
		<header className='header'>
			<div className='header__left'>
				<h1 className='header__left--title'>My Vanity´s</h1>
				<input className='header__left--input' type='search' />
			</div>
			<div className='header__center'>
				<ul className='header__center--list'>
					<li>
						<NavLink
							to='/'
							className={({ isActive }) =>
								isActive
									? 'text-orange font-semibold'
									: 'text-black font-thin'
							}
						>
							Home
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/products'
							className={({ isActive }) =>
								isActive
									? 'text-orange font-semibold'
									: 'text-black font-thin'
							}
						>
							Products
						</NavLink>
					</li>
				</ul>
			</div>
			<div className='header__right'>
				<button
					onClick={() => toggleModalLogin()}
					className='header__right--login'
				>
					Log in
				</button>
				{showModalLogin && (
					<Modal>
						<Login />
					</Modal>
				)}
				<button
					onClick={() => toggleModalRegister()}
					className='header__right--register'
				>
					Register
				</button>
				{showModalRegister && (
					<Modal>
						<Register />
					</Modal>
				)}
			</div>
		</header>
	);
};

export { Navbar };
