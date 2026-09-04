import './CookieBanner.css';
import './CookieBanner.responsive.css';

import { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
	const { closeCookieBanner } = useContext(VanitysContext);

	return (
		<div className='cookieBanner' role='region' aria-label='Cookie notice'>
			<p className='cookieBanner__paragraph'>
				We use browser storage to keep you signed in and remember your
				preferences. By using our site, you acknowledge that you have read
				and understood our <Link to='/privacy' className='cookieBanner__highlight'>Privacy Policy</Link>
				 {'&'} <Link to='/terms' className='cookieBanner__highlight'>Terms of Use</Link>.
			</p>
			<button
				type='button'
				onClick={() => closeCookieBanner()}
				className='cookieBanner__button'
			>
				Got it!
			</button>
		</div>
	);
};

export { CookieBanner };
