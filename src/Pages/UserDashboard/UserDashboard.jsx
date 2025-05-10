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
    
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const data = await getAccessToken();
        console.log("Got data:", data);
        if (data) {
          setApiResponse(data);
          if (!sessionStorage.getItem('welcomeShow')) {
            setShowWelcomePopup(true);
            sessionStorage.setItem('welcomeShow', 'true');
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  // Use the MINIMUM dependencies, and specifically avoid getAccessToken
  }, []); // Empty dependency array - only run once on mount

  const closePopup = () => {
    setShowWelcomePopup(false);
  };

  return (
    <>
      {apiResponse && <Dashboard />}
      {showWelcomePopup && <WelcomePopup onClose={closePopup} />}
    </>
  );
};

export { UserDashboard };