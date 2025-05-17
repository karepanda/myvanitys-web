// App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { VanitysContext, VanitysProvider } from '../context';
import { MissingFieldsPopup } from '../components/MissingFieldsPopup/MissingFieldsPopup';
import { Modal } from '../components/Modal/Modal';

import { useContext, useEffect } from 'react';
import './App.css';

const AppContent = () => {
  // Obtener estados y funciones necesarias del contexto
  const { 
    apiResponse,
    setApiResponse, 
    showCookieBanner,
    showMissingFieldsPopup,
    setShowMissingFieldsPopup,
    errorMessage,
    errorTitle,
    errorType
  } = useContext(VanitysContext);

  // Efecto para cargar datos de autenticación desde localStorage al iniciar
  useEffect(() => {
    const loadSavedAuth = () => {
      try {
        // Solo intentar cargar si no hay datos ya en el contexto
        if (!apiResponse) {
          const savedAuth = localStorage.getItem('vanitys_auth');
          
          if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            
            // Verificar que los datos sean válidos
            if (authData && authData.token && authData.user && authData.user.id) {
              console.log('Loading saved authentication data for user:', authData.user.id);
              setApiResponse(authData);
            } else {
              console.warn('Invalid saved authentication data, removing');
              localStorage.removeItem('vanitys_auth');
            }
          } else {
            console.log('No saved authentication data found');
          }
        }
      } catch (error) {
        console.error('Error loading saved authentication:', error);
        localStorage.removeItem('vanitys_auth');
      }
    };
    
    loadSavedAuth();
  }, [apiResponse, setApiResponse]);

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
      
      {/* Error popup global */}
      {showMissingFieldsPopup && (
        <Modal>
          <MissingFieldsPopup
            message={errorMessage || 'An error occurred'}
            title={errorTitle}
            type={errorType}
            onClose={() => setShowMissingFieldsPopup(false)}
          />
        </Modal>
      )}
    </div>
  );
};

const App = () => {
  return (
    <VanitysProvider>
      <AppContent />
    </VanitysProvider>
  );
};

export { App };