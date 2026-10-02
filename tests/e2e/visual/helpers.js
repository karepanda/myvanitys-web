// Small navigation helpers built on Playwright web-first assertions so the UI
// is verifiably ready before a screenshot is taken.

const { expect } = require('@playwright/test');

async function openMyVanity(page) {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'My products' })).toBeVisible();
}

async function openSearch(page) {
  await page.goto('/dashboard?mode=search');
  await expect(
    page.getByRole('heading', { name: 'Search results' })
  ).toBeVisible();
}

async function openExplore(page) {
  await page.goto('/dashboard?mode=add-products');
  await expect(
    page.getByRole('heading', { name: 'Explore products' })
  ).toBeVisible();
}

// Waits until a product card (whose accessible name embeds the product name)
// is visible, confirming the grid has finished loading.
async function waitForProductCard(page, name) {
  await expect(
    page.getByRole('button', { name: `Open details for ${name}` })
  ).toBeVisible();
}

module.exports = {
  openMyVanity,
  openSearch,
  openExplore,
  waitForProductCard,
};
