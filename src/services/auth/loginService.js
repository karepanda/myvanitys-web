// services/auth/loginService.js
import { getErrorMessage } from '../../utils/errorMessages';
  
export const loginService = {
  authenticate: async (authCode, errorHandler) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCode}`,
          'X-Request-Id': 'd2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8',
          'X-Flow-Id': '123e4567-e89b-12d3-a456-426614174000',
          'User-Agent': 'MyVanitysApp/1.0',
          'Accept-Language': 'en-US',
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        if (errorHandler) {
          errorHandler.handleApiError('auth', response.status, errorText);
        }
        return null;
      }

      const userData = await response.text();
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      handleAuthError(error, errorHandler);
      return null;
    }
  }
};
