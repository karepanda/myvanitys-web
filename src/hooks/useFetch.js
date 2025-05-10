// useFetch.js
import { useState, useEffect } from 'react';
import { getAccessToken } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessages';

const useFetch = (url, method = 'GET', customHeaders = {}, errorHandler = null) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Pass errorHandler to getAccessToken
				const accessToken = await getAccessToken(errorHandler);

				if (!accessToken) {
					// We don't throw here since getAccessToken already handled the error
					setError(new Error('No access token available'));
					return;
				}

				const headers = {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
					...customHeaders,
				};

				const response = await fetch(url, {
					method,
					headers,
				});

				if (!response.ok) {
					const errorText = await response.text().catch(() => '');
					
					// Determine error category based on the URL
					let category = 'generic';
					if (url.includes('/auth')) {
						category = 'auth';
					} else if (url.includes('/profile')) {
						category = 'profile';
					} else if (url.includes('/products')) {
						category = 'products';
					}
					
					// Handle the error with our error handler if available
					if (errorHandler) {
						errorHandler.handleApiError(category, response.status, errorText);
					}
					
					// Still set the error in the state for components that check it
					const error = new Error(`HTTP error! Status: ${response.status}`);
					error.status = response.status;
					setError(error);
					return;
				}

				const result = await response.json();
				setData(result);
			} catch (error) {
				setError(error);
				
				// Use errorHandler if available
				if (errorHandler) {
					// Check if offline
					if (!navigator.onLine) {
						errorHandler.showNetworkError('offline');
					} else {
						errorHandler.showGenericError();
					}
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url, method, customHeaders, errorHandler]); // Add errorHandler to dependencies

	return { data, error, loading };
};

export { useFetch };