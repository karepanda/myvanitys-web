const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { userFor } = require('./users.js');

const MANIFEST_PATH = path.join(os.tmpdir(), 'myvanitys-integration-auth.json');

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(
      `Integration auth manifest not found at ${MANIFEST_PATH}. ` +
        `Run the suite via "npm run test:e2e:integration" so global-setup.js seeds ` +
        `the test users and mints the JWTs first.`
    );
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

// Resolves the seeded user (and its minted JWT) for the current (project, worker).
function resolveUser(testInfo) {
  const manifest = loadManifest();
  const project = testInfo.project.name;
  const worker = testInfo.parallelIndex;
  const base = userFor(project, worker);
  const entry = manifest.users.find((candidate) => candidate.id === base.id);
  if (!entry) {
    throw new Error(`No minted JWT for project "${project}" worker "${worker}"`);
  }
  return entry;
}

// Injects the authenticated session (and language/consent/welcome state) via
// page.addInitScript() so it is present before the app bootstraps and before navigation.
async function injectAuth(page, testInfo, { lang = 'en' } = {}) {
  const user = resolveUser(testInfo);
  const auth = {
    token: user.jwt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: null,
    },
    isNewUser: false,
    expiresAt: user.expiresAt,
  };

  await page.addInitScript(
    ({ auth, lang }) => {
      window.localStorage.setItem('vanitys_auth', JSON.stringify(auth));
      window.localStorage.setItem('i18nextLng', lang);
      // Deny analytics so the app never loads Google Analytics during tests.
      window.localStorage.setItem('myvanitys_analytics_consent', 'denied');
      // Suppress the welcome popup (context also requires isNewUser === false).
      window.sessionStorage.setItem('welcomeShow', 'true');
    },
    { auth, lang }
  );

  return user;
}

module.exports = { resolveUser, injectAuth };
