// src/context/index.js
import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { ErrorHandler } from '../utils/errorHandler';
import { authService } from '../services/auth/authService';
import { productFacade } from '../services/product/productFacade';

const VanitysContext = createContext();

const VanitysProvider = ({ children }) => {
	// UI States
	const [showModalRegister, setShowModalRegister] = useState(false);
	const [showModalLogin, setShowModalLogin] = useState(false);
	const [showCookieBanner, setShowCookieBanner] = useState(() => {
		return sessionStorage.getItem('cookieBannerClosed') !== 'true';
	});
	const [showCreateProductPopup, setShowCreateProductPopup] = useState(false);
	const [showMissingFieldsPopup, setShowMissingFieldsPopup] = useState(false);
	const [showProductPopup, setShowProductPopup] = useState(false);
	const [showCreateReviewPopup, setShowCreateReviewPopup] = useState(false);
	const [showUserProfile, setShowUserProfile] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const [showWelcomePopup, setShowWelcomePopup] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Product Upgrade Trigger
	const [productsRefreshTrigger, setProductsRefreshTrigger] = useState(0);

	// Data states
	const [apiResponse, setApiResponse] = useState(null);
	const [formData, setFormData] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [notificationType, setNotificationType] = useState('add');

	// Review states
	const [hoveredRating, setHoveredRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(0);
	const [reviewText, setReviewText] = useState('');
	const [reviewProductId, setReviewProductId] = useState(null);

	// Loading state
	const [loading, setLoading] = useState(false);
	const [authInitialized, setAuthInitialized] = useState(false);

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

	// Computed values for authentication and token
	const isAuthenticated = !!apiResponse?.token;
	const userToken = apiResponse?.token || null;

	// utomatic upload from localStorage
	useEffect(() => {
		const loadSavedAuth = () => {
			try {
				const savedAuth = localStorage.getItem('vanitys_auth');

				if (savedAuth) {
					const authData = JSON.parse(savedAuth);

					// Validate structure and expiry
					if (authData?.token && authData?.user?.id) {
						// Check for expiration (if expiresAt)
						if (authData.expiresAt && Date.now() > authData.expiresAt) {
							localStorage.removeItem('vanitys_auth');
						} else {
							setApiResponse(authData);
						}
					} else {
						localStorage.removeItem('vanitys_auth');
					}
				}
			} catch (error) {
				console.error('Error loading saved auth:', error);
				localStorage.removeItem('vanitys_auth');
			} finally {
				setAuthInitialized(true);
			}
		};

		loadSavedAuth();
	}, []);

	const logout = () => {
		setApiResponse(null);
		localStorage.removeItem('vanitys_auth');
		sessionStorage.removeItem('welcomeShow');

		// Clear user-related statuses
		setSelectedProduct(null);
		setFormData(null);
		setSearchText('');

		// Close modals
		setShowUserProfile(false);
		setShowWelcomePopup(false);

		// Redirect to home
		window.location.href = '/';
	};

	const updateAuthData = (authData) => {
		if (!authData.expiresAt) {
			authData.expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
		}

		setApiResponse(authData);
		localStorage.setItem('vanitys_auth', JSON.stringify(authData));
	};

	// UI Functions
	const showNotificationTemporarily = (type = 'add') => {
		setNotificationType(type);
		setShowNotification(true);
		setTimeout(() => setShowNotification(false), 3000);
	};

	const toggleModalRegister = () => setShowModalRegister((prev) => !prev);
	const toggleModalLogin = () => setShowModalLogin((prev) => !prev);
	const closeCookieBanner = () => {
		sessionStorage.setItem('cookieBannerClosed', 'true');
		setShowCookieBanner(false);
	};
	const toggleProductPopup = (product = null) => {
		setSelectedProduct(product);
		setShowProductPopup(!!product);
	};
	const toggleCreateProductPopup = (product = null) => {
		setShowCreateProductPopup((prev) => !prev);
		setSelectedProduct(product);
	};

	const toggleMissingFieldsPopup = () =>
		setShowMissingFieldsPopup((prev) => !prev);
	const toggleCreateReviewPopup = (productId = null) => {
		setReviewProductId(productId);
		setShowCreateReviewPopup((prev) => !prev);
	};

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

		setSelectedRating(0);
		setReviewText('');
		toggleCreateReviewPopup();
	};

	const handleAuthentication = async () => {
		// If there is already an active session, do not re-authenticate.
		if (apiResponse?.token) {
			return apiResponse;
		}

		setLoading(true);
		try {
			const userData = await authService.handleAuthentication(errorHandler);
			setLoading(false);

			if (userData) {
				updateAuthData(userData);

				// Show welcome popup for new users
				if (userData.isNewUser && !sessionStorage.getItem('welcomeShow')) {
					setShowWelcomePopup(true);
					sessionStorage.setItem('welcomeShow', 'true');
				}
			}

			return userData;
		} catch (error) {
			console.error('Error creating product:', error);
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

	const createProduct = async (token, productData) => {
		setLoading(true);
		try {
			const newProduct = await productFacade.createProduct(
				token,
				productData,
				errorHandler
			);
			setLoading(false);

			if (newProduct) {
				showNotificationTemporarily('add');
				setProductsRefreshTrigger((prev) => prev + 1);
			}
			return newProduct;
		} catch (error) {
			console.error('Error creating product:', error);
			setLoading(false);
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
			console.error('Error finding products by user ID:', error);
			setLoading(false);
			return null;
		}
	};

	const findProductsByUserId = async (token, userId) => {
		setLoading(true);
		try {
			const products = await productFacade.findProductsByUserId(
				token,
				userId,
				errorHandler
			);
			setLoading(false);
			return products;
		} catch (error) {
			console.error('Error getting product by ID:', error);
			setLoading(false);
			return null;
		}
	};

	const getProductById = async (token, productId) => {
		setLoading(true);
		try {
			const product = await productFacade.getProductById(
				token,
				productId,
				errorHandler
			);
			setLoading(false);
			return product;
		} catch (error) {
			console.error('Error updating product:', error);
			setLoading(false);
			return null;
		}
	};

	const updateProduct = async (token, productId, productData) => {
		setLoading(true);
		try {
			const updatedProduct = await productFacade.updateProduct(
				token,
				productId,
				productData,
				errorHandler
			);
			setLoading(false);

			if (updatedProduct) {
				showNotificationTemporarily('update');
				setProductsRefreshTrigger((prev) => prev + 1);
			}
			return updatedProduct;
		} catch (error) {
			console.error('Error updating product:', error);
			setLoading(false);
			return null;
		}
	};

	const deleteProduct = async (token, productId) => {
		setLoading(true);
		try {
			const success = await productFacade.deleteProduct(
				token,
				productId,
				errorHandler
			);
			setLoading(false);

			if (success) {
				showNotificationTemporarily('delete');
				setProductsRefreshTrigger((prev) => prev + 1);
			}
			return success;
		} catch (error) {
			console.error('Error deleting product:', error);
			setLoading(false);
			return false;
		}
	};

	const searchProducts = async (token, query, options = {}) => {
		setLoading(true);
		try {
			const products = await productFacade.searchProducts(
				token,
				query,
				options,
				errorHandler
			);
			setLoading(false);
			return products;
		} catch (error) {
			console.error('Error getting products with collection status:', error);
			setLoading(false);
			return null;
		}
	};

	const getAllProductsWithCollectionStatus = async (token) => {
		setLoading(true);
		try {
			const products =
				await productFacade.getAllProductsWithCollectionStatus(
					token,
					errorHandler
				);
			setLoading(false);
			return products;
		} catch (error) {
			console.error('Error in handleAuthentication:', error);
			setLoading(false);
			return null;
		}
	};

	const addExistingProductToVanity = async (token, existingProduct) => {
		setLoading(true);
		try {
			console.log(
				`🔄 Adding existing product ${existingProduct.name} (ID: ${existingProduct.id}) to user vanity...`
			);

			const result = await productFacade.addProductToUserVanity(
				token,
				existingProduct.id,
				errorHandler
			);

			setLoading(false);

			if (result) {
				showNotificationTemporarily();
				setProductsRefreshTrigger((prev) => prev + 1);
				console.log(
					`Product ${existingProduct.name} added to vanity successfully`
				);
				return true;
			} else {
				return false;
			}
		} catch (error) {
			setLoading(false);
			console.error('Error adding existing product to vanity:', error);
			if (errorHandler) {
				errorHandler.showGenericError();
			}
			return false;
		}
	};

	// New global state
	const [isAdding, setIsAdding] = useState(false);

	// Global handler function
	const handleAddToVanity = async (product) => {
		const token = apiResponse?.token;

		if (!token) {
			errorHandler.showErrorMessage(
				'You are not authenticated. Please log in to continue.',
				'Authentication error',
				'error'
			);
			return;
		}

		setIsAdding(true);

		try {
			const success = await addExistingProductToVanity(token, product);

			if (!success) {
				throw new Error('Failed to add product to vanity');
			}

			showNotificationTemporarily('add');
		} catch (error) {
			errorHandler.showGenericError();
		} finally {
			setIsAdding(false);
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
				showNotificationTemporarily,

				// Data states
				apiResponse,
				formData,
				searchText,
				selectedProduct,
				selectedCategory,

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
				authInitialized,

				// Error handling
				errorMessage,
				errorTitle,
				errorType,
				errorHandler,

				// Authentication
				handleAuthentication,
				initiateLogin,
				initiateRegister,
				logout,
				updateAuthData,
				isAuthenticated,
				userToken,

				// Products
				createProduct,
				getProducts,
				findProductsByUserId,
				getProductById,
				updateProduct,
				deleteProduct,
				searchProducts,
				getAllProductsWithCollectionStatus,
				addExistingProductToVanity,
				productsRefreshTrigger,
				setProductsRefreshTrigger,
				handleAddToVanity,
				isAdding,
				setIsAdding,
				showDeleteModal,
				setShowDeleteModal,
				reviewProductId,
				setReviewProductId,
				notificationType,
				setNotificationType,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };
