// useFetch.js
import { useState, useEffect } from 'react';
import { getAccessToken } from '../services/productService';

const useFetch = (url, method = 'GET', customHeaders = {}) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const accessToken = await getAccessToken();

				if (!accessToken) {
					throw new Error('No access token available');
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
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const result = await response.json();
				setData(result);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url, method, customHeaders]);

	return { data, error, loading };
};

export { useFetch };
