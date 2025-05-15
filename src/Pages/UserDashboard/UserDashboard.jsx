import React, { useEffect, useContext, useRef } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';
import { authService } from '../../services/auth/authService';

const UserDashboard = () => {
  const {
    setApiResponse,
    apiResponse,
    showWelcomePopup,
    setShowWelcomePopup,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    errorHandler
  } = useContext(VanitysContext);
  
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (hasAttemptedFetch.current) {
      console.log("Already attempted to fetch data, skipping");
      return;
    }
    
    hasAttemptedFetch.current = true;
    console.log("First fetch attempt, setting hasAttemptedFetch to true");
    
    if (setShowLoginModal) setShowLoginModal(false);
    if (setShowRegisterModal) setShowRegisterModal(false);
    
    const fetchAuthData = async () => {
      try {
        const userData = await authService.handleAuthentication(errorHandler);
        console.log("Got user data:", userData);
        
        if (userData) {
          setApiResponse(userData);
          
          // Only show welcome popup for new registrations
          if (userData.isNewUser && !sessionStorage.getItem('welcomeShow')) {
            if (setShowLoginModal) setShowLoginModal(false);
            if (setShowRegisterModal) setShowRegisterModal(false);
            
            setShowWelcomePopup(true);
            sessionStorage.setItem('welcomeShow', 'true');
          }
        }
      } catch (error) {
        console.error("Error in fetchAuthData:", error);
      }
    };

    fetchAuthData();
  }, []); 

  const closePopup = () => {
    setShowWelcomePopup(false);
    
    if (setShowLoginModal) setShowLoginModal(false);
    if (setShowRegisterModal) setShowRegisterModal(false);
  };

  return (
    <>
      {apiResponse && <Dashboard />}
      {showWelcomePopup && <WelcomePopup onClose={closePopup} />}
    </>
  );
};

export { UserDashboard };