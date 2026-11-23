// services/auth/registerService.js
import {apiUtils} from '../../utils/apiUtils';
import {dateUtils} from '../../utils/dateUtils';

export const registerService = {
  register: async (authCode, errorHandler) => {
    
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const isoDate = dateUtils.getCurrentUTCISODate();
      
      const payload = {
        authCode: authCode,
        authProvider: "google",
        registrationDate: isoDate
      };

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
      } catch {
        console.error('JSON parsing failed');
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


  return {
        userId: parsedUserData.userId,
        email: parsedUserData.email || null,
        name: parsedUserData.name || null,
        isNewUser: true,
        registrationSuccessful: true,
        requiresLogin: true // Flag to indicate you need to login
      };
      
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
