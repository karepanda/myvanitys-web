const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./fixtures/auth.js');
const { registerProductMocks } = require('./fixtures/catalog.js');
const {
  openExplore,
  openMyVanity,
  waitForProductCard,
} = require('./helpers.js');

test('Explore renders the community catalog', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openExplore(page);
  await waitForProductCard(page, 'Dewy Cream Blush');

  await expect(page).toHaveScreenshot('explore-catalog');
});

test('Explore filters the catalog by category', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openExplore(page);
  await waitForProductCard(page, 'Dewy Cream Blush');

  const faceChip = page.getByRole('button', { name: 'Face', exact: true });
  await faceChip.click();
  await expect(faceChip).toHaveAttribute('aria-pressed', 'true');
  await waitForProductCard(page, 'Dewy Cream Blush');
  await expect(
    page.getByRole('button', { name: 'Open details for Precision Liquid Liner' })
  ).not.toBeVisible();

  await expect(page).toHaveScreenshot('explore-category-filtered');
});

test('Product details dialog opens from a collection card', async ({ page, router }) => {
  await injectAuth(page);
  registerProductMocks(router);

  await openMyVanity(page);
  await waitForProductCard(page, 'Radiant Silk Foundation');

  await page
    .getByRole('button', { name: 'Open details for Radiant Silk Foundation' })
    .click();

  await expect(
    page.getByRole('heading', { name: 'Radiant Silk Foundation', level: 1 })
  ).toBeVisible();
  await expect(page.getByText('Absolutely love this!')).toBeVisible();

  await expect(page).toHaveScreenshot('product-details-dialog');
});
