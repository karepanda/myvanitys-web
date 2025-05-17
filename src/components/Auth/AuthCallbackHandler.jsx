// src/components/Auth/AuthCallbackHandler.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VanitysContext } from '../../context';
import { loginService } from '../../services/auth/loginService';
import './Auth.css';

/**
 * Componente encargado exclusivamente de procesar el callback de autenticación
 * Su única responsabilidad es procesar el código de autorización y redirigir
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.redirectTo - Ruta a la que redirigir después de autenticación exitosa
 */
const AuthCallbackHandler = ({ redirectTo = '/dashboard' }) => {
  const { setApiResponse, errorHandler } = useContext(VanitysContext);
  const [processingAuth, setProcessingAuth] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuthCode = async () => {
      try {
        // Obtener código de autorización de la URL
        const urlParams = new URLSearchParams(location.search);
        const authCode = urlParams.get('code');
        const state = urlParams.get('state'); // 'login' o 'register'
        
        console.log('Processing auth callback...');
        console.log('State:', state);
        console.log('Auth code present:', !!authCode);
        
        // Limpiar la URL para evitar procesamientos repetidos
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        if (!authCode) {
          console.error('No authentication code found in URL');
          errorHandler.handleApiError('auth', 'default', 'No authentication code found');
          setProcessingAuth(false);
          return;
        }
        
        // Autenticar usando el servicio de login
        const userData = await loginService.authenticate(authCode, errorHandler);
        
        if (!userData) {
          console.error('Authentication failed - no user data returned');
          errorHandler.handleApiError('auth', 'withoutUserData');
          setProcessingAuth(false);
          return;
        }
        
        // Verificar que el token esté presente
        if (!userData.token) {
          console.error('No token returned from authentication service');
          errorHandler.handleApiError('auth', 'withoutToken');
          setProcessingAuth(false);
          return;
        }
        
        console.log('Authentication successful!');
        console.log('Token received:', userData.token.substring(0, 10) + '...');
        
        // Crear objeto con la estructura esperada por el contexto
        const authData = {
          token: userData.token,
          user: {
            id: userData.userId || userData.id,
            name: userData.name || userData.displayName,
            email: userData.email,
            profilePicture: userData.profilePicture || userData.picture
          },
          isNewUser: userData.isNewUser || false
        };
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('vanitys_auth', JSON.stringify(authData));
        
        // Actualizar contexto
        setApiResponse(authData);
        
        // Redirigir al dashboard después de una breve pausa
        setTimeout(() => {
          navigate(redirectTo);
        }, 500);
        
      } catch (error) {
        console.error('Error processing authentication:', error);
        errorHandler.showGenericError();
        setProcessingAuth(false);
      }
    };
    
    processAuthCode();
  }, [location, navigate, redirectTo, setApiResponse, errorHandler]);
  
  // Si estamos procesando la autenticación, mostrar spinner
  if (processingAuth) {
    return (
      <div className="auth-callback">
        <div className="auth-callback__processing">
          <h2>Procesando autenticación</h2>
          <div className="auth-callback__spinner"></div>
          <p>Por favor espera mientras completamos el inicio de sesión...</p>
        </div>
      </div>
    );
  }
  
  // Si llegamos aquí, hubo un error pero ya fue manejado por errorHandler
  // Mostramos un botón para volver al inicio
  return (
    <div className="auth-callback">
      <div className="auth-callback__error">
        <h2>Error de autenticación</h2>
        <p>Ocurrió un error durante el proceso de autenticación.</p>
        <button 
          className="auth-callback__button"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export { AuthCallbackHandler };