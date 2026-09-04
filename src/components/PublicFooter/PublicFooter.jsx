import { Link } from 'react-router-dom';
import './PublicFooter.css';

const PublicFooter = () => (
	<footer className='publicFooter'>
		<p>© {new Date().getFullYear()} My Vanity's</p>
		<nav aria-label='Legal information'>
			<Link to='/privacy'>Privacy Policy</Link>
			<Link to='/terms'>Terms of Use</Link>
		</nav>
	</footer>
);

export { PublicFooter };
