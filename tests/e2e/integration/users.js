// Single source of truth for the seeded E2E test users.
//
// Must stay in sync with seed.sql (same fixed UUIDs, token/auth_id, email, name).
// One fixed user per (project x worker): 4 projects x 2 workers = 8 users.
const PROJECT_ORDER = ['chromium', 'firefox', 'webkit', 'mobile'];
const WORKERS = 2;

const PROJECT_WORKERS = PROJECT_ORDER.flatMap((project) =>
  Array.from({ length: WORKERS }, (_, worker) => ({ project, worker }))
);

const USERS = PROJECT_WORKERS.map(({ project, worker }, index) => ({
  id: `e2e00000-0000-4000-8000-00000000000${index + 1}`,
  // The backend stores the Google authorization id in the "user"."token" column;
  // it is also the JWT "auth_id" claim.
  authId: `e2e-${project}-${worker}`,
  email: `e2e-${project}-${worker}@myvanitys.test`,
  name: `E2E ${project} worker ${worker}`,
  project,
  worker,
}));

function userFor(projectName, workerIndex) {
  const projectIndex = PROJECT_ORDER.indexOf(projectName);
  if (projectIndex === -1) {
    throw new Error(
      `Unknown project "${projectName}". Expected one of: ${PROJECT_ORDER.join(', ')}`
    );
  }
  const user = USERS[projectIndex * WORKERS + workerIndex];
  if (!user) {
    throw new Error(
      `No seeded user for project "${projectName}" worker "${workerIndex}"`
    );
  }
  return user;
}

module.exports = { PROJECT_ORDER, WORKERS, USERS, userFor };
