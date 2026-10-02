// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression tests run the React UI against deterministic in-memory API
 * mocks. They require no backend, database, Docker containers, or real JWTs.
 */
export default defineConfig({
  testDir: './tests/e2e/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Vite transforms modules on demand, so cold starts can be slower when the
  // machine is under load. This does not change screenshot pixel tolerance.
  timeout: 60000,

  reporter: [
    ['html', { outputFolder: 'playwright-report/visual', open: 'never' }],
    ['list'],
  ],
  outputDir: 'test-results/visual',
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{testFileBaseName}/{arg}-{projectName}.png',

  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    baseURL: 'http://localhost:5173',
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
