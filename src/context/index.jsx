import { createContext, useState } from 'react';

const VanitysContext = createContext();

const VanitysProvider = ({ children }) => {
	const [showModalRegister, setShowModalRegister] = useState(false);
	const [showModalLogin, setShowModalLogin] = useState(false);
	const [showCookieBanner, setShowCookieBanner] = useState(true);
	const [showCreateProductPopup, setShowCreateProductPopup] = useState(false);

	const toggleModalRegister = () => setShowModalRegister((prev) => !prev);
	const toggleModalLogin = () => setShowModalLogin((prev) => !prev);
	const closeCookieBanner = () => setShowCookieBanner((prev) => !prev);
	const toggleCreateProductPopup = () =>
		setShowCreateProductPopup((prev) => !prev);

	const [selectedCategory, setSelectedCategory] = useState('');

	const handleCategoryChange = (event) => {
		setSelectedCategory(event.target.value);
	};

	const handleColor = (e) => setColor(e.target.value);
	const [color, setColor] = useState('#D9D9D9');

	const getAccessToken = async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get('access_token');
		const state = urlParams.get('state');

		console.log('Access token', accessToken);
		console.log('state', state);

		if (accessToken) {
			try {
				const response = await fetch(
					'http://localhost:8080/myvanitys/auth/google',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer 4/P7q7W24`,
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

				const text = await response.text();
				return text ? JSON.parse(text) : {};
			} catch (error) {
				console.error('Error:', error);
				return null;
			}
		} else {
			console.error('No access token found in the URL.');
			return null;
		}
	};

	const [apiResponse, setApiResponse] = useState(null);

	const queryParams = new URLSearchParams(location.search);

	const accessToken = queryParams.get('access_token');
	const tokenType = queryParams.get('token_type');
	const expiresIn = queryParams.get('expires_in');
	const state = queryParams.get('state');

	return (
		<VanitysContext.Provider
			value={{
				showModalRegister,
				showModalLogin,
				toggleModalRegister,
				toggleModalLogin,
				getAccessToken,
				apiResponse,
				setApiResponse,
				queryParams,
				accessToken,
				tokenType,
				expiresIn,
				state,
				closeCookieBanner,
				showCookieBanner,
				setShowCreateProductPopup,
				toggleCreateProductPopup,
				showCreateProductPopup,
				color,
				handleColor,
				selectedCategory,
				handleCategoryChange,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };
