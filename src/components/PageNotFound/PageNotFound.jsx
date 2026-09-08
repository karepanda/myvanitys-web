import './PageNotFound.css';
import homeIllustration from '../../assets/home_illustration.optimized.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();

	const goToHomePage = () => {
		navigate('/');
	};

	return (
		<div className='pageNotFound'>
			<img
				className='pageNotFound__image'
				alt={t('pageNotFound.imageAlt')}
				src={homeIllustration}
			/>
			<div className='pageNotFound__text'>
				<p className='pageNotFound__text--bold'>{t('pageNotFound.title')}</p>
			</div>
			<button className='pageNotFound__button' onClick={goToHomePage}>
				{t('pageNotFound.returnHome')}
			</button>
		</div>
	);
};

export { PageNotFound };
