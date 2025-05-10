// App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes/index';
import { Navbar } from '../components/Navbar/Navbar';
import { VanitysContext, VanitysProvider } from '../context';
import { MissingFieldsPopup } from '../components/MissingFieldsPopup/MissingFieldsPopup';
import { Modal } from '../components/Modal/Modal';

import { useContext } from 'react';
import './App.css';

const AppContent = () => {
  // Añadir los estados necesarios para el manejo de errores
  const { 
    apiResponse, 
    showCookieBanner,
    // Añade estos estados del contexto
    showMissingFieldsPopup,
    setShowMissingFieldsPopup,
    errorMessage,
    errorTitle,
    errorType
  } = useContext(VanitysContext);

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
      
      {/* Add error popup globally */}
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