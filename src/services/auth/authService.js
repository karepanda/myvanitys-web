// services/auth/authService.js - Front-end that coordinates authentication services
import { googleAuthAdapter } from './googleAuthAdapter';
import { loginService } from './loginService';
import { registerService } from './registerService';

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
    
    // Determine whether login or registration
    const authMode = state || 'login';
    console.log('authService.authMode: ', authMode)
    
    // Call the corresponding service
    if (authMode === 'register') {
      return await registerService.register(code, errorHandler);
    } else {
      return await loginService.authenticate(code, errorHandler);
    }
  }
};

// Utility function for authentication error handling
const handleAuthError = (error, errorHandler) => {
  console.error('Authentication error:', error);
  if (errorHandler) {
    if (!navigator.onLine) {
      const errorInfo = getErrorMessage('network', 'offline');
      errorHandler.showErrorMessage(
        errorInfo.message,
        errorInfo.title,
        errorInfo.type
      );
    } else {
      const errorInfo = getErrorMessage('auth', 'default');
      errorHandler.showErrorMessage(
        errorInfo.message,
        errorInfo.title,
        errorInfo.type
      );
    }
  }
};
