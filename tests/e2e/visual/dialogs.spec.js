const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./fixtures/auth.js');
const { registerProductMocks } = require('./fixtures/catalog.js');
const { openMyVanity, waitForProductCard } = require('./helpers.js');

test('Create-product dialog renders', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await waitForProductCard(page, 'Radiant Silk Foundation');

  await page.getByRole('button', { name: 'Add product', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Create product' })
  ).toBeVisible();

  await expect(page).toHaveScreenshot('create-product-dialog');
});

test('Review dialog renders', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await waitForProductCard(page, 'Radiant Silk Foundation');

  await page
    .getByRole('button', { name: 'Actions for Radiant Silk Foundation' })
    .click();
  await page.getByRole('button', { name: 'Write review' }).click();

  await expect(page.getByRole('heading', { name: 'Write review' })).toBeVisible();

  await expect(page).toHaveScreenshot('review-dialog');
});

test('Delete confirmation dialog renders', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await waitForProductCard(page, 'Radiant Silk Foundation');

  await page
    .getByRole('button', { name: 'Actions for Radiant Silk Foundation' })
    .click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(
    page.getByRole('button', { name: 'Confirm', exact: true })
  ).toBeVisible();

  await expect(page).toHaveScreenshot('delete-confirmation-dialog');
});

test('Profile screen renders', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Visual Tester' })).toBeVisible();

  await expect(page).toHaveScreenshot('profile-screen');
});
