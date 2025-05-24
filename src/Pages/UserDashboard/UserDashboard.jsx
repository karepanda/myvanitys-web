// src/pages/UserDashboard/UserDashboard.jsx  
import React, { useEffect, useContext } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';
import './UserDashboard.css'; 

const UserDashboard = () => {
  const {
    apiResponse,
    authInitialized, 
    showWelcomePopup,
    setShowWelcomePopup,
    setShowModalLogin,        
    setShowModalRegister,
  } = useContext(VanitysContext);

  // 🐞 DEBUG: Component render info
  console.log("🎯 UserDashboard render:", {
    authInitialized,
    hasToken: !!apiResponse?.token,
    hasUser: !!apiResponse?.user,
    userId: apiResponse?.user?.id,
    userName: apiResponse?.user?.name
  });

  useEffect(() => {
    if (!authInitialized) {
      console.log("⏳ Waiting for auth initialization...");
      return;
    }

    console.log("🔍 Auth initialized, checking session...");

    if (setShowModalLogin) setShowModalLogin(false);
    if (setShowModalRegister) setShowModalRegister(false); 
    
    // ⚠️ WARNING: Do not attempt automatic login
    if (!apiResponse?.token) {
      console.log("🔐 No active session found. User needs to log in manually.");
      return;
    }

    // ✅ Active session detected
    console.log("✅ Active session found:", {
      userId: apiResponse.user?.id,
      userName: apiResponse.user?.name,
      hasToken: !!apiResponse.token
    });

    // 🎉 Show welcome popup for new users
    if (apiResponse.isNewUser && !sessionStorage.getItem('welcomeShow')) {
      setShowWelcomePopup(true);
      sessionStorage.setItem('welcomeShow', 'true');
    }
  }, [
    authInitialized,
    apiResponse,
    setShowModalLogin,
    setShowModalRegister,
    setShowWelcomePopup
  ]); 

  const closePopup = () => {
    setShowWelcomePopup(false);
    if (setShowModalLogin) setShowModalLogin(false);
    if (setShowModalRegister) setShowModalRegister(false);
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
      {/* ✅ Show dashboard only when logged in */}
      {apiResponse?.token ? (
        <Dashboard />
      ) : (
        <div className="no-session-message">
          <h2>Welcome to My Vanity's!</h2>
          <p>Please log in to access your dashboard.</p>
          <p>Use the login button in the navigation bar to get started.</p>
        </div>
      )}

      {/* 🎉 Show welcome popup if needed */}
      {showWelcomePopup && <WelcomePopup onClose={closePopup} />}
    </>
  );
};

export { UserDashboard };
