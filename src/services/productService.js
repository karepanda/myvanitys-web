import { getErrorMessage } from '../utils/errorMessages';

const API_URL = import.meta.env.VITE_API_URL;

const getAccessToken = async (errorHandler) => {
	console.log('getAccessToken called with errorHandler:', !!errorHandler);
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('code');
  const state = urlParams.get('state');

  if (!accessToken) {
    console.error('No access token found in the URL.');
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
        code: accessToken,
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

    return userData ? JSON.parse(userData) : {};
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