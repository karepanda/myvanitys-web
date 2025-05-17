// src/Pages/UserDashboard/UserDashboard.jsx (Con mejor manejo de carga)
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import './UserDashboard.css';

/**
 * Página que muestra el dashboard del usuario
 * Con mejor manejo de la carga inicial y estados transitorios
 */
const UserDashboard = () => {
  const { apiResponse, errorHandler } = useContext(VanitysContext);
  const [isLoading, setIsLoading] = useState(true);
  
  // Efecto para controlar el estado de carga
  useEffect(() => {
    // Dar un pequeño tiempo para que los datos se estabilicen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    // Log para depuración
    console.log('UserDashboard mounted, apiResponse:', apiResponse ? 'present' : 'not present');
    
    return () => clearTimeout(timer);
  }, [apiResponse]);
  
  // Si estamos en estado de carga, mostrar un indicador
  if (isLoading) {
    return (
      <div className="user-dashboard__loading">
        <div className="user-dashboard__spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }
  
  // Verificar autenticación después de la carga inicial
  if (!apiResponse?.token || !apiResponse?.user?.id) {
    console.log('No authentication data found in UserDashboard, redirecting to home');
    return <Navigate to="/" />;
  }
  
  // Si estamos autenticados y la carga inicial ha terminado, mostrar el dashboard
  return (
    <div className="user-dashboard">
      <Dashboard />
    </div>
  );
};

export { UserDashboard };