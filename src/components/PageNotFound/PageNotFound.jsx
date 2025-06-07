import './PageNotFound.css';
import homeIllustration from '../../assets/home_illustration.png';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
	const navigate = useNavigate();

	const goToHomePage = () => {
		navigate('/');
	};

	return (
		<div className='pageNotFound'>
			<img
				className='pageNotFound__image'
				alt='No product image'
				src={homeIllustration}
			/>
			<div className='pageNotFound__text'>
				<p className='pageNotFound__text--bold'>Page not found</p>
			</div>
			<button className='pageNotFound__button' onClick={goToHomePage}>
				Return to home
			</button>
		</div>
	);
};

export { PageNotFound };
