import { createContext, useState } from 'react';
import { getAccessToken } from '../services/productService';

const VanitysContext = createContext();

const VanitysProvider = ({ children }) => {
	const [showModalRegister, setShowModalRegister] = useState(false);
	const [showModalLogin, setShowModalLogin] = useState(false);
	const [showCookieBanner, setShowCookieBanner] = useState(true);
	const [showCreateProductPopup, setShowCreateProductPopup] = useState(false);
	const [showMissingFieldsPopup, setShowMissingFieldsPopup] = useState(false);
	const [formData, setFormData] = useState(null);
	const [color, setColor] = useState('#D9D9D9');
	const [apiResponse, setApiResponse] = useState(null);
	const [searchText, setSearchText] = useState('');

	const toggleModalRegister = () => setShowModalRegister((prev) => !prev);
	const toggleModalLogin = () => setShowModalLogin((prev) => !prev);
	const closeCookieBanner = () => setShowCookieBanner((prev) => !prev);
	const toggleCreateProductPopup = () =>
		setShowCreateProductPopup((prev) => !prev);
	const toggleMissingFieldsPopup = () =>
		setShowMissingFieldsPopup((prev) => !prev);

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchText(value);
	};

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
				toggleMissingFieldsPopup,
				showMissingFieldsPopup,
				setShowMissingFieldsPopup,
				formData,
				setFormData,
				searchText,
				setSearchText,
				handleSearch,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };
