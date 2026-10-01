const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./auth.js');

// VERIFICATION GATE (Step 1): loads My Vanity as a seeded user and asserts the
// products request returns 200 and the page renders. If the backend rejects the
// minted JWT, this fails here before any Step 2 spec runs.
test('verification gate: My Vanity renders for a seeded user', async ({ page }, testInfo) => {
  const user = await injectAuth(page, testInfo);

  const productsResponse = page.waitForResponse(
    (response) =>
      response.url().includes(`/users/${user.id}/products`) &&
      response.request().method() === 'GET'
  );

  await page.goto('/dashboard');

  const response = await productsResponse;
  expect(response.status(), 'products request must return 200').toBe(200);

  await expect(page.getByRole('heading', { name: 'My products' })).toBeVisible();
});
