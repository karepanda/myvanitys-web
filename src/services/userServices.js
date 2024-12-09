import { getAccessToken } from './authServices';

const fetchUserData = async () => {
	try {
		const accessToken = await getAccessToken();

		if (!accessToken) {
			throw new Error('No access token available');
		}

		const response = await fetch(
			'http://localhost:8080/myvanitys/dashboard',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		throw error;
	}
};

export { fetchUserData };
