import { code } from 'framer-motion/client';

const getAccessToken = async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const accessToken = urlParams.get('code');
	const state = urlParams.get('state');

	if (accessToken) {
		try {
			const response = await fetch(
				'http://localhost:8080/myvanitys/auth/google',
				{
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
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const userData = await response.text();

			if (!userData) {
				throw new Error('No user data returned');
			}

			return userData ? JSON.parse(userData) : {};

			// const productUserData = await fetch(
			// 	'http://localhost:8080/myvanitys/users/{userId}/products', 		{
			// method: 'GET',
			// headers: {
			// 	'Content-Type': 'application/json',
			// 	Authorization: `Bearer 4/P7q7W91`,
			// 	'X-Request-Id': 'd2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8',
			// 	'X-Flow-Id': '123e4567-e89b-12d3-a456-426614174000',
			// 	'User-Agent': 'MyVanitysApp/1.0',
			// 	'Accept-Language': 'en-US',
			// },
			// body: JSON.stringify({
			// 	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.payload.signature',
			// }),
			// })
			// return productUserData ? JSON.parse(productUserData) : {};
		} catch (error) {
			return null;
		}
	} else {
		console.error('No access token found in the URL.');
		return null;
	}
};

export { getAccessToken };
