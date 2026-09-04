import { useContext } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCompass, FiHeart, FiPlus, FiSearch, FiUser } from 'react-icons/fi';
import { VanitysContext } from '../../context';
import './DashboardNavigation.css';

const items = [
	{ id: 'my-vanity', label: 'My Vanity', icon: FiHeart },
	{ id: 'search', label: 'Search', icon: FiSearch },
	{ id: 'add', label: 'Add', icon: FiPlus },
	{ id: 'add-products', label: 'Explore', icon: FiCompass },
	{ id: 'profile', label: 'Profile', icon: FiUser },
];

const DashboardNavigation = () => {
	const { toggleCreateProductPopup, toggleUserProfile } = useContext(VanitysContext);
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();

	const modeParam = searchParams.get('mode');
	const mode =
		location.pathname === '/dashboard' &&
		(modeParam === 'search' || modeParam === 'add-products')
			? modeParam
			: location.pathname === '/dashboard'
				? 'my-vanity'
				: null;

	const changeMode = (nextMode) => {
		if (nextMode === 'search') setSearchParams({ mode: 'search' });
		else if (nextMode === 'add-products') setSearchParams({ mode: 'add-products' });
		else navigate('/dashboard');
	};

	const handleClick = (id) => {
		if (id === 'add') toggleCreateProductPopup();
		else if (id === 'profile') toggleUserProfile();
		else changeMode(id);
	};

	return (
		<nav className='dashboardNavigation' aria-label='Dashboard navigation'>
			<Link className='dashboardNavigation__brand' to='/dashboard'>
				My Vanity's
			</Link>
			<div className='dashboardNavigation__items'>
				{items.map(({ id, label, icon: Icon }) => {
					const isActive = id === mode;
					return (
						<button
							key={id}
							type='button'
							className={`dashboardNavigation__item dashboardNavigation__item--${id}${
								isActive ? ' dashboardNavigation__item--active' : ''
							}`}
							onClick={() => handleClick(id)}
							aria-current={isActive ? 'page' : undefined}
							aria-label={id === 'add' ? 'Add product' : label}
						>
							<span className='dashboardNavigation__icon'><Icon aria-hidden='true' /></span>
							<span>{label}</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
};

export { DashboardNavigation };
