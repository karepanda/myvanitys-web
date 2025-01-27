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
	const [showProductPopup, setShowProductPopup] = useState(false);
	const [showCreateReviewPopup, setShowCreateReviewPopup] = useState(false);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(0);
	const [reviewText, setReviewText] = useState('');
	const [showUserProfile, setShowUserProfile] = useState(false);
	const [showNotification, setShowNotification] = useState(false);

	const toggleNotification = () => {
		setShowNotification(true);
		setTimeout(() => setShowNotification(false), 3000); // Ocultar después de 3 segundos
	};

	const toggleModalRegister = () => setShowModalRegister((prev) => !prev);
	const toggleModalLogin = () => setShowModalLogin((prev) => !prev);
	const closeCookieBanner = () => setShowCookieBanner((prev) => !prev);
	const toggleProductPopup = () => setShowProductPopup((prev) => !prev);
	const toggleCreateProductPopup = () =>
		setShowCreateProductPopup((prev) => !prev);
	const toggleMissingFieldsPopup = () =>
		setShowMissingFieldsPopup((prev) => !prev);
	const toggleCreateReviewPopup = () =>
		setShowCreateReviewPopup((prev) => !prev);
	const toggleUserProfile = () => setShowUserProfile((prev) => !prev);

	const handleMouseOver = (rating) => {
		setHoveredRating(rating);
	};

	const handleMouseOut = () => {
		setHoveredRating(0);
	};

	const handleClick = (rating) => {
		setSelectedRating(rating);
	};

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchText(value);
	};

	const handleSubmitCreateReviewProduct = (e) => {
		e.preventDefault();

		if (selectedRating === 0) {
			setShowMissingFieldsPopup(true);
			return;
		}

		if (!reviewText.trim()) {
			setShowMissingFieldsPopup(true);
			return;
		}

		const reviewData = {
			rating: selectedRating,
			text: reviewText,
		};

		console.log('Review submitted:', reviewData);

		setSelectedRating(0);
		setReviewText('');
		toggleCreateReviewPopup();
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
				showProductPopup,
				toggleProductPopup,
				showCreateReviewPopup,
				toggleCreateReviewPopup,
				hoveredRating,
				setHoveredRating,
				selectedRating,
				setSelectedRating,
				reviewText,
				setReviewText,
				handleMouseOver,
				handleMouseOut,
				handleClick,
				handleSubmitCreateReviewProduct,
				toggleUserProfile,
				showUserProfile,
				showNotification,
				setShowNotification,
				toggleNotification,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };
