import React, { useEffect, useContext, useRef } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';

const UserDashboard = () => {
  const {
    apiResponse,
    showWelcomePopup,
    setShowWelcomePopup,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    handleAuthentication
  } = useContext(VanitysContext);
  
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (hasAttemptedFetch.current) {
      console.log("Already attempted to fetch data, skipping");
      return;
    }
    
    hasAttemptedFetch.current = true;
    console.log("First fetch attempt, setting hasAttemptedFetch to true");
    
    // Clean modals if open
    if (setShowLoginModal) setShowLoginModal(false);
    if (setShowRegisterModal) setShowRegisterModal(false);
    
    // Execute authentication from the context
    const fetchData = async () => {
      try {
        // We use context handleAuthentication
        const userData = await handleAuthentication();
        
      } catch (error) {
        console.error("Error en autenticación:", error);
      }
    };

    fetchData();
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