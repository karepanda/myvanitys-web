// src/context/index.js
import { createContext, useState } from 'react';
import { ErrorHandler } from '../utils/errorHandler';
import { authService } from '../services/auth/authService';
import { productFacade } from '../services/product/productFacade';

const VanitysContext = createContext();

const VanitysProvider = ({ children }) => {
	// UI States
	const [showModalRegister, setShowModalRegister] = useState(false);
	const [showModalLogin, setShowModalLogin] = useState(false);
	const [showCookieBanner, setShowCookieBanner] = useState(true);
	const [showCreateProductPopup, setShowCreateProductPopup] = useState(false);
	const [showMissingFieldsPopup, setShowMissingFieldsPopup] = useState(false);
	const [showProductPopup, setShowProductPopup] = useState(false);
	const [showCreateReviewPopup, setShowCreateReviewPopup] = useState(false);
	const [showUserProfile, setShowUserProfile] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const [showWelcomePopup, setShowWelcomePopup] = useState(false);
	
	// Data states
	const [apiResponse, setApiResponse] = useState(null);
	const [formData, setFormData] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [color, setColor] = useState('#D9D9D9');
	
	// Review states
	const [hoveredRating, setHoveredRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(0);
	const [reviewText, setReviewText] = useState('');
	
	// Loading state
	const [loading, setLoading] = useState(false);

	// Error handling states
	const [errorMessage, setErrorMessage] = useState('');
	const [errorTitle, setErrorTitle] = useState('Missing fields');
	const [errorType, setErrorType] = useState('warning');
	
	// Create ErrorHandler instance
	const errorHandler = new ErrorHandler(
		setShowMissingFieldsPopup,
		setErrorMessage,
		setErrorTitle,
		setErrorType
	);

	// UI Functions
	const toggleNotification = () => {
		setShowNotification(true);
		setTimeout(() => setShowNotification(false), 3000);
	};

	const toggleModalRegister = () => setShowModalRegister((prev) => !prev);
	const toggleModalLogin = () => setShowModalLogin((prev) => !prev);
	const closeCookieBanner = () => setShowCookieBanner((prev) => !prev);
	const toggleProductPopup = () => setShowProductPopup((prev) => !prev);

	const toggleCreateProductPopup = (product = null) => {
		setShowCreateProductPopup((prev) => !prev);
		setSelectedProduct(product);
	};

	const toggleMissingFieldsPopup = () => setShowMissingFieldsPopup((prev) => !prev);
	const toggleCreateReviewPopup = () => setShowCreateReviewPopup((prev) => !prev);
	const toggleUserProfile = () => setShowUserProfile((prev) => !prev);

	// Rating handlers
	const handleMouseOver = (rating) => {
		setHoveredRating(rating);
	};

	const handleMouseOut = () => {
		setHoveredRating(0);
	};

	const handleClick = (rating) => {
		setSelectedRating(rating);
	};

	// Search handler
	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchText(value);
	};

	// Submit review
	const handleSubmitCreateReviewProduct = (e) => {
		e.preventDefault();

		if (selectedRating === 0) {
			errorHandler.showValidationError('requiredFields');
			return;
		}

		if (!reviewText.trim()) {
			errorHandler.showValidationError('requiredFields');
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

	// Authentication
	const handleAuthentication = async () => {
		setLoading(true);
		try {
			const userData = await authService.handleAuthentication(errorHandler);
			setLoading(false);
			
			if (userData) {
				setApiResponse(userData);
				
				// Show welcome popup for new users
				if (userData.isNewUser && !sessionStorage.getItem('welcomeShow')) {
					setShowWelcomePopup(true);
					sessionStorage.setItem('welcomeShow', 'true');
				}
			}
			
			return userData;
		} catch (error) {
			console.error("Authentication error:", error);
			setLoading(false);
			return null;
		}
	};
	
	const initiateLogin = () => {
		authService.initiateGoogleAuth('login');
	};
	
	const initiateRegister = () => {
		authService.initiateGoogleAuth('register');
	};

	// Product functions via facade
	const createProduct = async (token, productData) => {
		setLoading(true);
		try {
			const newProduct = await productFacade.createProduct(token, productData, errorHandler);
			setLoading(false);
			if (newProduct) {
				toggleNotification();
			}
			return newProduct;
		} catch (error) {
			setLoading(false);
			console.error("Error creating product:", error);
			return null;
		}
	};
	
	const getProducts = async (token) => {
		setLoading(true);
		try {
			const products = await productFacade.getProducts(token, errorHandler);
			setLoading(false);
			return products;
		} catch (error) {
			setLoading(false);
			console.error("Error fetching products:", error);
			return null;
		}
	};
	
	const findProductsByUserId = async (token, userId) => {
		setLoading(true);
		try {
			const products = await productFacade.findProductsByUserId(token, userId, errorHandler);
			setLoading(false);
			return products;
		} catch (error) {
			setLoading(false);
			console.error("Error finding products by user:", error);
			return null;
		}
	};
	
	const getProductById = async (token, productId) => {
		setLoading(true);
		try {
			const product = await productFacade.getProductById(token, productId, errorHandler);
			setLoading(false);
			return product;
		} catch (error) {
			setLoading(false);
			console.error("Error fetching product by ID:", error);
			return null;
		}
	};
	
	const updateProduct = async (token, productId, productData) => {
		setLoading(true);
		try {
			const updatedProduct = await productFacade.updateProduct(token, productId, productData, errorHandler);
			setLoading(false);
			if (updatedProduct) {
				toggleNotification();
			}
			return updatedProduct;
		} catch (error) {
			setLoading(false);
			console.error("Error updating product:", error);
			return null;
		}
	};
	
	const deleteProduct = async (token, productId) => {
		setLoading(true);
		try {
			const success = await productFacade.deleteProduct(token, productId, errorHandler);
			setLoading(false);
			if (success) {
				toggleNotification();
			}
			return success;
		} catch (error) {
			setLoading(false);
			console.error("Error deleting product:", error);
			return false;
		}
	};
	
	const searchProducts = async (token, query, options = {}) => {
		setLoading(true);
		try {
			const products = await productFacade.searchProducts(token, query, options, errorHandler);
			setLoading(false);
			return products;
		} catch (error) {
			setLoading(false);
			console.error("Error searching products:", error);
			return null;
		}
	};

	return (
		<VanitysContext.Provider
			value={{
				// UI states
				showModalRegister,
				showModalLogin,
				showCookieBanner,
				showCreateProductPopup,
				showMissingFieldsPopup,
				showProductPopup,
				showCreateReviewPopup,
				showUserProfile,
				showNotification,
				showWelcomePopup,
				
				// UI setters
				setShowModalRegister,
				setShowModalLogin,
				setShowCookieBanner,
				setShowCreateProductPopup,
				setShowMissingFieldsPopup,
				setShowProductPopup,
				setShowCreateReviewPopup,
				setShowUserProfile,
				setShowNotification,
				setShowWelcomePopup,
				
				// UI toggles
				toggleModalRegister,
				toggleModalLogin,
				closeCookieBanner,
				toggleCreateProductPopup,
				toggleMissingFieldsPopup,
				toggleProductPopup,
				toggleCreateReviewPopup,
				toggleUserProfile,
				toggleNotification,
				
				// Data states
				apiResponse,
				formData,
				searchText,
				selectedProduct,
				selectedCategory,
				color,
				
				// Data setters
				setApiResponse,
				setFormData,
				setSearchText,
				setSelectedProduct,
				setSelectedCategory,
				
				// Reviews
				hoveredRating,
				selectedRating,
				reviewText,
				setHoveredRating,
				setSelectedRating,
				setReviewText,
				handleMouseOver,
				handleMouseOut,
				handleClick,
				handleSubmitCreateReviewProduct,
				
				// Search
				handleSearch,
				
				// Loading state
				loading,
				setLoading,
				
				// Error handling
				errorMessage,
				errorTitle,
				errorType,
				errorHandler,
				
				// Authentication
				handleAuthentication,
				initiateLogin,
				initiateRegister,
				
				// Products
				createProduct,
				getProducts,
				findProductsByUserId,
				getProductById,
				updateProduct,
				deleteProduct,
				searchProducts,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };