// services/auth/registerService.js
import { getErrorMessage } from '../../utils/errorMessages';
import { dateUtils } from '../../utils/dateUtils';

export const registerService = {
  register: async (authCode, errorHandler) => {
    const API_URL = import.meta.env.VITE_API_URL;

    try {
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCode}`,
          'X-Request-Id': 'd2919d3f-6b2f-49f4-9dd5-efbbc9b1c8f8',
          'X-Flow-Id': '123e4567-e89b-12d3-a456-426614174000',
          'User-Agent': 'MyVanitysApp/1.0',
          'Accept-Language': 'en-US',
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
      handleAuthError(error, errorHandler);
      return null;
    }
  }
};