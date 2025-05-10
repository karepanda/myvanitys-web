const API_URL = import.meta.env.VITE_API_URL;

const getAccessToken = async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const accessToken = urlParams.get('code');
	const state = urlParams.get('state');

	if (accessToken) {
		try {
			const response = await fetch(`${API_URL}/api/v1/auth/google`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'X-Request-Id': 'd2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8',
					'X-Flow-Id': '123e4567-e89b-12d3-a456-426614174000',
					'User-Agent': 'MyVanitysApp/1.0',
					'Accept-Language': 'en-US',
				},
				body: JSON.stringify({
					token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.payload.signature',
				}),
			});

			// Log the response status
			console.log('API response received, status:', response.status);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const userData = await response.text();

			if (!userData) {
				throw new Error('No user data returned');
			}

			return userData ? JSON.parse(userData) : {};
		} catch (error) {
			return null;
		}
	} else {
		console.error('No access token found in the URL.');
		return null;
	}
};

export { getAccessToken };
