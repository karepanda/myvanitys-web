const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./auth.js');
const { ensureNotInVanity, searchFirstProductViaApi } = require('./helpers.js');

test('search input accepts typing and short queries show a validation message', async ({ page }, testInfo) => {
  await injectAuth(page, testInfo);
  await page.goto('/dashboard?mode=search');

  const input = page.getByLabel('Search products');
  await expect(input).toBeVisible();

  await input.fill('a');
  await expect(page.getByText('Enter at least two characters.')).toBeVisible();

  await input.fill('Ma');
  await expect(page.getByText('Enter at least two characters.')).not.toBeVisible();
});

test('seeded term returns results, detail dialog opens, add-to-vanity works', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);

  // Ensure the target result is not already collected so "add to vanity" stays
  // idempotent across repeated runs (search results ignore collection status).
  const target = await searchFirstProductViaApi(request, user.jwt, 'Maybelline');
  await ensureNotInVanity(request, user.jwt, target.id);

  await page.goto('/dashboard?mode=search');

  const input = page.getByLabel('Search products');
  await input.fill('Maybelline');
  await page.getByRole('search').getByRole('button', { name: 'Search' }).click();

  // Results render as cards with an add button (search variant).
  await expect(page.getByRole('button', { name: /Add to My Vanity/ }).first()).toBeVisible();

  // Open the detail dialog from a result card and close it.
  await page.getByRole('button', { name: /Open details for/ }).first().click();
  await expect(page.getByRole('button', { name: 'Close product details' })).toBeVisible();
  await page.getByRole('button', { name: 'Close product details' }).click();

  // Add an uncollected result to the vanity.
  await page.getByRole('button', { name: /Add to My Vanity/ }).first().click();
  await expect(
    page.getByRole('heading', { name: /Product has been added/ })
  ).toBeVisible();
});
