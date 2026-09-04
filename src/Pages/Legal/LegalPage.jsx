import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { VanitysContext } from '../../context';
import './LegalPage.css';

const privacySections = [
	['Information we collect', 'When you sign in with Google, we receive the account information needed to identify your account, such as your name, email address and profile image. We also store the products, notes and reviews you choose to add to your collection.'],
	['How we use information', 'We use this information to create and secure your account, provide the collection features you request, maintain the service and respond to support or security issues.'],
	['Storage and service providers', 'Authentication and hosting providers may process information on our behalf to operate My Vanity’s. We only share information when it is needed to provide the service, comply with the law or protect the service and its users.'],
	['Cookies and local storage', 'My Vanity’s uses browser storage to keep you signed in and to remember whether you dismissed the cookie notice. The current service does not use advertising or analytics cookies.'],
	['Your choices', 'You may stop using the service at any time. You may request access to, correction of or deletion of your account information by contacting us.'],
	['Security and retention', 'We use reasonable safeguards designed to protect account information. We retain information while your account is active and as needed to operate the service or meet legal obligations.'],
	['Changes', 'We may update this policy when the service or its legal obligations change. The date at the top of this page identifies the latest revision.'],
];

const termsSections = [
	['Using the service', 'You may use My Vanity’s to organize beauty products and share product information and reviews. You must provide accurate account information and use the service lawfully.'],
	['Your account', 'You are responsible for activity under your account and for keeping access to your Google account secure. Tell us promptly if you believe your account has been used without authorization.'],
	['Your content', 'You keep ownership of the content you submit. You grant My Vanity’s permission to host, display and process that content only as needed to operate and improve the service. Do not submit unlawful content or material that violates another person’s rights.'],
	['Product information', 'Product descriptions and community reviews are provided for organization and general information. They are not medical advice and should not replace product labels or advice from a qualified professional.'],
	['Availability', 'We may change, suspend or discontinue features and may restrict access when needed for maintenance, security, legal compliance or misuse prevention.'],
	['Disclaimer and liability', 'The service is provided as available. To the extent permitted by law, My Vanity’s is not responsible for indirect losses or decisions made from community-provided product information. Nothing in these terms limits rights that cannot legally be limited.'],
	['Changes', 'We may update these terms as the service changes. Continued use after an update means the revised terms apply from their stated effective date.'],
];

const LegalPage = ({ type }) => {
	const { apiResponse } = useContext(VanitysContext);
	const privacy = type === 'privacy';
	const title = privacy ? 'Privacy Policy' : 'Terms of Use';
	const sections = privacy ? privacySections : termsSections;
	const backDestination = apiResponse?.token ? '/dashboard' : '/';
	const backLabel = apiResponse?.token ? 'Back to My Vanity' : 'Back to My Vanity’s';

	return (
		<main className='legalPage'>
			<Link className='legalPage__back' to={backDestination}>← {backLabel}</Link>
			<article>
				<p className='legalPage__eyebrow'>Legal information</p>
				<h1>{title}</h1>
				<p className='legalPage__date'>Effective September 4, 2026</p>
				<p>This page explains the rules and privacy practices for the My Vanity’s web application.</p>
				{sections.map(([heading, content]) => (
					<section key={heading}>
						<h2>{heading}</h2>
						<p>{content}</p>
					</section>
				))}
				<section>
					<h2>Contact</h2>
					<p>For privacy, account or legal questions, use the contact channel published by My Vanity’s.</p>
				</section>
			</article>
		</main>
	);
};

LegalPage.propTypes = {
	type: PropTypes.oneOf(['privacy', 'terms']).isRequired,
};

export { LegalPage };
