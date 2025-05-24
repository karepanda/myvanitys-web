import React, { useContext, useEffect, useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { VanitysContext } from '../../context';
import { authService } from '../../services/auth/authService';
import './Auth.css';

/**
 * Component exclusively responsible for processing the authentication callback
 * Handles both LOGIN (with auth) and REGISTER (user creation only) flows
 * @param {Object} props - Component props
 * @param {string} [props.redirectTo='/dashboard'] - Path to redirect after successful auth
 */
const AuthCallbackHandler = ({ redirectTo = '/dashboard' }) => {
  const { 
    updateAuthData, 
    errorHandler, 
    toggleNotification,
    setShowWelcomePopup,
    setShowModalLogin 
  } = useContext(VanitysContext);
  
  const [processingAuth, setProcessingAuth] = useState(true);
  const [processingMessage, setProcessingMessage] = useState('Processing authentication...');
  const hasProcessed = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const processAuthCode = async () => {
      // 🔥 PREVENT multiple executions
      if (hasProcessed.current) {
        console.log('🔄 Auth already processed, skipping...');
        return;
      }

      hasProcessed.current = true; 
      
      try {
        // 🔍 URL DEBUG
        console.log('🔍 === AUTH CALLBACK DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('URL search params:', window.location.search);
        
        const urlParams = new URLSearchParams(window.location.search);
        console.log('URL params:');
        for (const [key, value] of urlParams.entries()) {
          console.log(`  ${key}: ${value}`);
        }
        
        const state = urlParams.get('state');
        const isRegistration = state === 'register';
        
        console.log('🔍 Is Registration Flow?:', isRegistration);
        console.log('🔍 === END DEBUG ===');

        // Update processing message based on flow
        setProcessingMessage(isRegistration ? 'Creating your account...' : 'Logging you in...');

        console.log('🔄 Processing auth callback using authService...');

        // 🎯 USE EXISTING authService.handleAuthentication
        const result = await authService.handleAuthentication(errorHandler);

        // 🔥 Clean URL AFTER processing
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (!result) {
          console.error('Authentication/Registration failed - no data returned');
          
          // Use ErrorHandler for proper error display
          if (isRegistration) {
            errorHandler.handleApiError('auth', 'registrationFailed', 'User registration failed');
          } else {
            errorHandler.handleApiError('auth', 'withoutUserData', 'Login failed');
          }
          
          setProcessingAuth(false);
          return;
        }

        // 🎯 HANDLE REGISTRATION FLOW (User creation without login)
        if (isRegistration && result.requiresLogin) {
          console.log('✅ REGISTRATION SUCCESSFUL - User created!');
          console.log('👤 New user ID:', result.userId);
          
          // 🎉 Show WelcomePopup for successful registration
          console.log('🎉 Showing welcome popup for new user...');
          setShowWelcomePopup(true);
          
          // 🎉 Show success notification
          toggleNotification();
          
          console.log('🏠 Redirecting to home for login...');
          
          // Navigate to home after showing welcome popup
          setTimeout(() => {
            setProcessingAuth(false);
            navigate('/');
            
            // Show login modal after arriving at home
            setTimeout(() => {
              if (setShowModalLogin) {
                console.log('🔑 Opening login modal for new user...');
                setShowModalLogin(true);
              }
            }, 1500);
          }, 2000);
          
          return;
        }
        
        // 🎯 HANDLE LOGIN FLOW (Normal authentication with token)
        if (!result.token) {
          console.error('No token returned from authentication service');
          errorHandler.handleApiError('auth', 'withoutToken', 'Authentication token missing');
          setProcessingAuth(false);
          return;
        }

        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('Token received:', result.token.substring(0, 10) + '...');

        // Create auth data for context
        const authData = {
          token: result.token,
          user: {
            id: result.userId || result.id,
            name: result.name || result.displayName,
            email: result.email,
            profilePicture: result.profilePicture || result.picture
          },
          isNewUser: result.isNewUser || false,
          expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) 
        };

        console.log('🔥 Saving auth data and navigating to dashboard...');
        
        updateAuthData(authData);

        // Show welcome popup for new users (login flow)
        if (authData.isNewUser && !sessionStorage.getItem('welcomeShow')) {
          setShowWelcomePopup(true);
          sessionStorage.setItem('welcomeShow', 'true');
        }

        // 🎉 Show success notification
        toggleNotification();

        // Navigate to dashboard
        setTimeout(() => {
          console.log('🔥 Executing navigation to:', redirectTo);
          setProcessingAuth(false);
          navigate(redirectTo);
        }, 1000);

      } catch (error) {
        console.error('Error processing authentication:', error);
        
        // Use ErrorHandler for proper error display
        errorHandler.showGenericError();
        setProcessingAuth(false);
      }
    };

    processAuthCode();
  }, []); 

  // If we are processing authentication, show spinner
  if (processingAuth) {
    return (
      <div className="auth-callback">
        <div className="auth-callback__processing">
          <h2>Almost there!</h2>
          <div className="auth-callback__spinner"></div>
          <p>{processingMessage}</p>
        </div>
      </div>
    );
  }

  // If we reach here, there was an error but it was already handled by errorHandler
  return (
    <div className="auth-callback">
      <div className="auth-callback__error">
        <h2>Authentication error</h2>
        <p>An error occurred during the authentication process.</p>
        <button
          className="auth-callback__button"
          onClick={() => navigate('/')}
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export { AuthCallbackHandler };