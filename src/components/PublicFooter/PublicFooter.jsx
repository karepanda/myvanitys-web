import { Link } from 'react-router-dom';
import './PublicFooter.css';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { VanitysContext } from '../../context';

const PublicFooter = () => {
	const { t } = useTranslation('common');
	const { openCookiePreferences } = useContext(VanitysContext);

	return (
		<footer className='publicFooter'>
			<p>© {new Date().getFullYear()} My Vanity's</p>
			<nav aria-label={t('legal.ariaLabel')}>
				<Link to='/privacy'>{t('legal.privacyPolicyLink')}</Link>
				<Link to='/terms'>{t('legal.termsOfUseLink')}</Link>
				<button type='button' onClick={openCookiePreferences}>
					{t('cookieBanner.preferences')}
				</button>
			</nav>
		</footer>
	);
};

export { PublicFooter };
