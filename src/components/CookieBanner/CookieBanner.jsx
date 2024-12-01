import React from 'react';
import '../CookieBanner/CookieBanner.css';
import { useContext } from 'react';
import { VanitysContext } from '../../context';

const CookieBanner = () => {
	const { closeCookieBanner } = useContext(VanitysContext);

	return (
		<div className='cookieBanner'>
			<p className='cookieBanner__paragraph'>
				We use cookies to ensure you have the best browsing experience on
				our website. By using our site, you acknowledge that you have read
				and understood our
				<span className='cookieBanner__highlight'> Cookie Policy </span>
				 & <span className='cookieBanner__highlight'>Privacy Policy</span>
			</p>
			<button
				onClick={() => closeCookieBanner()}
				className='cookieBanner__button'
			>
				Got it!
			</button>
		</div>
	);
};

export { CookieBanner };
