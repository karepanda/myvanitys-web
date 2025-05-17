// src/Pages/UserDashboard/UserDashboard.jsx
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import { VanitysContext } from '../../context';
import './UserDashboard.css';

/**
 * Página que muestra el dashboard del usuario
 * Su única responsabilidad es verificar la autenticación y mostrar el dashboard
 */
const UserDashboard = () => {
  const { apiResponse } = useContext(VanitysContext);
  
  // Cargar datos de autenticación desde localStorage si no están en el contexto
  useEffect(() => {
    if (!apiResponse) {
      try {
        const storedAuth = localStorage.getItem('vanitys_auth');
        if (storedAuth) {
          console.log('Found stored authentication data');
          // No hacemos nada aquí, ya que el provider del contexto
          // debería manejar la carga inicial desde localStorage
        }
      } catch (error) {
        console.error('Error checking stored auth data:', error);
      }
    }
  }, [apiResponse]);
  
  // Verificar autenticación
  if (!apiResponse?.token || !apiResponse?.user?.id) {
    console.log('No authentication data found, redirecting to home');
    return <Navigate to="/" />;
  }
  
  // Si estamos autenticados, mostrar el dashboard
  return (
    <div className="user-dashboard">
      <Dashboard />
    </div>
  );
};

export { UserDashboard };