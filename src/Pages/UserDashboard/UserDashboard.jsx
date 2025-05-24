// src/pages/UserDashboard/UserDashboard.jsx
import React, { useEffect, useContext } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';

const UserDashboard = () => {
  const {
    apiResponse,
    authInitialized, 
    showWelcomePopup,
    setShowWelcomePopup,
    showModalLogin,
    setShowModalLogin,
    showModalRegister,
    setShowModalRegister,
    handleAuthentication
  } = useContext(VanitysContext);

  useEffect(() => {
    if (!authInitialized) {
      console.log("⏳ Waiting for auth initialization...");
      return;
    }

    console.log("🔍 Auth initialized, checking session...");

    // Clean modals if open
    if (setShowLoginModal) setShowLoginModal(false);
    if (setShowRegisterModal) setShowRegisterModal(false);
    
  
    if (!apiResponse?.token) {
      console.log("🔐 No active session found, attempting authentication...");
      
      const fetchData = async () => {
        try {
          await handleAuthentication();
        } catch (error) {
          console.error("❌ Error in authentication:", error);
        }
      };

      fetchData();
    } else {
      console.log("✅ Active session found:", {
        userId: apiResponse.user?.id,
        userName: apiResponse.user?.name,
        hasToken: !!apiResponse.token
      });

      if (apiResponse.isNewUser && !sessionStorage.getItem('welcomeShow')) {
        setShowWelcomePopup(true);
        sessionStorage.setItem('welcomeShow', 'true');
      }
    }
  }, [authInitialized, apiResponse]);

  const closePopup = () => {
    setShowWelcomePopup(false);
    
    if (setShowLoginModal) setShowLoginModal(false);
    if (setShowRegisterModal) setShowRegisterModal(false);
  };


  if (!authInitialized) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Initializing application...</p>
      </div>
    );
  }

  return (
    <>
      {apiResponse && <Dashboard />}
      {showWelcomePopup && <WelcomePopup onClose={closePopup} />}
    </>
  );
};

export { UserDashboard };