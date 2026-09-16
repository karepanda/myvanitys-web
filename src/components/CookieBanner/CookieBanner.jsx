import './CookieBanner.css';
import './CookieBanner.responsive.css';

import { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CookieBanner = () => {
	const { t } = useTranslation('common');
	const { acceptAnalyticsCookies, rejectAnalyticsCookies } =
		useContext(VanitysContext);

	return (
		<div
			className='cookieBanner'
			role='dialog'
			aria-label={t('cookieBanner.ariaLabel')}
		>
			<p className='cookieBanner__paragraph'>
				{t('cookieBanner.body')} <Link to='/privacy' className='cookieBanner__highlight'>{t('legal.privacyPolicyLink')}</Link>
				.
			</p>
			<div className='cookieBanner__actions'>
				<button
					type='button'
					onClick={rejectAnalyticsCookies}
					className='cookieBanner__button'
				>
					{t('cookieBanner.reject')}
				</button>
				<button
					type='button'
					onClick={acceptAnalyticsCookies}
					className='cookieBanner__button'
				>
					{t('cookieBanner.accept')}
				</button>
			</div>
		</div>
	);
};

export { CookieBanner };
