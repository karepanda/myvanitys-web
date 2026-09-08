import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCompass, FiHeart, FiPlus, FiSearch, FiUser } from 'react-icons/fi';
import { VanitysContext } from '../../context';
import './DashboardNavigation.css';

const items = [
	{ id: 'my-vanity', labelKey: 'navigation.myVanity', icon: FiHeart },
	{ id: 'search', labelKey: 'navigation.search', icon: FiSearch },
	{ id: 'add', labelKey: 'navigation.add', icon: FiPlus },
	{ id: 'add-products', labelKey: 'navigation.explore', icon: FiCompass },
	{ id: 'profile', labelKey: 'navigation.profile', icon: FiUser },
];

const DashboardNavigation = () => {
	const { t } = useTranslation('common');
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
		<nav className='dashboardNavigation' aria-label={t('navigation.ariaLabel')}>
			<Link className='dashboardNavigation__brand' to='/dashboard'>
				My Vanity's
			</Link>
			<div className='dashboardNavigation__items'>
				{items.map(({ id, labelKey, icon: Icon }) => {
					const isActive = id === mode;
					const label = t(labelKey);
					return (
						<button
							key={id}
							type='button'
							className={`dashboardNavigation__item dashboardNavigation__item--${id}${
								isActive ? ' dashboardNavigation__item--active' : ''
							}`}
							onClick={() => handleClick(id)}
							aria-current={isActive ? 'page' : undefined}
							aria-label={id === 'add' ? t('navigation.addProduct') : label}
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
