import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiHeart, FiSearch } from 'react-icons/fi';
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
		toggleModalRegister,
		renderButtonWithTooltip,
	} = useContext(VanitysContext);
	const navigate = useNavigate();

	const showLoginButtons = authInitialized && !apiResponse?.token;
	const isAuthenticated = authInitialized && apiResponse?.token;

	return (
		<div className='main'>
			<section className='main__hero'>
				<div className='main__hero-copy'>
					<p className='main__upperTitle'>Your beauty collection, beautifully organized</p>
					<h1>Everything in your vanity, finally in one place.</h1>
					<p className='main__hero-description'>
						My Vanity’s helps you remember what you own, discover products from the community and keep the routine you love close at hand.
					</p>
					<div className='main__hero-actions'>
						{showLoginButtons && renderButtonWithTooltip('Create my vanity', toggleModalRegister, 'main__primary-action', 'main')}
						{showLoginButtons && renderButtonWithTooltip('I already have an account', toggleModalLogin, 'main__secondary-action', 'main')}
						{isAuthenticated && <button className='main__primary-action' onClick={() => navigate('/dashboard')}>Open my vanity</button>}
					</div>
					<p className='main__hero-note'>Free to start · Simple to use · Made for beauty lovers</p>
				</div>

				<div className='main__hero-visual' aria-hidden='true'>
					<span className='main__visual-label'>Your personal beauty shelf</span>
					<img src={homeIllustration} alt='' />
				</div>
			</section>

			<section className='main__intro' aria-labelledby='how-it-works'>
				<div className='main__intro-heading'>
					<p className='main__upperTitle'>What is My Vanity’s?</p>
					<h2 id='how-it-works'>A calmer way to enjoy your collection</h2>
					<p>Build a digital home for your cosmetics in a few easy steps.</p>
				</div>
				<div className='main__features'>
					<article><span><FiGrid /></span><p>01</p><h3>Organize</h3><div>Save your products in one clear, personal collection.</div></article>
					<article><span><FiSearch /></span><p>02</p><h3>Discover</h3><div>Search the community catalog by product name or brand.</div></article>
					<article><span><FiHeart /></span><p>03</p><h3>Remember</h3><div>Review your favorites and keep useful notes for later.</div></article>
				</div>
				<div className='main__organize'>
					<div className='main__product-illustration'><img src={createProduct} alt='Example of adding a product to My Vanity’s' /></div>
					<div className='main__organize-copy'>
						<p className='main__upperTitle'>Made to feel effortless</p>
						<h2>Add a product in seconds.</h2>
						<p>Name it, choose its brand and category, and it becomes part of your vanity. No spreadsheets, no forgotten drawers.</p>
						{showLoginButtons && <button className='main__text-action' onClick={toggleModalRegister}>Start organizing <span aria-hidden='true'>→</span></button>}
					</div>
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
