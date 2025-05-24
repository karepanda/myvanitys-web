
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

    // 🔥 CORRECCIÓN: Usar los nombres consistentes
    if (setShowModalLogin) setShowModalLogin(false);
    if (setShowModalRegister) setShowModalRegister(false); 
    
    // 🔥 CAMBIO IMPORTANTE: NO intentar autenticación automática sin código
    // Solo verificar que no hay sesión y mostrar mensaje
    if (!apiResponse?.token) {
      console.log("🔐 No active session found. User needs to login manually.");
      // NO llamar handleAuthentication() aquí - causa el error 400
      return;
    }

    console.log("✅ Active session found:", {
      userId: apiResponse.user?.id,
      userName: apiResponse.user?.name,
      hasToken: !!apiResponse.token
    });

    if (apiResponse.isNewUser && !sessionStorage.getItem('welcomeShow')) {
      setShowWelcomePopup(true);
      sessionStorage.setItem('welcomeShow', 'true');
    }
  }, [authInitialized, apiResponse, setShowModalLogin, setShowModalRegister, setShowWelcomePopup]); // 🔥 DEPENDENCIAS LIMPIAS

  const closePopup = () => {
    setShowWelcomePopup(false);
    
    // 🔥 CORRECCIÓN: Usar los nombres consistentes
    if (setShowModalLogin) setShowModalLogin(false);      // ✅ Correcto
    if (setShowModalRegister) setShowModalRegister(false); // ✅ Correcto
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
      {/* 🔥 CAMBIO: Mostrar debug info para diagnosticar */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          right: 0, 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px',
          fontSize: '12px',
          zIndex: 9999 
        }}>
          <div>Auth Init: {authInitialized ? '✅' : '⏳'}</div>
          <div>Has Token: {apiResponse?.token ? '✅' : '❌'}</div>
          <div>User ID: {apiResponse?.user?.id || 'N/A'}</div>
        </div>
      )}

      {/* 🔥 MOSTRAR DASHBOARD SOLO SI HAY SESIÓN ACTIVA */}
      {apiResponse?.token ? (
        <Dashboard />
      ) : (
        <div className="no-session-message">
          <h2>Welcome to My Vanity's!</h2>
          <p>Please log in to access your dashboard.</p>
          <p>Use the Login button in the navigation bar to get started.</p>
          
          {/* 🔥 DEBUG: Mostrar más información */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>🐛 Debug Info</summary>
              <pre style={{ background: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
{JSON.stringify({
  authInitialized,
  apiResponse: apiResponse ? {
    hasToken: !!apiResponse.token,
    hasUser: !!apiResponse.user,
    userId: apiResponse.user?.id,
    userName: apiResponse.user?.name
  } : null
}, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
      {showWelcomePopup && <WelcomePopup onClose={closePopup} />}
    </>
  );
};

export { UserDashboard };