/ useFetch.js
import { useState, useEffect, useContext } from 'react';
import { VanitysContext } from '../context';
import { apiUtils } from '../utils/apiUtils';

const useFetch = (url, method = 'GET', customHeaders = {}, errorHandler = null) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const { apiResponse } = useContext(VanitysContext);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Use API response token stored in context
				const accessToken = apiResponse?.token;

				if (!accessToken) {
					// We cannot continue without access token
					setError(new Error('No access token available'));
					if (errorHandler) {
						errorHandler.showErrorMessage(
							'There is no access token available. Please log in again.',
							'Authentication error',
							'error'
						);
					}
					return;
				}

				// Use apiUtils to get common headers
				const headers = {
					...apiUtils.getCommonHeaders(accessToken),
					...customHeaders,
				};

				const response = await fetch(url, {
					method,
					headers,
				});

				if (!response.ok) {
					const errorText = await response.text().catch(() => '');
					
					// Determine error category based on URL
					let category = 'generic';
					if (url.includes('/auth')) {
						category = 'auth';
					} else if (url.includes('/profile')) {
						category = 'profile';
					} else if (url.includes('/products')) {
						category = 'product';
					}
					
					// Handle the error with our error handler if available
					if (errorHandler) {
						errorHandler.handleApiError(category, response.status, errorText);
					}
					
					// Also set the error in the status for components that check for it.
					const error = new Error(`HTTP error! Status: ${response.status}`);
					error.status = response.status;
					setError(error);
					return;
				}

				// For responses without content
				if (response.status === 204) {
					setData(true);
					return;
				}

				const result = await response.json();
				setData(result);
			} catch (error) {
				console.error('Fetch error:', error);
				setError(error);
				
				// Use errorHandler if available
				if (errorHandler) {
					// Check if it is disconnected
					if (!navigator.onLine) {
						errorHandler.showNetworkError();
					} else {
						errorHandler.showGenericError();
					}
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url, method, customHeaders, errorHandler, apiResponse]); // // Add apiResponse to dependencies

	return { data, error, loading };
};

export { useFetch };