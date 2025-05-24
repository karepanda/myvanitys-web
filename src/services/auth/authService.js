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
    console.log('🔍 === authService.handleAuthentication START ===');
    
    const { code, state } = googleAuthAdapter.getAuthorizationCode();
    
    console.log('🔍 Authorization data from URL:');
    console.log('- Code present:', !!code);
    console.log('- Code preview:', code ? code.substring(0, 20) + '...' : 'null');
    console.log('- State value:', state);
    console.log('- State type:', typeof state);
    
    if (!code) {
      console.error('❌ No authorization code found in URL');
      console.error('❌ Current URL:', window.location.href);
      console.error('❌ URL search params:', window.location.search);
      
      if (errorHandler) {
        const errorInfo = getErrorMessage('auth', 'noToken');
        console.error('❌ Showing error message:', errorInfo);
        errorHandler.showErrorMessage(
          errorInfo.message,
          errorInfo.title,
          errorInfo.type
        );
      }
      return null;
    }
    
    const authMode = state || 'login';
    console.log('🔍 Determined auth mode:', authMode);
    
    let result = null;
    
    if (authMode === 'register') {
      console.log('🎯 === CALLING REGISTER SERVICE ===');
      try {
        result = await registerService.register(code, errorHandler);
        console.log('🔍 Register service result:', result);
        console.log('🔍 Register result type:', typeof result);
        console.log('🔍 Register result keys:', result ? Object.keys(result) : 'null');
      } catch (registerError) {
        console.error('❌ Register service threw error:', registerError);
        result = null;
      }
    } else {
      console.log('🎯 === CALLING LOGIN SERVICE ===');
      try {
        result = await loginService.authenticate(code, errorHandler);
        console.log('🔍 Login service result:', result);
        console.log('🔍 Login result type:', typeof result);
        console.log('🔍 Login result keys:', result ? Object.keys(result) : 'null');
      } catch (loginError) {
        console.error('❌ Login service threw error:', loginError);
        result = null;
      }
    }
    
    console.log('🔍 === authService.handleAuthentication END ===');
    console.log('🔍 Final result:', result);
    console.log('🔍 Will return null?:', !result);
    
    return result;
  }
};