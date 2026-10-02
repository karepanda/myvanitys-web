const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./fixtures/auth.js');
const {
  registerProductMocks,
  EMPTY_PRODUCTS,
} = require('./fixtures/catalog.js');
const { openMyVanity } = require('./helpers.js');

test('My Vanity renders a populated collection', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await expect(
    page.getByRole('button', { name: /Open details for/ }).first()
  ).toBeVisible();

  await expect(page).toHaveScreenshot('my-vanity-populated');
});

test('My Vanity renders the empty state', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router, { userProducts: EMPTY_PRODUCTS });

  await openMyVanity(page);
  await expect(
    page.getByRole('heading', { name: 'Your vanity is ready for its first product' })
  ).toBeVisible();

  await expect(page).toHaveScreenshot('my-vanity-empty');
});

test('My Vanity reorders products when sorted by name', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await expect(
    page.getByRole('button', { name: /Open details for/ }).first()
  ).toBeVisible();

  const sort = page.getByLabel('Sort products');
  await sort.selectOption('name');
  await expect(sort).toHaveValue('name');
  await expect(
    page.getByRole('button', { name: /Open details for/ }).first()
  ).toHaveAttribute('aria-label', 'Open details for Luxe Eyeshadow Palette');

  await expect(page).toHaveScreenshot('my-vanity-sorted');
});
