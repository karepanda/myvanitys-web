import React from 'react';
import { Main } from '../../components/Main/Main';
import { Modal } from '../../components/Modal/Modal';
import { CookieBanner } from '../../components/CookieBanner/CookieBanner';
import { useContext } from 'react';
import { VanitysContext } from '../../context';

const Home = () => {
	const { showCookieBanner } = useContext(VanitysContext);

	return (
		<div className='home flex flex-col justify-center'>
			<Main />
			{showCookieBanner && (
				<Modal>
					<CookieBanner />
				</Modal>
			)}
		</div>
	);
};

export { Home };
