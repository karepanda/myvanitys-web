// services/auth/registerService.js
import { apiUtils } from '../../utils/apiUtils';
import { dateUtils } from '../../utils/dateUtils';

export const registerService = {
  register: async (authCode, errorHandler) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    try {
      // Obtener la fecha en formato ISO para el registro
      const isoDate = dateUtils.getCurrentUTCISODate();
      console.log("Registration date (UTC ISO before sending):", isoDate);
      
      const payload = {
        authCode: authCode,
        authProvider: "google",
        registrationDate: isoDate
      };
      
      console.log("Payload being sent:", JSON.stringify(payload));
      
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          ...apiUtils.getCommonHeaders(),
          'Authorization': `Bearer ${authCode}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        if (errorHandler) {
          errorHandler.handleApiError('auth', response.status, errorText);
        }
        return null;
      }

      const userData = await response.text();
      if (!userData) return null;
      
      const parsedUserData = JSON.parse(userData);
      parsedUserData.isNewUser = true;
      
      return parsedUserData;
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (errorHandler) {
        if (!navigator.onLine) {
          errorHandler.showNetworkError();
        } else {
          errorHandler.showGenericError();
        }
      }
      return null;
    }
  }
};