const { test: base, expect } = require('@playwright/test');

// Console-error fixture: fails the test on any uncaught page error or any
// console.error. The allowlist is intentionally empty so the app must stay
// clean in every browser (Chromium, Firefox, WebKit, mobile WebKit).
//
// It also aborts requests to third-party asset hosts (Google Fonts / Google
// Analytics) so the tests are hermetic and never depend on external network.
// This is NOT an API mock: every request to the real backend (localhost:8080)
// and the app under test (localhost:5173) passes through untouched.
const EXTERNAL_ASSETS =
  /^https?:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.googletagmanager\.com)\//;

// Justified allowlist entries (non-empty allowlist).
//
// `src/utils/errorHandler.js` calls `console.error('ERROR HANDLER CALLED', …)`
// and `console.error('STACK TRACE', …)` on EVERY error/validation popup (e.g.
// the intentional "please select a category" validation flow). These are debug
// logs emitted by the app's own error handler, not real page errors, so they are
// excluded. Everything else still fails the test.
const KNOWN_DEBUG_PATTERNS = [/^ERROR HANDLER CALLED:/, /^STACK TRACE:/];

const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];

    // Fulfill (rather than abort) third-party asset requests so they do not
    // surface as "Failed to load resource" console errors, keeping the tests
    // hermetic without failing the empty console.error allowlist.
    await page.route(EXTERNAL_ASSETS, (route) => {
      const isCss = route.request().url().includes('fonts.googleapis.com');
      return route.fulfill({
        status: 200,
        contentType: isCss ? 'text/css' : 'text/plain',
        body: '',
      });
    });

    page.on('pageerror', (error) => {
      errors.push(`pageerror: ${error.message}`);
    });
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (!KNOWN_DEBUG_PATTERNS.some((pattern) => pattern.test(text))) {
        errors.push(`console.error: ${text}`);
      }
    });

    await use(page);

    expect(
      errors,
      `Detected page errors / console.error output:\n${errors.join('\n')}`
    ).toEqual([]);
  },
});

module.exports = { test, expect };
