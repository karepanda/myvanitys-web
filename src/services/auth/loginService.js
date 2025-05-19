// services/auth/loginService.js
import { apiUtils } from '../../utils/apiUtils';

export const loginService = {
	authenticate: async (authCode, errorHandler) => {
		const API_URL = import.meta.env.VITE_API_URL;

		console.log('Variables Environment:', {
			VITE_API_URL: import.meta.env.VITE_API_URL,
			VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
			NODE_ENV: import.meta.env.MODE || import.meta.env.NODE_ENV,
			hostname: window.location.hostname,
		});

		const authUrl = `${API_URL}/auth/google`;
		console.log('Auth URL being used:', authUrl);

		try {
			const response = await fetch(`${API_URL}/auth/google`, {
				method: 'POST',
				headers: {
					...apiUtils.getCommonHeaders(),
					Authorization: `Bearer ${authCode}`,
				},
				body: JSON.stringify({ code: authCode }),
			});

			if (!response.ok) {
				const errorText = await response.text().catch(() => '');
				if (errorHandler) {
					errorHandler.handleApiError('auth', response.status, errorText);
				}
				return null;
			}

			const userData = await response.text();
			return userData ? JSON.parse(userData) : null;
		} catch (error) {
			console.error('Authentication error:', error);

			if (errorHandler) {
				if (!navigator.onLine) {
					errorHandler.showNetworkError();
				} else {
					errorHandler.showGenericError();
				}
			}
			return null;
		}
	},
};
