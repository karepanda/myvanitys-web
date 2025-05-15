// services/productService.js
import { getErrorMessage } from '../../utils/errorMessages';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Retrieves the access token and authenticates the user using the Google authorization code
 * @param {Object} errorHandler - Error handler to display messages
 * @param {string} authMode - Authentication mode ('login' or 'register')
 * @returns {Object|null} - User data or null in case of error
 */
const getAccessToken = async (errorHandler, authMode = 'login') => {
  console.log('getAccessToken called with authMode:', authMode);
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get('code');
  const state = urlParams.get('state');

  // Check if there is a mode parameter in the URL that overrides the passed parameter
  const urlAuthMode = urlParams.get('authMode');
  if (urlAuthMode && ['login', 'register'].includes(urlAuthMode)) {
    authMode = urlAuthMode;
    console.log('Auth mode overridden from URL:', authMode);
  }

  if (!authorizationCode) {
    console.error('No authorization code found in the URL.');
    if (errorHandler) {
      const errorInfo = getErrorMessage('auth', 'noToken');
      errorHandler.showErrorMessage(
        errorInfo.message,
        errorInfo.title,
        errorInfo.type
      );
    }
    return null;
  }

  try {
    // Determine the endpoint based on the authentication mode
    const endpoint = authMode === 'register' 
      ? `${API_URL}/api/v1/auth/register/google` 
      : `${API_URL}/api/v1/auth/google`;
    
    console.log(`Using endpoint for ${authMode}:`, endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorizationCode}`,
        'X-Request-Id': 'd2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8',
        'X-Flow-Id': '123e4567-e89b-12d3-a456-426614174000',
        'User-Agent': 'MyVanitysApp/1.0',
        'Accept-Language': 'en-US',
      },
      body: JSON.stringify({
        code: authorizationCode,
        // We can include the authentication mode in the body as well if useful
        authMode: authMode,
      }),
    });

    // Log the response status
    console.log('API response received, status:', response.status);

    if (!response.ok) {
      // Instead of throwing a generic error, handle it with our error handler
      const errorText = await response.text().catch(() => '');
      
      if (errorHandler) {
        // Use our error handler to display an appropriate message
        errorHandler.handleApiError('auth', response.status, errorText);
      }
      
      console.error(`Authentication error: ${response.status}`);
      return null;
    }

    const userData = await response.text();

    if (!userData) {
      if (errorHandler) {
        const errorInfo = getErrorMessage('auth', 'noUserData');
        errorHandler.showErrorMessage(
          errorInfo.message,
          errorInfo.title,
          errorInfo.type
        );
      }
      return null;
    }

    const parsedUserData = userData ? JSON.parse(userData) : {};
    
    // If it is a successful registration, we can add a flag to indicate it
    if (authMode === 'register') {
      parsedUserData.isNewUser = true;
    }
    
    return parsedUserData;
  } catch (error) {
    console.error('Authentication error:', error);
    if (errorHandler) {
      // Check if we're offline
      if (!navigator.onLine) {
        const errorInfo = getErrorMessage('network', 'offline');
        errorHandler.showErrorMessage(
          errorInfo.message,
          errorInfo.title,
          errorInfo.type
        );
      } else {
        // Default error
        const errorInfo = getErrorMessage('auth', 'default');
        errorHandler.showErrorMessage(
          errorInfo.message,
          errorInfo.title,
          errorInfo.type
        );
      }
    }
    return null;
  }
};

export { getAccessToken };