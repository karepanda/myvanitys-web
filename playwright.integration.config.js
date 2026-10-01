// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Integration config: runs against the REAL backend in Docker (no API mocks).
 * The frontend is built with VITE_API_URL pointing at the local backend and
 * served with `vite preview` on localhost:5173 (CORS only allows localhost:5173).
 */
export default defineConfig({
  testDir: './tests/e2e/integration',
  globalSetup: './tests/e2e/integration/global-setup.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'node scripts/e2e-serve.mjs',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
