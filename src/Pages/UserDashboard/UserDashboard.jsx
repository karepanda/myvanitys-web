// src/pages/UserDashboard/UserDashboard.jsx
import React, { useEffect, useContext, useState, useRef } from 'react';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { useLocation } from 'react-router';
import { VanitysContext } from '../../context';
import { WelcomePopup } from '../../components/WelcomePopup/WelcomePopup';

const UserDashboard = () => {
  const {
    getAccessToken,
    setApiResponse,
    apiResponse,
    showWelcomePopup,
    setShowWelcomePopup,
    // Si estas props existen en tu contexto, deberías agregarlas aquí
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    errorHandler
  } = useContext(VanitysContext);
  
  const location = useLocation();
  
  // Use a ref to track if data has been fetched - OUTSIDE of useEffect
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    // Only try to fetch data once - check this outside the fetchData function
    if (hasAttemptedFetch.current) {
      console.log("Already attempted to fetch data, skipping");
      return; // Don't even define the fetchData function
    }
    
    hasAttemptedFetch.current = true;
    console.log("First fetch attempt, setting hasAttemptedFetch to true");
    
    // Determine the authentication mode
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state'); 
    const routerState = location.state?.authMode;
    const authMode = stateParam || routerState || 'login';
    
    console.log("Determined auth mode:", authMode);
    
    // Asegurarse de que no se muestren otros popups cuando llegamos aquí
    // Esto es importante si los estados de los popups se mantienen en el contexto
    if (setShowLoginModal) setShowLoginModal(false);
    if (setShowRegisterModal) setShowRegisterModal(false);
    
    const fetchData = async () => {
      console.log("Fetching data with authMode:", authMode);
      try {
        const data = await getAccessToken(errorHandler, authMode);
        console.log("Got data:", data);
        if (data) {
          setApiResponse(data);
          
          // Solo mostrar el popup de bienvenida para nuevos registros
          // y solo si no se ha mostrado antes
          if ((authMode === 'register' || data.isNewUser) && !sessionStorage.getItem('welcomeShow')) {
            // Asegurarse de que otros popups estén cerrados
            if (setShowLoginModal) setShowLoginModal(false);
            if (setShowRegisterModal) setShowRegisterModal(false);
            
            // Mostrar el popup de bienvenida
            setShowWelcomePopup(true);
            sessionStorage.setItem('welcomeShow', 'true');
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, []); 

  const closePopup = () => {
    // Cerrar el popup actual y asegurarse de que no se abra ningún otro
    setShowWelcomePopup(false);
    
    // Si estos estados existen en tu contexto, asegúrate de que también estén cerrados
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