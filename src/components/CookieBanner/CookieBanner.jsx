import './CookieBanner.css';
import './CookieBanner.responsive.css';

import { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CookieBanner = () => {
	const { t } = useTranslation('common');
	const { closeCookieBanner } = useContext(VanitysContext);

	return (
		<div className='cookieBanner' role='region' aria-label={t('cookieBanner.ariaLabel')}>
			<p className='cookieBanner__paragraph'>
				{t('cookieBanner.body')} <Link to='/privacy' className='cookieBanner__highlight'>{t('legal.privacyPolicyLink')}</Link>
				 {'&'} <Link to='/terms' className='cookieBanner__highlight'>{t('legal.termsOfUseLink')}</Link>.
			</p>
			<button
				type='button'
				onClick={() => closeCookieBanner()}
				className='cookieBanner__button'
			>
				{t('cookieBanner.dismiss')}
			</button>
		</div>
	);
};

export { CookieBanner };
