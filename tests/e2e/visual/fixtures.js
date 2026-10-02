// Shared test fixture for the visual regression suite.
//
// Each test receives a `router` fixture that intercepts every application API
// request. After the test, the fixture fails if the application issued any API
// request that had no registered mock (with method + URL in the message).

const { test: base, expect } = require('@playwright/test');
const {
  createMockRouter,
  blockExternalRequests,
  disableAnimations,
} = require('./mocks.js');

const test = base.extend({
  router: async ({ page }, use) => {
    await blockExternalRequests(page);
    await disableAnimations(page);

    const router = createMockRouter();
    await router.install(page);

    await use(router);

    expect(
      router.unmatched,
      [
        'The application issued an API request with no registered mock. ',
        'Register it with the mock router before the test navigates:\n',
        router.unmatched.join('\n'),
      ].join('')
    ).toEqual([]);
  },
});

module.exports = { test, expect };
