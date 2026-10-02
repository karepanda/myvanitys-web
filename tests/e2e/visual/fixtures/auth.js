// Deterministic authenticated-user fixture.
//
// Mirrors the exact localStorage object the application reads in
// `src/context/index.jsx` (`localStorage.getItem('vanitys_auth')`):
//   { token, user: { id, name, email, profilePicture }, isNewUser, expiresAt }
//
// The token is fake because every API request is intercepted by the mock router
// and never reaches a real backend.

const USER_ID = 'visual0000-0000-4000-8000-000000000001';
const AUTH_TOKEN = 'fake-visual-jwt-token';

const USER = {
  id: USER_ID,
  name: 'Visual Tester',
  email: 'visual@myvanitys.test',
  profilePicture: null,
};

// Fixed far-future expiry (2100-01-01T00:00:00Z). `updateAuthData` only derives
// the expiry from the JWT when `expiresAt` is missing, so providing it keeps the
// fake token from ever being decoded.
const EXPIRES_AT = 4102444800000;

function authStorage(user = USER) {
  return {
    token: AUTH_TOKEN,
    user,
    isNewUser: false,
    expiresAt: EXPIRES_AT,
  };
}

/**
 * Injects the authenticated session (plus fixed language, denied analytics
 * consent and suppressed welcome popup) before the application bootstraps.
 */
async function injectAuth(page, { user = USER, lang = 'en' } = {}) {
  const auth = authStorage(user);
  await page.addInitScript(
    ({ auth, lang }) => {
      window.localStorage.setItem('vanitys_auth', JSON.stringify(auth));
      window.localStorage.setItem('i18nextLng', lang);
      window.localStorage.setItem('myvanitys_analytics_consent', 'denied');
      window.sessionStorage.setItem('welcomeShow', 'true');
    },
    { auth, lang }
  );
  return user;
}

module.exports = { USER_ID, AUTH_TOKEN, USER, EXPIRES_AT, authStorage, injectAuth };
