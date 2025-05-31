import { useState, useEffect, useContext } from 'react';
import { VanitysContext } from '../context';

export const useFetchUserProducts = () => {
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const {
		apiResponse,
		authInitialized,
		findProductsByUserId,
		errorHandler,
		productsRefreshTrigger, // 🔥 Trigger for refresh
	} = useContext(VanitysContext);

	useEffect(() => {
		const fetchProducts = async () => {
			if (
				!authInitialized ||
				!apiResponse?.token ||
				!apiResponse?.user?.id
			) {
				setLoading(false);
				setProducts([]);
				setError(null);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const result = await findProductsByUserId(
					apiResponse.token,
					apiResponse.user.id,
					errorHandler
				);

				if (result && Array.isArray(result)) {
					setProducts(result);
					setError(null);
				} else {
					setProducts([]);
					setError(null);
				}
			} catch (err) {
				setProducts([]);
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [
		authInitialized,
		apiResponse?.token,
		apiResponse?.user?.id,
		productsRefreshTrigger,
	]);

	return { products, error, loading };
};
