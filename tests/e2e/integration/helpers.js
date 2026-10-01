const { expect } = require('@playwright/test');
const crypto = require('node:crypto');

const API_BASE = 'http://localhost:8080/myvanitys/api/v1';

// Shared prefix for every product created by the suite. global-setup.js resets
// the catalog by deleting `product` rows whose name starts with this prefix
// (see reset.sql). Keep the two in sync.
const E2E_NAME_PREFIX = 'e2e-';

const CATEGORY_FACE = '123e4567-e89b-12d3-a456-426614174000';
const CATEGORY_EYES = '550e8400-e29b-41d4-a716-446655440001';
const CATEGORY_LIPS = '01969b31-b294-7939-a8d2-c298e896ec1f';

// The backend declares X-Request-ID / X-Flow-ID / User-Agent / Accept-Language
// as required headers, so replicate exactly what the frontend sends.
function apiHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Request-ID': crypto.randomUUID(),
    'X-Flow-ID': crypto.randomUUID(),
    'User-Agent': 'MyVanitysApp/1.0',
    'Accept-Language': 'en-US',
  };
}

function uniqueName(prefix, testInfo) {
  return `${E2E_NAME_PREFIX}${prefix}-${testInfo.project.name}-${testInfo.parallelIndex}-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;
}

async function createProductViaApi(
  request,
  token,
  { name, brand = 'E2E Brand', categoryId = CATEGORY_FACE, colorHex = '#112233' }
) {
  const response = await request.post(`${API_BASE}/products`, {
    headers: apiHeaders(token),
    data: { name, brand, categoryId, colorHex },
  });
  const body = await response.text();
  expect(
    response.ok(),
    `createProductViaApi failed (${response.status()}): ${body}`
  ).toBeTruthy();
  return JSON.parse(body);
}

async function deleteProductViaApi(request, token, productId) {
  const response = await request.delete(`${API_BASE}/products/${productId}`, {
    headers: apiHeaders(token),
  });
  expect(
    response.ok(),
    `deleteProductViaApi failed (${response.status()}): ${await response.text()}`
  ).toBeTruthy();
}

// Removes a product from the user's vanity if present (204) and tolerates the
// not-in-vanity case (404) so "add to vanity" flows stay idempotent across runs.
async function ensureNotInVanity(request, token, productId) {
  const response = await request.delete(`${API_BASE}/products/${productId}`, {
    headers: apiHeaders(token),
  });
  if (response.status() !== 204 && response.status() !== 404) {
    throw new Error(
      `ensureNotInVanity got unexpected status ${response.status()} for ${productId}`
    );
  }
}

// Returns the first search result for a query (same endpoint the UI uses).
async function searchFirstProductViaApi(request, token, query) {
  const response = await request.get(
    `${API_BASE}/products/search?query=${encodeURIComponent(query)}`,
    { headers: apiHeaders(token) }
  );
  expect(
    response.ok(),
    `searchFirstProductViaApi failed (${response.status()}): ${await response.text()}`
  ).toBeTruthy();
  const payload = await response.json();
  const products = Array.isArray(payload?.content) ? payload.content : [];
  if (products.length === 0) {
    throw new Error(`No search results for query "${query}"`);
  }
  return products[0];
}

module.exports = {
  API_BASE,
  E2E_NAME_PREFIX,
  CATEGORY_FACE,
  CATEGORY_EYES,
  CATEGORY_LIPS,
  uniqueName,
  createProductViaApi,
  deleteProductViaApi,
  ensureNotInVanity,
  searchFirstProductViaApi,
};
