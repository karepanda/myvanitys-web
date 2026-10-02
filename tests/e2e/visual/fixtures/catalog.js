// Deterministic catalog fixtures and the standard product-endpoint mocks.
//
// Response shapes are derived from the frontend source:
//   - GET /products                 -> array (normalizeProductCollection)
//   - GET /users/:id/products       -> array (readProductService.findProductsByUserId)
//   - GET /products/search?query=.. -> array (searchProductService.searchProducts)
//   - GET /products/:id/reviews     -> { reviews: [...] } (useReviews.loadReviews)
//
// Product fields consumed by ProductCard / ProductPopup / usePublicProducts:
//   id, name, brand, colorHex, averageRating, imageUrl, category (name + id).

const CATEGORIES = {
  face: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Face' },
  eyes: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Eyes' },
  lips: { id: '01969b31-b294-7939-a8d2-c298e896ec1f', name: 'Lips' },
};

// Deterministic inline SVG data URI so product images never hit the network.
function productImageDataUri(colorHex) {
  const color = String(colorHex || '').replace('#', '');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">` +
    `<rect width="300" height="300" fill="#${color}"/>` +
    `<rect x="40" y="40" width="220" height="220" rx="28" fill="#ffffff" opacity="0.28"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makeProduct({ id, name, brand, category, colorHex, averageRating }) {
  return {
    id,
    name,
    brand,
    categoryId: category.id,
    category: { id: category.id, name: category.name },
    colorHex,
    averageRating,
    imageUrl: productImageDataUri(colorHex),
  };
}

const PRODUCT_1 = makeProduct({
  id: 'visual-product-0001',
  name: 'Radiant Silk Foundation',
  brand: 'Lumière',
  category: CATEGORIES.face,
  colorHex: '#E8B4B8',
  averageRating: 4.6,
});
const PRODUCT_2 = makeProduct({
  id: 'visual-product-0002',
  name: 'Luxe Eyeshadow Palette',
  brand: 'Aurora',
  category: CATEGORIES.eyes,
  colorHex: '#7B5EA7',
  averageRating: 4.2,
});
const PRODUCT_3 = makeProduct({
  id: 'visual-product-0003',
  name: 'Velvet Matte Lipstick',
  brand: 'Rouge',
  category: CATEGORIES.lips,
  colorHex: '#B23A48',
  averageRating: 4.8,
});
const PRODUCT_4 = makeProduct({
  id: 'visual-product-0004',
  name: 'Dewy Cream Blush',
  brand: 'Lumière',
  category: CATEGORIES.face,
  colorHex: '#F2A0A0',
  averageRating: 4.0,
});
const PRODUCT_5 = makeProduct({
  id: 'visual-product-0005',
  name: 'Precision Liquid Liner',
  brand: 'Aurora',
  category: CATEGORIES.eyes,
  colorHex: '#3B3B3B',
  averageRating: 3.9,
});
const PRODUCT_6 = makeProduct({
  id: 'visual-product-0006',
  name: 'Glossy Lip Oil',
  brand: 'Rouge',
  category: CATEGORIES.lips,
  colorHex: '#D97B84',
  averageRating: 4.3,
});

// Full community catalog (what GET /products returns).
const CATALOG = [PRODUCT_1, PRODUCT_2, PRODUCT_3, PRODUCT_4, PRODUCT_5, PRODUCT_6];

// The signed-in user's collection (what GET /users/:id/products returns). Kept
// in a deliberately non-alphabetical order so sorting is visibly meaningful.
const USER_PRODUCTS = [PRODUCT_3, PRODUCT_1, PRODUCT_2];

// Explore shows CATALOG minus the user's collection.
const PUBLIC_PRODUCTS = CATALOG.filter(
  (product) => !USER_PRODUCTS.some((owned) => owned.id === product.id)
);

// Search results returned for the "Maybelline" query.
const SEARCH_RESULTS = [
  makeProduct({
    id: 'visual-product-0101',
    name: 'Maybelline Fit Me Foundation',
    brand: 'Maybelline',
    category: CATEGORIES.face,
    colorHex: '#F4C6A3',
    averageRating: 4.5,
  }),
  makeProduct({
    id: 'visual-product-0102',
    name: 'Maybelline SuperStay Lipstick',
    brand: 'Maybelline',
    category: CATEGORIES.lips,
    colorHex: '#C6284A',
    averageRating: 4.7,
  }),
];

// Reviews rendered inside the product detail dialog (ProductPopup).
const REVIEWS = [
  {
    id: 'visual-review-0001',
    rating: 5,
    comment: 'Absolutely love this!',
    createdAt: '2026-08-15T00:00:00.000Z',
  },
  {
    id: 'visual-review-0002',
    rating: 4,
    comment: 'Great texture and finish.',
    createdAt: '2026-07-02T00:00:00.000Z',
  },
];

// A single product used to open the detail dialog.
const PRODUCT_DETAIL = PRODUCT_1;

const EMPTY_PRODUCTS = [];

/**
 * Registers the standard product endpoints against the mock router.
 * Every endpoint the Dashboard can hit on load is covered; anything else the
 * application requests will be recorded by the router as unmatched and fail.
 */
function registerProductMocks(
  router,
  {
    allProducts = CATALOG,
    userProducts = USER_PRODUCTS,
    searchResults = SEARCH_RESULTS,
    reviews = REVIEWS,
  } = {}
) {
  router.get('/products', () => ({ status: 200, body: allProducts }));
  router.get('/users/:userId/products', () => ({
    status: 200,
    body: userProducts,
  }));
  router.get('/products/search', () => ({
    status: 200,
    body: searchResults,
  }));
  router.get('/products/:productId/reviews', () => ({
    status: 200,
    body: { reviews },
  }));
}

module.exports = {
  CATEGORIES,
  CATALOG,
  USER_PRODUCTS,
  PUBLIC_PRODUCTS,
  SEARCH_RESULTS,
  REVIEWS,
  PRODUCT_DETAIL,
  EMPTY_PRODUCTS,
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  PRODUCT_4,
  PRODUCT_5,
  PRODUCT_6,
  productImageDataUri,
  makeProduct,
  registerProductMocks,
};
