// src/components/Auth/AuthCallbackHandler.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VanitysContext } from '../../context';
import { loginService } from '../../services/auth/loginService';
import './Auth.css';

/**
 * Component exclusively responsible for processing the authentication callback
 * Its sole responsibility is to process the authorization code and redirect
 *
 * @param {Object} props - Component properties
 * @param {string} props.redirectTo - Path to redirect to after successful authentication
 */
const AuthCallbackHandler = ({ redirectTo = '/dashboard' }) => {
  const { setApiResponse, errorHandler } = useContext(VanitysContext);
  const [processingAuth, setProcessingAuth] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuthCode = async () => {
      try {
        // Get authorization code from the URL
        const urlParams = new URLSearchParams(location.search);
        const authCode = urlParams.get('code');
        const state = urlParams.get('state'); // 'login' or 'register'

        console.log('Processing auth callback...');
        console.log('State:', state);
        console.log('Auth code present:', !!authCode);

        // Clean the URL to avoid repeated processing
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (!authCode) {
          console.error('No authentication code found in URL');
          errorHandler.handleApiError('auth', 'default', 'No authentication code found');
          setProcessingAuth(false);
          return;
        }

        // Authenticate using the login service
        const userData = await loginService.authenticate(authCode, errorHandler);

        if (!userData) {
          console.error('Authentication failed - no user data returned');
          errorHandler.handleApiError('auth', 'withoutUserData');
          setProcessingAuth(false);
          return;
        }

        // Verify that the token is present
        if (!userData.token) {
          console.error('No token returned from authentication service');
          errorHandler.handleApiError('auth', 'withoutToken');
          setProcessingAuth(false);
          return;
        }

        console.log('Authentication successful!');
        console.log('Token received:', userData.token.substring(0, 10) + '...');

        // Create object with the structure expected by the context
        const authData = {
          token: userData.token,
          user: {
            id: userData.userId || userData.id,
            name: userData.name || userData.displayName,
            email: userData.email,
            profilePicture: userData.profilePicture || userData.picture
          },
          isNewUser: userData.isNewUser || false
        };

        // Save to localStorage for persistence
        localStorage.setItem('vanitys_auth', JSON.stringify(authData));

        // Update context
        setApiResponse(authData);

        // Redirect to the dashboard after a short pause
        setTimeout(() => {
          navigate(redirectTo);
        }, 500);

      } catch (error) {
        console.error('Error processing authentication:', error);
        errorHandler.showGenericError();
        setProcessingAuth(false);
      }
    };

    processAuthCode();
  }, [location, navigate, redirectTo, setApiResponse, errorHandler]);

  // If we are processing authentication, show spinner
  if (processingAuth) {
    return (
      <div className="auth-callback">
        <div className="auth-callback__processing">
          <h2>Processing authentication</h2>
          <div className="auth-callback__spinner"></div>
          <p>Please wait while we complete the login...</p>
        </div>
      </div>
    );
  }

  // If we reach here, there was an error but it was already handled by errorHandler
  // Show a button to return to the home page
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