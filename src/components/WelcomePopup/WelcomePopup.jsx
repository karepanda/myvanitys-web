import { useContext } from 'react';
import './WelcomePopup.css';
import { IoClose } from 'react-icons/io5';
import { VanitysContext } from '../../context/index';
import { useTranslation } from 'react-i18next';

const WelcomePopup = () => {
	const { t } = useTranslation('common');
	const { setShowWelcomePopup } = useContext(VanitysContext);

	return (
		<div className='welcomePopup' role='dialog' aria-modal='true' aria-labelledby='welcome-title'>
			<div className='welcomePopup__panel'>
			<section className='welcomePopup__header'>
				<p className='welcomePopup__eyebrow'>{t('welcomePopup.eyebrow')}</p>
				<button type='button' onClick={() => setShowWelcomePopup(false)} className='welcomePopup__header--icon' aria-label={t('welcomePopup.close')}><IoClose aria-hidden='true' /></button>
			</section>
			<section className='welcomePopup__content'>
				<h1 id='welcome-title' className='welcomePopup__header--title'>{t('welcomePopup.title')}</h1>
				<p className='welcomePopup__content--text'>
					{t('welcomePopup.description')}
				</p>
				<button type='button' className='welcomePopup__action' onClick={() => setShowWelcomePopup(false)}>{t('welcomePopup.action')}</button>
			</section>
			</div>
		</div>
	);
};

export { WelcomePopup };
