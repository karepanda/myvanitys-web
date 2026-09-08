import { Link } from 'react-router-dom';
import './PublicFooter.css';
import { useTranslation } from 'react-i18next';

const PublicFooter = () => {
	const { t } = useTranslation('common');

	return (
		<footer className='publicFooter'>
			<p>© {new Date().getFullYear()} My Vanity's</p>
			<nav aria-label={t('legal.ariaLabel')}>
				<Link to='/privacy'>{t('legal.privacyPolicyLink')}</Link>
				<Link to='/terms'>{t('legal.termsOfUseLink')}</Link>
			</nav>
		</footer>
	);
};

export { PublicFooter };
