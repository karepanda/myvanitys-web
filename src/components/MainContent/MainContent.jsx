import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiHeart, FiSearch } from 'react-icons/fi';
import './MainContent.css';
import './MainContent.responsive.css';

import homeIllustration from '../../assets/home_illustration.optimized.png';
import createProduct from '../../assets/CreateProduct.optimized.png';
import { VanitysContext } from '../../context/index';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';
import { useTranslation } from 'react-i18next';

export const Main = () => {
	const { t } = useTranslation('common');
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
					<p className='main__upperTitle'>{t('home.hero.eyebrow')}</p>
					<h1>{t('home.hero.title')}</h1>
					<p className='main__hero-description'>
						{t('home.hero.description')}
					</p>
					<div className='main__hero-actions'>
						{showLoginButtons && renderButtonWithTooltip(t('home.hero.createVanity'), toggleModalRegister, 'main__primary-action', 'main')}
						{showLoginButtons && renderButtonWithTooltip(t('home.hero.existingAccount'), toggleModalLogin, 'main__secondary-action', 'main')}
						{isAuthenticated && <button className='main__primary-action' onClick={() => navigate('/dashboard')}>{t('home.hero.openVanity')}</button>}
					</div>
					<p className='main__hero-note'>{t('home.hero.note')}</p>
				</div>

				<div className='main__hero-visual' aria-hidden='true'>
					<span className='main__visual-label'>{t('home.hero.visualLabel')}</span>
					<img src={homeIllustration} alt='' width='900' height='900' fetchpriority='high' />
				</div>
			</section>

			<section className='main__intro' aria-labelledby='how-it-works'>
				<div className='main__intro-heading'>
					<p className='main__upperTitle'>{t('home.intro.eyebrow')}</p>
					<h2 id='how-it-works'>{t('home.intro.title')}</h2>
					<p>{t('home.intro.description')}</p>
				</div>
				<div className='main__features'>
					<article><span><FiGrid /></span><p>01</p><h3>{t('home.features.organize.title')}</h3><div>{t('home.features.organize.description')}</div></article>
					<article><span><FiSearch /></span><p>02</p><h3>{t('home.features.discover.title')}</h3><div>{t('home.features.discover.description')}</div></article>
					<article><span><FiHeart /></span><p>03</p><h3>{t('home.features.remember.title')}</h3><div>{t('home.features.remember.description')}</div></article>
				</div>
				<div className='main__organize'>
					<div className='main__product-illustration'><img src={createProduct} alt={t('home.promo.imageAlt')} width='900' height='900' loading='lazy' decoding='async' /></div>
					<div className='main__organize-copy'>
						<p className='main__upperTitle'>{t('home.promo.eyebrow')}</p>
						<h2>{t('home.promo.title')}</h2>
						<p>{t('home.promo.description')}</p>
						{showLoginButtons && <button className='main__text-action' onClick={toggleModalRegister}>{t('home.promo.action')} <span aria-hidden='true'>→</span></button>}
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
