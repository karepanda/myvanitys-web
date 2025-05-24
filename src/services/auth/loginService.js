// services/auth/loginService.js
import { apiUtils } from '../../utils/apiUtils';

export const loginService = {
  authenticate: async (authCode, errorHandler) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    const authUrl = `${API_URL}/auth/google`;
    console.log('Auth URL being used:', authUrl);
    
    try {
      if (!authCode) {
        console.error('No auth code provided to authenticate');
        if (errorHandler) {
          errorHandler.showErrorMessage(
            'No se proporcionó un código de autenticación',
            'Error de autenticación',
            'error'
          );
        }
        return null;
      }
      
      // Request authentication
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          ...apiUtils.getCommonHeaders(),
          'Authorization': `Bearer ${authCode}`
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`Authentication error (${response.status}): ${errorText}`);
        
        if (errorHandler) {
          errorHandler.handleApiError('auth', response.status, errorText);
        }
        return null;
      }

      // Get response data
      let userData = null;
      try {
        const responseText = await response.text();
        userData = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error('Error parsing authentication response:', parseError);
        if (errorHandler) {
          errorHandler.showGenericError();
        }
        return null;
      }
      
      if (!userData || !userData.token) {
        console.error('Invalid response from authentication service:', userData);
        if (errorHandler) {
          errorHandler.showErrorMessage(
            'La respuesta del servicio de autenticación no contiene un token válido',
            'Error de autenticación',
            'error'
          );
        }
        return null;
      }
      
      console.log('Authentication successful for user:', userData.email || 'Unknown');
      console.log('Token received:', userData.token.substring(0, 10) + '...');
      
      return userData;
    } catch (error) {
      console.error('Authentication error:', error);
      
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