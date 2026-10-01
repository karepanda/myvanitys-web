const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./auth.js');
const {
  CATEGORY_FACE,
  createProductViaApi,
  deleteProductViaApi,
  uniqueName,
} = require('./helpers.js');

// Mobile-only layout checks: no horizontal overflow on each screen and dialog.
async function expectNoHorizontalOverflow(page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `horizontal overflow: scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`
  ).toBeLessThanOrEqual(clientWidth);
}

test('no horizontal overflow on each screen and with each dialog open', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Layout tests run only on the mobile project');

  const user = await injectAuth(page, testInfo);
  const name = uniqueName('Layout', testInfo);
  const product = await createProductViaApi(request, user.jwt, {
    name,
    categoryId: CATEGORY_FACE,
  });

  try {
    // My Vanity
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'My products' })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    // Search
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    // Explore
    await page.getByRole('button', { name: 'Explore', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Explore products' })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    // Back to My Vanity
    await page.getByRole('button', { name: 'My Vanity', exact: true }).click();
    await expect(
      page.getByRole('button', { name: `Open details for ${name}` })
    ).toBeVisible();

    // Create product dialog
    await page.getByRole('button', { name: 'Add product', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Create product' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'Close create product form' }).click();

    // Product detail dialog
    await page.getByRole('button', { name: `Open details for ${name}` }).click();
    await expect(page.getByRole('button', { name: 'Close product details' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'Close product details' }).click();

    // Review dialog
    await page.getByRole('button', { name: `Actions for ${name}` }).click();
    await page.getByRole('button', { name: 'Write review' }).click();
    await expect(page.getByRole('heading', { name: 'Write review' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'Close review form' }).click();

    // Delete dialog
    await page.getByRole('button', { name: `Actions for ${name}` }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // Profile dialog
    await page.getByRole('button', { name: 'Profile', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'Close profile' }).click();
  } finally {
    try {
      await deleteProductViaApi(request, user.jwt, product.id);
    } catch {
      // Already removed during the flow.
    }
  }
});
