// services/auth/authService.js
import { googleAuthAdapter } from './googleAuthAdapter';
import { loginService } from './loginService';
import { registerService } from './registerService';
import { getErrorMessage } from '../../utils/errorMessages';

export const authService = {
  initiateGoogleAuth: (authMode) => {
    console.log("authService.authMode: ", authMode);
    googleAuthAdapter.redirectToGoogleOAuth(
      import.meta.env.VITE_REDIRECT_URI,
      import.meta.env.VITE_GOOGLE_CLIENT_ID,
      authMode
    );
  },
  
  handleAuthentication: async (errorHandler) => {
    const { code, state } = googleAuthAdapter.getAuthorizationCode();
    
    if (!code) {
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
    
    const authMode = state || 'login';
    
    if (authMode === 'register') {
      return await registerService.register(code, errorHandler);
    } else {
      return await loginService.authenticate(code, errorHandler);
    }
  }
};