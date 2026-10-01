const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./auth.js');
const {
  CATEGORY_FACE,
  CATEGORY_LIPS,
  createProductViaApi,
  deleteProductViaApi,
  uniqueName,
} = require('./helpers.js');

// Sets a controlled <input type="color"> value the same way a real user would
// (native value setter + input/change events), since color inputs cannot be typed.
async function setColorInput(page, hex) {
  await page.getByLabel('Choose product color').evaluate((el, value) => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, hex);
}

test('sort and category controls respond without console errors', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);

  // Two products in different categories so the category chips are exercised.
  const first = await createProductViaApi(request, user.jwt, {
    name: uniqueName('SortControl', testInfo),
    categoryId: CATEGORY_FACE,
  });
  const second = await createProductViaApi(request, user.jwt, {
    name: uniqueName('SortControl', testInfo),
    categoryId: CATEGORY_LIPS,
  });

  try {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'My products' })).toBeVisible();

    const sort = page.getByLabel('Sort products');
    await expect(sort).toBeVisible();
    await sort.selectOption('name');
    await expect(sort).toHaveValue('name');
    await sort.selectOption('brand');
    await expect(sort).toHaveValue('brand');

    const allChip = page.getByRole('button', { name: 'All', exact: true });
    const faceChip = page.getByRole('button', { name: 'Face', exact: true });
    await expect(allChip).toBeVisible();
    await faceChip.click();
    await expect(faceChip).toHaveAttribute('aria-pressed', 'true');
    await allChip.click();
    await expect(allChip).toHaveAttribute('aria-pressed', 'true');
  } finally {
    await deleteProductViaApi(request, user.jwt, first.id);
    await deleteProductViaApi(request, user.jwt, second.id);
  }
});

test('product detail dialog opens from a card and closes via close button', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);
  const name = uniqueName('Detail', testInfo);
  const product = await createProductViaApi(request, user.jwt, { name });

  try {
    await page.goto('/dashboard');

    const card = page.getByRole('button', { name: `Open details for ${name}` });
    await card.click();

    // The dialog renders the product name as an <h1> (the card uses an <h2>).
    await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close product details' })).toBeVisible();

    await page.getByRole('button', { name: 'Close product details' }).click();
    await expect(page.getByRole('heading', { name, level: 1 })).not.toBeVisible();
  } finally {
    await deleteProductViaApi(request, user.jwt, product.id);
  }
});

// App limitation: ProductPopup has no Escape handler, so the dialog can only be
// closed via its close button today.
test.fixme('product detail dialog closes on Escape', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);
  const name = uniqueName('DetailEsc', testInfo);
  const product = await createProductViaApi(request, user.jwt, { name });

  try {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: `Open details for ${name}` }).click();
    await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name, level: 1 })).not.toBeVisible();
  } finally {
    await deleteProductViaApi(request, user.jwt, product.id);
  }
});

// App limitation: ProductPopup has no overlay-click handler.
test.fixme('product detail dialog closes on overlay click', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);
  const name = uniqueName('DetailOverlay', testInfo);
  const product = await createProductViaApi(request, user.jwt, { name });

  try {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: `Open details for ${name}` }).click();
    await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible();
    await page.locator('.productPopup').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('heading', { name, level: 1 })).not.toBeVisible();
  } finally {
    await deleteProductViaApi(request, user.jwt, product.id);
  }
});

test('create product: empty submit validates, filled form creates a card', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);
  await page.goto('/dashboard');

  await page.getByRole('button', { name: 'Add product' }).click();
  await expect(page.getByRole('heading', { name: 'Create product' })).toBeVisible();

  // App bug: submitting the empty form renders MissingFieldsPopup twice (once from
  // App.jsx and once from CreateProductPopup.jsx), producing two stacked
  // alertdialogs. Work around it here: assert the first instance and dismiss the
  // top-most (last) one, which is the only one that accepts clicks.
  await page.getByRole('button', { name: 'Add to My Vanity' }).click();
  await expect(page.getByRole('alertdialog').first()).toBeVisible();
  await expect(
    page.getByText('Please select a category for your product.').first()
  ).toBeVisible();
  await page.getByRole('button', { name: 'Got it' }).last().click();
  await expect(page.getByRole('alertdialog').first()).not.toBeVisible();

  // Fill every field type the form has: text, category, color. The category
  // picker is scoped to the form's fieldset because the background grid also has
  // category chips with the same names.
  const name = uniqueName('Created', testInfo);
  await page.getByLabel('Product name').fill(name);
  await page.getByLabel('Brand').fill('E2E Brand');
  await page.getByRole('group', { name: 'Category' }).getByRole('button', { name: 'Face' }).click();
  await setColorInput(page, '#224466');

  const createResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().endsWith('/myvanitys/api/v1/products')
  );

  await page.getByRole('button', { name: 'Add to My Vanity' }).click();

  const response = await createResponse;
  expect(response.status()).toBe(201);
  const created = await response.json();

  try {
    await expect(
      page.getByRole('heading', { name: /Product has been added/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: `Open details for ${name}` })
    ).toBeVisible();
  } finally {
    await deleteProductViaApi(request, user.jwt, created.id);
  }
});

// App bug: submitting the empty create-product form renders the validation
// MissingFieldsPopup twice (App.jsx + CreateProductPopup.jsx), so two alertdialogs
// are visible. This test asserts the correct behavior of exactly one.
test.fixme('empty create-product form shows exactly one validation dialog', async ({ page }, testInfo) => {
  await injectAuth(page, testInfo);
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Add product' }).click();
  await page.getByRole('button', { name: 'Add to My Vanity' }).click();
  await expect(page.getByRole('alertdialog')).toHaveCount(1);
});

test('write review: star rating, comment, submit shows success', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);
  const name = uniqueName('Review', testInfo);
  const product = await createProductViaApi(request, user.jwt, { name });

  try {
    await page.goto('/dashboard');
    await expect(
      page.getByRole('button', { name: `Open details for ${name}` })
    ).toBeVisible();

    await page.getByRole('button', { name: `Actions for ${name}` }).click();
    await page.getByRole('button', { name: 'Write review' }).click();

    await expect(page.getByRole('heading', { name: 'Write review' })).toBeVisible();

    await page.getByRole('button', { name: '4 stars' }).click();
    await page
      .getByPlaceholder('Write your review here...')
      .fill('Lovely product for E2E.');
    await page.getByRole('button', { name: 'Create Review' }).click();

    await expect(
      page.getByText('Your review has been added successfully!')
    ).toBeVisible();
  } finally {
    await deleteProductViaApi(request, user.jwt, product.id);
  }
});

test('delete product: cancel keeps it, confirm removes it', async ({ page, request }, testInfo) => {
  const user = await injectAuth(page, testInfo);
  const name = uniqueName('Delete', testInfo);
  const product = await createProductViaApi(request, user.jwt, { name });
  let deleted = false;

  try {
    await page.goto('/dashboard');
    await expect(
      page.getByRole('button', { name: `Open details for ${name}` })
    ).toBeVisible();

    // Cancel keeps it.
    await page.getByRole('button', { name: `Actions for ${name}` }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText(/Are you sure you want to delete/)).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(
      page.getByRole('button', { name: `Open details for ${name}` })
    ).toBeVisible();

    // Confirm removes it.
    await page.getByRole('button', { name: `Actions for ${name}` }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(
      page.getByRole('button', { name: `Open details for ${name}` })
    ).not.toBeVisible();
    deleted = true;
  } finally {
    if (!deleted) {
      await deleteProductViaApi(request, user.jwt, product.id);
    }
  }
});
