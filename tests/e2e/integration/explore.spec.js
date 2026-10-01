const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./auth.js');

test('catalog renders and category/sort controls respond', async ({ page }, testInfo) => {
  await injectAuth(page, testInfo);
  await page.goto('/dashboard?mode=add-products');

  await expect(page.getByRole('heading', { name: 'Explore products' })).toBeVisible();

  // The seeded catalog renders cards.
  await expect(page.getByRole('button', { name: /Open details for/ }).first()).toBeVisible();

  // Category control filters.
  const faceChip = page.getByRole('button', { name: 'Face', exact: true });
  await faceChip.click();
  await expect(faceChip).toHaveAttribute('aria-pressed', 'true');

  const allChip = page.getByRole('button', { name: 'All', exact: true });
  await allChip.click();
  await expect(allChip).toHaveAttribute('aria-pressed', 'true');

  // Sort control responds.
  const sort = page.getByLabel('Sort products');
  await sort.selectOption('name');
  await expect(sort).toHaveValue('name');
  await sort.selectOption('rating');
  await expect(sort).toHaveValue('rating');
});

test('detail dialog opens and closes from a catalog card', async ({ page }, testInfo) => {
  await injectAuth(page, testInfo);
  await page.goto('/dashboard?mode=add-products');

  const card = page.getByRole('button', { name: /Open details for/ }).first();
  await card.click();

  await expect(page.getByRole('button', { name: 'Close product details' })).toBeVisible();
  await page.getByRole('button', { name: 'Close product details' }).click();
  await expect(page.getByRole('button', { name: 'Close product details' })).not.toBeVisible();
});

test('add to My Vanity works and the product appears in My Vanity', async ({ page }, testInfo) => {
  await injectAuth(page, testInfo);
  await page.goto('/dashboard?mode=add-products');

  const firstCard = page.getByRole('button', { name: /Open details for/ }).first();
  const label = await firstCard.getAttribute('aria-label');
  const productName = label.replace(/^Open details for /, '');

  await page.getByRole('button', { name: /Add to My Vanity/ }).first().click();
  await expect(
    page.getByRole('heading', { name: /Product has been added/ })
  ).toBeVisible();

  await page.getByRole('button', { name: 'My Vanity', exact: true }).click();
  await expect(
    page.getByRole('button', { name: `Open details for ${productName}` })
  ).toBeVisible();
});
