// services/auth/googleAuthAdapter.js
export const googleAuthAdapter = {
    redirectToGoogleOAuth: (redirectUri, clientId, state) => {
      window.location.href =
        'https://accounts.google.com/o/oauth2/v2/auth' +
        `?client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        '&response_type=code' +
        '&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email' +
        '&prompt=select_account' +
        `&state=${state}`;
    },
    
    getAuthorizationCode: () => {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        code: urlParams.get('code'),
        state: urlParams.get('state')
      };
    }
  };
  
  