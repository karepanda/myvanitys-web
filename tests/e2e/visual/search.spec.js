const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./fixtures/auth.js');
const { registerProductMocks } = require('./fixtures/catalog.js');
const { openSearch } = require('./helpers.js');

test('Search renders its initial state', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openSearch(page);
  await expect(page.getByLabel('Search products')).toBeVisible();

  await expect(page).toHaveScreenshot('search-initial');
});

test('Search shows a validation message for a single character', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openSearch(page);
  const input = page.getByLabel('Search products');
  await input.fill('a');

  await expect(
    page.getByText('Enter at least two characters.')
  ).toBeVisible();

  await expect(page).toHaveScreenshot('search-validation');
});

test('Search returns results for a submitted query', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openSearch(page);
  await page.getByLabel('Search products').fill('Maybelline');
  await page.getByRole('search').getByRole('button', { name: 'Search' }).click();

  await expect(
    page.getByRole('button', { name: /Add to My Vanity/ }).first()
  ).toBeVisible();

  await expect(page).toHaveScreenshot('search-results');
});
