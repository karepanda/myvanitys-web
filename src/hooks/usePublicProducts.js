import { useState, useContext, useEffect } from 'react';
import { VanitysContext } from '../context';

export const usePublicProducts = () => {
	const [publicProducts, setPublicProducts] = useState([]);
	const [userProducts, setUserProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [hasLoaded, setHasLoaded] = useState(false);

	const {
		apiResponse,
		authInitialized,
		getProducts,
		findProductsByUserId,
		errorHandler,
		publicProductsRefreshTrigger, // ← Agregar estos triggers
		productsRefreshTrigger, // ← Agregar estos triggers
	} = useContext(VanitysContext);

	const loadPublicProducts = async () => {
		if (!authInitialized || !apiResponse?.token || !apiResponse?.user?.id) {
			setError(new Error('User not authenticated'));
			return false;
		}

		setLoading(true);
		setError(null);

		try {
			const [allProductsResult, userProductsResult] = await Promise.all([
				getProducts(apiResponse.token, errorHandler),
				findProductsByUserId(
					apiResponse.token,
					apiResponse.user.id,
					errorHandler
				),
			]);

			const allProds = allProductsResult || [];
			const userProds = userProductsResult || [];

			const userProductIds = new Set(userProds.map((product) => product.id));
			const availableProducts = allProds.filter(
				(product) => !userProductIds.has(product.id)
			);

			setAllProducts(allProds);
			setUserProducts(userProds);
			setPublicProducts(availableProducts);
			setFilteredProducts(availableProducts);
			setError(null);
			setHasLoaded(true);

			return true;
		} catch (err) {
			console.error('MANUAL: Error fetching products:', err);

			// Error handling
			if (errorHandler) {
				if (!navigator.onLine) {
					errorHandler.showNetworkError('noConnection');
				} else if (err.status >= 500) {
					errorHandler.handleApiError(
						'product',
						err.status,
						'Server error loading public products'
					);
				} else {
					console.warn('Non-critical error loading public products:', err);
				}
			}

			setAllProducts([]);
			setUserProducts([]);
			setPublicProducts([]);
			setFilteredProducts([]);
			setError(err);
			setHasLoaded(false);

			console.log('🏁 MANUAL: Manual fetch completed with error');
			return false;
		} finally {
			setLoading(false);
		}
	};

	// UseEffect to reload automatically when the triggers change
	useEffect(() => {
		if (authInitialized && apiResponse?.token && apiResponse?.user?.id) {
			console.log('🔄 usePublicProducts auto-refresh triggered by:', {
				publicProductsRefreshTrigger,
				productsRefreshTrigger
			});
			loadPublicProducts();
		}
	}, [
		authInitialized,
		apiResponse?.token,
		apiResponse?.user?.id,
		publicProductsRefreshTrigger, // Listen to changes in public products
		productsRefreshTrigger, // Listen to user's product changes
	]);

	const clearData = () => {
		setAllProducts([]);
		setUserProducts([]);
		setPublicProducts([]);
		setFilteredProducts([]);
		setError(null);
		setHasLoaded(false);
	};

	const searchPublicProducts = (searchTerm) => {
		if (!hasLoaded) {
			console.warn('Cannot search - data not loaded yet');
			return;
		}

		if (!searchTerm || searchTerm.trim() === '') {
			setFilteredProducts(publicProducts);
			return;
		}

		const searchResults = publicProducts.filter((product) => {
			return (
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.brand.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});

		setFilteredProducts(searchResults);
	};

	const filterByCategory = (categoryId) => {
		if (!hasLoaded) {
			console.warn('Cannot filter - data not loaded yet');
			return;
		}

		if (!categoryId) {
			setFilteredProducts(publicProducts);
			return;
		}

		const categoryResults = publicProducts.filter(
			(product) => product.categoryId === categoryId
		);

		setFilteredProducts(categoryResults);
	};

	return {
		// Data
		publicProducts: filteredProducts,
		allProducts,
		userProducts,
		loading,
		error,
		hasLoaded,

		// Functions
		loadPublicProducts,
		clearData,
		searchPublicProducts,
		filterByCategory,
	};
};