import React, { useState } from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { NavLink } from 'react-router-dom';
import { ModalRegister } from '../ModalRegister/ModalRegister';
import { useContext } from 'react';
import { VanitysContext } from '../../context';

const Navbar = () => {
	const { showModal, setShowModal } = useContext(VanitysContext);

	const toggleModal = () => setShowModal((prev) => !prev);

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
				<button className='header__right--login'>Log in</button>
				<button
					onClick={() => toggleModal()}
					className='header__right--register'
				>
					Register
				</button>
				{showModal && (
					<Modal>
						<ModalRegister />
					</Modal>
				)}
			</div>
		</header>
	);
};

export { Navbar };
