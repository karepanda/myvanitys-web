// src/components/App/App.jsx (Versión sin redirección automática)
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { VanitysContext, VanitysProvider } from '../context';
import { MissingFieldsPopup } from '../components/MissingFieldsPopup/MissingFieldsPopup';
import { Modal } from '../components/Modal/Modal';

import { useContext } from 'react';
import './App.css';

const AppContent = () => {
  // Obtener lo necesario del contexto
  const { 
    showMissingFieldsPopup,
    setShowMissingFieldsPopup,
    errorMessage,
    errorTitle,
    errorType
  } = useContext(VanitysContext);

  // NO hacer redirección automática aquí, dejar que el router se encargue
  
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
      
      {/* Popup global de errores */}
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