// services/auth/registerService.js
import { apiUtils } from '../../utils/apiUtils';
import { dateUtils } from '../../utils/dateUtils';

export const registerService = {
  register: async (authCode, errorHandler) => {
    console.log('🔥 === REGISTER SERVICE CALLED ===');
    console.log('🔥 Auth code received:', !!authCode);
    console.log('🔥 Error handler provided:', !!errorHandler);
    
    const API_URL = import.meta.env.VITE_API_URL;

    console.log('Variables Environment:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
      NODE_ENV: import.meta.env.MODE || import.meta.env.NODE_ENV,
      hostname: window.location.hostname
    });
    
    try {
      const isoDate = dateUtils.getCurrentUTCISODate();
      console.log("Registration date (UTC ISO before sending):", isoDate);
      
      const payload = {
        authCode: authCode,
        authProvider: "google",
        registrationDate: isoDate
      };
      
      console.log("Payload being sent:", JSON.stringify(payload));
      const authUrl = `${API_URL}/auth/register`;
      console.log('Auth URL being used:', authUrl);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          ...apiUtils.getCommonHeaders(),
          'Authorization': `Bearer ${authCode}`
        },
        body: JSON.stringify(payload),
      });

      // 🔍 RESPONSE ANALYSIS
      console.log('🔍 === RESPONSE ANALYSIS ===');
      console.log('Response Status:', response.status);
      console.log('Response Status Text:', response.statusText);
      console.log('Response OK:', response.ok);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('❌ Registration failed with status:', response.status);
        console.error('❌ Error response body:', errorText);
        
        if (errorHandler) {
          errorHandler.handleApiError('auth', response.status, errorText);
        }
        return null;
      }

      // 🔍 RAW RESPONSE ANALYSIS
      const userData = await response.text();
      console.log('🔍 === RAW RESPONSE ANALYSIS ===');
      console.log('Raw response type:', typeof userData);
      console.log('Raw response length:', userData?.length || 0);
      console.log('Raw response content:', userData);
      console.log('Is empty?:', !userData || userData.trim() === '');
      
      if (!userData) {
        console.error('❌ Empty response received from server');
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'emptyResponse', 'Server returned empty response');
        }
        return null;
      }
      
      // 🔍 JSON PARSING
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
        console.log('🔍 === PARSED DATA ANALYSIS ===');
        console.log('Parsed successfully:', true);
        console.log('Parsed data type:', typeof parsedUserData);
        console.log('Is object?:', typeof parsedUserData === 'object' && parsedUserData !== null);
        console.log('All keys in response:', Object.keys(parsedUserData || {}));
        console.log('Full parsed object:', parsedUserData);
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        console.error('❌ Failed to parse this text:', userData);
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'parseError', 'Invalid JSON response');
        }
        return null;
      }

      console.log('🔍 === REGISTRATION SUCCESS ANALYSIS ===');
      console.log('Has userId?:', !!parsedUserData.userId);
      console.log('User ID:', parsedUserData.userId);
      
      if (!parsedUserData.userId) {
        console.error('❌ No userId in response - registration may have failed');
        if (errorHandler) {
          errorHandler.handleApiError('auth', 'noUserId', 'User ID not returned');
        }
        return null;
      }
    
      console.log('✅ USER REGISTRATION SUCCESSFUL!');
      console.log('✅ User ID:', parsedUserData.userId);
      
      // 🎯  Create response object for registration (no token - only user data created)
      const registrationResult = {
        userId: parsedUserData.userId,
        email: parsedUserData.email || null,
        name: parsedUserData.name || null,
        isNewUser: true,
        registrationSuccessful: true,
        requiresLogin: true // Flag to indicate you need to login
      };
      
      console.log('✅ RETURNING REGISTRATION RESULT:', registrationResult);
      return registrationResult;
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
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