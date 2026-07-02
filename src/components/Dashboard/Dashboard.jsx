import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiSearch, FiSliders } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { Categories } from '../Categories/Categories';
import { DashboardNavigation } from '../DashboardNavigation/DashboardNavigation';
import { ProductCard } from '../ProductCard/ProductCard';
import { SortControl } from '../SortControl/SortControl';
import { Modal } from '../Modal/Modal';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';
import { CreateReviewPopup } from '../CreateReviewPopup/CreateReviewPopup';
import { DeleteModal } from '../DeleteModal/DeleteModal';
import { ProductPopup } from '../ProductPopup/ProductPopup';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';
import { VanitysContext } from '../../context';
import { useFetchUserProducts, usePublicProducts } from '../../hooks';
import { useProductSearch } from '../../hooks/useProductSearch';
import {
	ALL_CATEGORIES,
	filterByCategory,
	getAvailableCategories,
	sortProducts,
} from '../../utils/dashboardProducts';
import './Dashboard.css';

const MODE_CONTENT = {
	'my-vanity': { title: 'My products', emptyTitle: 'Your vanity is ready for its first product', emptyText: 'Create a product or explore the community collection.' },
	search: { title: 'Search results', emptyTitle: 'Find your next favorite', emptyText: 'Search by product name or brand using at least two characters.' },
	'add-products': { title: 'Explore products', emptyTitle: 'Nothing new to add right now', emptyText: 'You already have all available products in My Vanity’s.' },
};

const Dashboard = () => {
	const {
		apiResponse,
		searchText,
		setSearchText,
		handleSearch,
		showCreateProductPopup,
		toggleCreateProductPopup,
		showCreateReviewPopup,
		toggleCreateReviewPopup,
		reviewProductId,
		showProductPopup,
		toggleProductPopup,
		showUserProfile,
		toggleUserProfile,
		showNotification,
		handleAddToVanity,
		isAdding,
		deleteProduct,
		errorHandler,
	} = useContext(VanitysContext);
	const [searchParams, setSearchParams] = useSearchParams();
	const modeParam = searchParams.get('mode');
	const mode = modeParam === 'search' || modeParam === 'add-products' ? modeParam : 'my-vanity';
	const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
	const [sort, setSort] = useState('default');
	const [deleteTarget, setDeleteTarget] = useState(null);
	const searchInputRef = useRef(null);

	const { products: userProducts, error: userError, loading: userLoading } = useFetchUserProducts();
	const {
		publicProducts,
		loading: publicLoading,
		error: publicError,
		hasLoaded: publicHasLoaded,
		loadPublicProducts,
	} = usePublicProducts();
	const {
		searchResults,
		isSearching,
		searchError,
		hasSearched,
		lastSearchQuery,
		searchProducts,
	} = useProductSearch();

	useEffect(() => {
		setSelectedCategory(ALL_CATEGORIES);
		setSort('default');
		if (mode === 'search') {
			window.requestAnimationFrame(() => searchInputRef.current?.focus());
		}
	}, [mode]);

	useEffect(() => {
		if (mode === 'add-products' && !publicHasLoaded && !publicLoading) {
			loadPublicProducts();
		}
	}, [mode, publicHasLoaded, publicLoading]);

	useEffect(() => {
		if (mode !== 'search') return;
		const query = (searchParams.get('q') || '').trim();
		if (query.length < 2 || query === lastSearchQuery || isSearching) return;
		setSearchText(query);
		searchProducts(query);
	}, [mode, searchParams, lastSearchQuery, isSearching, setSearchText]);

	const modeProducts = mode === 'search' ? searchResults : mode === 'add-products' ? publicProducts : userProducts;
	const error = mode === 'search' ? searchError : mode === 'add-products' ? publicError : userError;
	const loading = mode === 'search' ? isSearching : mode === 'add-products' ? publicLoading : userLoading;
	const categories = useMemo(() => getAvailableCategories(modeProducts), [modeProducts]);

	const visibleProducts = useMemo(() => {
		const existingFiltered = searchText && mode !== 'search'
			? modeProducts.filter((product) => {
				const query = searchText.toLowerCase();
				return String(product?.name || '').toLowerCase().includes(query) || String(product?.brand || '').toLowerCase().includes(query);
			})
			: modeProducts;
		return sortProducts(filterByCategory(existingFiltered, selectedCategory), sort);
	}, [modeProducts, mode, searchText, selectedCategory, sort]);

	const changeMode = (nextMode) => {
		if (nextMode === 'search') setSearchParams({ mode: 'search' });
		else if (nextMode === 'add-products') setSearchParams({ mode: 'add-products' });
		else setSearchParams({});
	};

	const submitSearch = async (event) => {
		event?.preventDefault();
		if (searchText.trim().length < 2 || isSearching) return;
		const query = searchText.trim();
		setSearchParams({ mode: 'search', q: query });
		await searchProducts(query);
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		if (!apiResponse?.token) {
			errorHandler.showErrorMessage('You are not authenticated. Please log in to continue.', 'Authentication error', 'error');
			setDeleteTarget(null);
			return;
		}
		try {
			await deleteProduct(apiResponse.token, deleteTarget.id);
			setDeleteTarget(null);
		} catch {
			errorHandler.showGenericError();
		}
	};

	const content = MODE_CONTENT[mode];
	const searchTooShort = mode === 'search' && searchText.length > 0 && searchText.trim().length < 2;
	const showEmpty = !loading && !error && visibleProducts.length === 0;

	return (
		<div className='dashboardShell'>
			<DashboardNavigation
				mode={mode}
				onModeChange={changeMode}
				onAdd={toggleCreateProductPopup}
				onProfile={toggleUserProfile}
			/>
			<main className='dashboard'>
				<header className='dashboard__welcome'>
					<div>
						<p className='dashboard__eyebrow'>My Vanity’s</p>
						<h1>{content.title}</h1>
					</div>
				</header>

				{mode === 'search' && (
					<form className='dashboard__search' onSubmit={submitSearch} role='search'>
						<FiSearch aria-hidden='true' />
						<input
							ref={searchInputRef}
							type='search'
							value={searchText}
							onChange={handleSearch}
							placeholder='Search products or brands'
							aria-label='Search products'
						/>
						<button type='submit' disabled={searchText.trim().length < 2 || isSearching}>
							{isSearching ? 'Searching…' : 'Search'}
						</button>
					</form>
				)}

				{searchTooShort && <p className='dashboard__hint'>Enter at least two characters.</p>}

				<Categories categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

				<div className='dashboard__toolbar'>
					<p><strong>{visibleProducts.length}</strong> {visibleProducts.length === 1 ? 'item' : 'items'}</p>
					<SortControl value={sort} onChange={setSort} />
				</div>

				{loading && (
					<div className='dashboardState' role='status'>
						<span className='dashboardState__spinner' />
						<h2>{mode === 'search' ? 'Searching products…' : 'Loading products…'}</h2>
					</div>
				)}

				{error && !loading && (
					<div className='dashboardState dashboardState--error' role='alert'>
						<FiAlertCircle aria-hidden='true' />
						<h2>We couldn’t load these products</h2>
						<p>{typeof error === 'string' ? error : error.message || 'Please try again.'}</p>
						<button type='button' onClick={() => window.location.reload()}>Try again</button>
					</div>
				)}

				{showEmpty && (
					<div className='dashboardState'>
						<FiSliders aria-hidden='true' />
						<h2>{mode === 'search' && hasSearched ? `No results for “${lastSearchQuery}”` : content.emptyTitle}</h2>
						<p>{selectedCategory !== ALL_CATEGORIES ? 'Try choosing All to see every product.' : content.emptyText}</p>
						{mode === 'my-vanity' && <button type='button' onClick={() => changeMode('add-products')}>Explore products</button>}
					</div>
				)}

				{!loading && !error && visibleProducts.length > 0 && (
					<section className='dashboard__grid' aria-label={content.title}>
						{visibleProducts.map((product, index) => (
							<ProductCard
								key={product.id || `${product.name}-${index}`}
								product={product}
								variant={mode === 'my-vanity' ? 'collection' : mode === 'search' ? 'search' : 'explore'}
								onOpen={toggleProductPopup}
								onAdd={handleAddToVanity}
								onReview={(item) => toggleCreateReviewPopup(item.id)}
								onDelete={setDeleteTarget}
								isAdding={isAdding}
							/>
						))}
					</section>
				)}
			</main>

			{showCreateProductPopup && <Modal><CreateProductPopup /></Modal>}
			{showProductPopup && <Modal><ProductPopup /></Modal>}
			{showCreateReviewPopup && reviewProductId && <Modal><CreateReviewPopup productId={reviewProductId} /></Modal>}
			{deleteTarget && <Modal><DeleteModal productName={deleteTarget.name} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} /></Modal>}
			{showUserProfile && <Modal><UserProfile /></Modal>}
			{showNotification && <Notification />}
		</div>
	);
};

export { Dashboard };
