const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { USERS } = require('./users.js');

const HEALTH_URL = 'http://localhost:8080/myvanitys/actuator/health';
const MANIFEST_PATH = path.join(os.tmpdir(), 'myvanitys-integration-auth.json');

const REQUIRED_ENV_VARS = [
  'JWT_SECRET',
  'E2E_DB_CONTAINER',
  'E2E_DB_NAME',
  'E2E_DB_USER',
];

function fail(message) {
  throw new Error(`[global-setup] ${message}`);
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

// HMAC-SHA256 JWT (HS256) minted with Node's built-in crypto. No extra dependencies.
function mintJwt(secret, claims) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify(claims));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

async function checkBackendHealth() {
  let response;
  try {
    response = await fetch(HEALTH_URL);
  } catch (error) {
    fail(
      `Backend is not reachable at ${HEALTH_URL}. ` +
        `Start the backend (it is expected to already run in Docker) and re-run; ` +
        `this setup never starts it. (${error.message})`
    );
  }

  if (!response.ok) {
    fail(`Backend health endpoint returned HTTP ${response.status}.`);
  }

  const body = await response.text();
  if (!/UP/i.test(body)) {
    fail(`Backend health endpoint did not report UP. Body: ${body}`);
  }
}

function assertSafeResetEnvironment() {
  // reset.sql deletes rows from the real database. Only allow it against a
  // local backend (localhost/127.0.0.1) and a DB container named via the
  // E2E_DB_CONTAINER environment variable — never a remote/hardcoded target.
  const backendHost = new URL(HEALTH_URL).hostname;
  if (backendHost !== 'localhost' && backendHost !== '127.0.0.1') {
    fail(
      `Refusing to run reset.sql: backend URL host must be "localhost" or "127.0.0.1", got "${backendHost}".`
    );
  }

  const container = process.env.E2E_DB_CONTAINER;
  if (!container) {
    fail(
      'Refusing to run reset.sql: E2E_DB_CONTAINER is not set. The DB container name must come from the E2E_DB_CONTAINER environment variable.'
    );
  }
}

async function runPsqlFile(fileName) {
  const container = process.env.E2E_DB_CONTAINER;
  const db = process.env.E2E_DB_NAME;
  const user = process.env.E2E_DB_USER;
  const sql = fs.readFileSync(path.join(__dirname, fileName), 'utf8');

  // Stream the SQL into psql INSIDE the container so we never require a host psql.
  await new Promise((resolve, reject) => {
    const child = spawn(
      'docker',
      ['exec', '-i', container, 'psql', '-U', user, '-d', db, '-v', 'ON_ERROR_STOP=1'],
      { stdio: ['pipe', 'inherit', 'inherit'] }
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`psql ${fileName} exited with code ${code}`));
      }
    });

    child.stdin.write(sql);
    child.stdin.end();
  });
}

async function globalSetup() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    fail(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        `Set them before running the integration suite.`
    );
  }

  await checkBackendHealth();

  // Refuse to reset unless pointed at a local backend/DB container.
  assertSafeResetEnvironment();

  // Reset the test users' data first (idempotent), then (re)seed the users.
  await runPsqlFile('reset.sql');
  await runPsqlFile('seed.sql');

  const secret = process.env.JWT_SECRET;
  const issuer = process.env.JWT_ISSUER || 'myvanitys';
  const now = Math.floor(Date.now() / 1000);

  const users = USERS.map((user) => {
    const claims = {
      sub: user.id,
      iss: issuer,
      iat: now,
      exp: now + 3600,
      auth_id: user.authId,
      email: user.email,
      name: user.name,
    };
    return {
      ...user,
      jwt: mintJwt(secret, claims),
      expiresAt: claims.exp * 1000,
    };
  });

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ users }, null, 2));

  console.log(
    `[global-setup] Seeded ${users.length} users and minted one JWT each -> ${MANIFEST_PATH}`
  );
}

module.exports = globalSetup;
