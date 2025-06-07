// services/auth/registerService.js
import { apiUtils } from '../../utils/apiUtils';
import { dateUtils } from '../../utils/dateUtils';

export const registerService = {
  register: async (authCode, errorHandler) => {
    
    const API_URL = import.meta.env.VITE_API_URL;

    console.log('Variables Environment:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
      NODE_ENV: import.meta.env.MODE || import.meta.env.NODE_ENV,
      hostname: window.location.hostname
    });
    
    try {
      const isoDate = dateUtils.getCurrentUTCISODate();
      
      const payload = {
        authCode: authCode,
        authProvider: "google",
        registrationDate: isoDate
      };
      
      console.log("Payload being sent:", JSON.stringify(payload));
      const authUrl = `${API_URL}/auth/register`;
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          ...apiUtils.getCommonHeaders(),
          'Authorization': `Bearer ${authCode}`
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Registration failed with status:', response.status);
        console.error('Error response body:', errorText);
        
        if (errorHandler) {
          errorHandler.handleApiError('auth', response.status, errorText);
        }
        return null;
      }

      const userData = await response.text();
      
      if (!userData) {
        console.error('Empty response received from server');
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'emptyResponse', 'Server returned empty response');
        }
        return null;
      }
      
      // JSON PARSING
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        console.error('Failed to parse this text:', userData);
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'parseError', 'Invalid JSON response');
        }
        return null;
      }
      
      if (!parsedUserData.userId) {
        console.error('No userId in response - registration may have failed');
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'noUserId', 'User ID not returned');
        }
        return null;
      }
    
      
      const registrationResult = {
        userId: parsedUserData.userId,
        email: parsedUserData.email || null,
        name: parsedUserData.name || null,
        isNewUser: true,
        registrationSuccessful: true,
        requiresLogin: true // Flag to indicate you need to login
      };
      
      return registrationResult;
      
    } catch (error) {
      console.error(' Registration error:', error);
      console.error(' Error name:', error.name);
      console.error(' Error message:', error.message);
      console.error(' Error stack:', error.stack);
      
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError();
        } else {
          errorHandler.showGenericError();
        }
      }
      return null;
    }
  }
};