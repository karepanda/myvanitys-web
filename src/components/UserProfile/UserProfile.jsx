import { useContext } from 'react';
import { IoClose, IoPersonCircleOutline } from 'react-icons/io5';
import './UserProfile.css';
import { VanitysContext } from '../../context/index';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
	const { t } = useTranslation('common');
	const {
		apiResponse,
		toggleUserProfile,
		showUserProfile,
		logout,
		toggleCreateProductPopup,
	} = useContext(VanitysContext);

	const navigate = useNavigate();

	const goToMyVanity = () => {
		navigate('/dashboard');
	};

	return (
		<>
			{showUserProfile && (
				<div className='userProfile' role='dialog' aria-modal='true' aria-labelledby='profile-title'>
					<div className='userProfile__panel'>
					<div className='userProfile__header'>
						<h1 id='profile-title'>{t('userProfile.title')}</h1>
						<button type='button' onClick={toggleUserProfile} aria-label={t('userProfile.close')}><IoClose aria-hidden='true' /></button>
					</div>
					<div className='userProfile__name'>
						<IoPersonCircleOutline aria-hidden='true' />
						<h1 className='userProfile__name--title'>
							{apiResponse?.user?.name}
						</h1>
					</div>
					<div className='userProfile__buttons'>
						<button
							className='userProfile__buttons--goto'
							onClick={() => {
								toggleUserProfile();
								goToMyVanity();
							}}
						>
							{t('userProfile.goToVanity')}
						</button>
						<button
							className='userProfile__buttons--createProduct'
							onClick={() => {
								toggleCreateProductPopup();
								toggleUserProfile();
							}}
						>
							{t('userProfile.createProduct')}
						</button>
						<button
							className='userProfile__buttons--logOut'
							onClick={() => {
								logout();
							}}
						>
							{t('userProfile.logout')}
						</button>
						<nav className='userProfile__legal' aria-label={t('legal.ariaLabel')}>
							<Link to='/privacy' onClick={toggleUserProfile}>{t('legal.privacyPolicyLink')}</Link>
							<Link to='/terms' onClick={toggleUserProfile}>{t('legal.termsOfUseLink')}</Link>
							<LanguageSelector />
						</nav>
					</div>
					</div>
				</div>
			)}
		</>
	);
};

export { UserProfile };
