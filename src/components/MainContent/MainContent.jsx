import React, { useContext } from 'react';
import './MainContent.css';
import './MainContent.responsive.css';

import homeIllustration from '../../assets/home_illustration.png';
import createProduct from '../../assets/CreateProduct.png';
import { VanitysContext } from '../../context/index';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';

export const Main = () => {
	const {
		showUserProfile,
		apiResponse,
		authInitialized,
		toggleModalLogin,
		showCookieBanner,
		toggleModalRegister,
	} = useContext(VanitysContext);

	const showLoginButtons = authInitialized && !apiResponse?.token;
	const isAuthenticated = authInitialized && apiResponse?.token;

	return (
		<div className='main'>
			<section className='main__register'>
				<div className='main__register--text'>
					<h1 className='main__register--text-title'>
						Organize and manage
					</h1>
					<p className='main__register--text-paragraph'>
						your cosmetic collection like never before.
					</p>
					<button className='main__register--text-button'>
						Register Now
					</button>
				</div>

				<div className='main__home-illustration'>
					<img src={homeIllustration} alt='Vanity´s Home image' />
				</div>
			</section>

			<section className='main__organize'>
				<div className='main__product-illustration'>
					<img src={createProduct} alt="Vanity's Create Product" />
				</div>
				<div className='main__organize--text'>
					<p className='main__organize--text-title'>
						Organize Your <br /> Cosmetic in Seconds
					</p>
					<p className='main__organize--text-paragraph'>
						Add your first product and take control of your vanity easily
						and quickly.
					</p>
					<p className='main__organize--text-paragraph2'>
						Start organizing now!
					</p>
				</div>
			</section>

			{showUserProfile && (
				<Modal>
					<UserProfile />
				</Modal>
			)}
		</div>
	);
};
