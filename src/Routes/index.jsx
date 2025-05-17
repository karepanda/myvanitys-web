// Routes/index.jsx (Solución definitiva)
import React, { useContext } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { Home } from '../Pages/Home/Home';
import { UserDashboard } from '../Pages/UserDashboard/UserDashboard';
import { AuthCallbackHandler } from '../components/Auth/AuthCallbackHandler';
import { VanitysContext } from '../context';

// Componente para rutas protegidas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { apiResponse } = useContext(VanitysContext);
  
  // Verificar si el usuario está autenticado de forma estricta
  const isAuthenticated = Boolean(
    apiResponse && 
    apiResponse.token && 
    apiResponse.user && 
    apiResponse.user.id
  );
  
  // Si no está autenticado, redirigir al home
  if (!isAuthenticated) {
    console.log('Access to protected route denied - not authenticated');
    return <Navigate to="/" replace />;
  }
  
  // Si está autenticado, mostrar el componente protegido
  return children;
};

const AppRoutes = () => {
  const { apiResponse } = useContext(VanitysContext);
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = Boolean(
    apiResponse && 
    apiResponse.token && 
    apiResponse.user && 
    apiResponse.user.id
  );
  
  // Log para depuración
  console.log('Current authentication state:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
  
  const routes = useRoutes([
    // Ruta de inicio
    { path: '/', element: <Home /> },
    
    // Ruta de callback para autenticación
    { path: '/callback', element: <AuthCallbackHandler redirectTo="/dashboard" /> },
    
    // Ruta del dashboard - SIEMPRE protegida
    { 
      path: '/dashboard', 
      element: (
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      ) 
    },
    
    // Ruta para cualquier otra URL - redirige al home
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  return routes;
};

export { AppRoutes };