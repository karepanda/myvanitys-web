-- Idempotent seed for the Playwright integration tests.
--
-- Inserts one fixed test user per (project x worker): 4 projects x 2 workers = 8 users.
-- Must stay in sync with tests/e2e/integration/users.js (the JWT sub/auth_id/email/name
-- claims are minted from that file using these exact UUIDs).
--
-- "user"."token" stores the Google authorization id and must be NOT NULL + UNIQUE,
-- so every user gets a distinct value (which is also the JWT "auth_id" claim).

INSERT INTO "user" (user_id, token, version, email, name, created_at, updated_at)
VALUES
  ('e2e00000-0000-4000-8000-000000000001', 'e2e-chromium-0', 0, 'e2e-chromium-0@myvanitys.test', 'E2E chromium worker 0', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000002', 'e2e-chromium-1', 0, 'e2e-chromium-1@myvanitys.test', 'E2E chromium worker 1', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000003', 'e2e-firefox-0', 0, 'e2e-firefox-0@myvanitys.test', 'E2E firefox worker 0', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000004', 'e2e-firefox-1', 0, 'e2e-firefox-1@myvanitys.test', 'E2E firefox worker 1', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000005', 'e2e-webkit-0', 0, 'e2e-webkit-0@myvanitys.test', 'E2E webkit worker 0', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000006', 'e2e-webkit-1', 0, 'e2e-webkit-1@myvanitys.test', 'E2E webkit worker 1', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000007', 'e2e-mobile-0', 0, 'e2e-mobile-0@myvanitys.test', 'E2E mobile worker 0', CURRENT_TIMESTAMP, NULL),
  ('e2e00000-0000-4000-8000-000000000008', 'e2e-mobile-1', 0, 'e2e-mobile-1@myvanitys.test', 'E2E mobile worker 1', CURRENT_TIMESTAMP, NULL)
ON CONFLICT (user_id) DO UPDATE
  SET email = EXCLUDED.email,
      name = EXCLUDED.name,
      updated_at = CURRENT_TIMESTAMP;
