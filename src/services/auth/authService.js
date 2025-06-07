// services/auth/authService.js
import { googleAuthAdapter } from './googleAuthAdapter';
import { loginService } from './loginService';
import { registerService } from './registerService';
import { getErrorMessage } from '../../utils/errorMessages';

export const authService = {
  initiateGoogleAuth: (authMode) => {

    googleAuthAdapter.redirectToGoogleOAuth(
      import.meta.env.VITE_REDIRECT_URI,
      import.meta.env.VITE_GOOGLE_CLIENT_ID,
      authMode
    );
  },
  
  handleAuthentication: async (errorHandler) => {

    
    const { code, state } = googleAuthAdapter.getAuthorizationCode();
    

    
    if (!code) {
      console.error('No authorization code found in URL');
      console.error('Current URL:', window.location.href);
      console.error('URL search params:', window.location.search);
      
      if (errorHandler) {
        const errorInfo = getErrorMessage('auth', 'noToken');
        console.error('Showing error message:', errorInfo);
        errorHandler.showErrorMessage(
          errorInfo.message,
          errorInfo.title,
          errorInfo.type
        );
      }
      return null;
    }
    
    const authMode = state || 'login';
    
    let result = null;
    
    if (authMode === 'register') {
      try {
        result = await registerService.register(code, errorHandler);
      } catch (registerError) {
        result = null;
      }
    } else {
      try {
        result = await loginService.authenticate(code, errorHandler);
      } catch (loginError) {
        result = null;
      }
    }

    return result;
  }
};