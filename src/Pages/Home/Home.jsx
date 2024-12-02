import React from 'react';
import { Main } from '../../components/MainContent/MainContent';
import { CookieBanner } from '../../components/CookieBanner/CookieBanner';
import { Modal } from '../../components/Modal/Modal';
import { useContext } from 'react';
import { VanitysContext } from '../../context';
import './Home.css';

const Home = () => {
	const { showCookieBanner } = useContext(VanitysContext);

	return (
		<div className='home'>
			<Main />
			{showCookieBanner && (
				<div className='main__organize--cookieBanner'>
					<Modal>
						<CookieBanner />
					</Modal>
				</div>
			)}
		</div>
	);
};

export { Home };
