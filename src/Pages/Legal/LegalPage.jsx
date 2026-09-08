import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { VanitysContext } from '../../context';
import { useTranslation } from 'react-i18next';
import './LegalPage.css';

// DRAFT: The English legal copy must receive human legal review before it is treated as authoritative.
const privacySections = [
	'informationWeCollect',
	'howWeUseInformation',
	'storageAndProviders',
	'cookiesAndStorage',
	'yourChoices',
	'securityAndRetention',
	'changes',
];

const termsSections = [
	'usingTheService',
	'yourAccount',
	'yourContent',
	'productInformation',
	'availability',
	'disclaimerAndLiability',
	'changes',
];

const LegalPage = ({ type }) => {
	const { t } = useTranslation('common');
	const { apiResponse } = useContext(VanitysContext);
	const privacy = type === 'privacy';
	const pageKey = privacy ? 'privacy' : 'terms';
	const title = t(`legal.${pageKey}.title`);
	const sections = privacy ? privacySections : termsSections;
	const backDestination = apiResponse?.token ? '/dashboard' : '/';
	const backLabel = apiResponse?.token
		? t('legal.backToVanityAuthenticated')
		: t('legal.backToVanity');

	return (
		<main className='legalPage'>
			<Link className='legalPage__back' to={backDestination}>← {backLabel}</Link>
			<article>
				<p className='legalPage__eyebrow'>{t('legal.ariaLabel')}</p>
				<h1>{title}</h1>
				<p className='legalPage__date'>{t('legal.effectiveDate')}</p>
				<p>{t('legal.introduction')}</p>
				{sections.map((section) => (
					<section key={section}>
						<h2>{t(`legal.${pageKey}.sections.${section}.heading`)}</h2>
						<p>{t(`legal.${pageKey}.sections.${section}.body`)}</p>
					</section>
				))}
				<section>
					<h2>{t('legal.contact.heading')}</h2>
					<p>{t('legal.contact.body')}</p>
				</section>
			</article>
		</main>
	);
};

LegalPage.propTypes = {
	type: PropTypes.oneOf(['privacy', 'terms']).isRequired,
};

export { LegalPage };
