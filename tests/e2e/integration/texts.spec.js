const { test, expect } = require('./fixtures.js');
const { injectAuth } = require('./auth.js');
const {
  createProductViaApi,
  deleteProductViaApi,
  uniqueName,
} = require('./helpers.js');

const TEXTS = {
  en: {
    myVanity: 'My products',
    search: 'Search results',
    explore: 'Explore products',
    navMyVanity: 'My Vanity',
    navSearch: 'Search',
    navAdd: 'Add product',
    navExplore: 'Explore',
    navProfile: 'Profile',
    sortLabel: 'Sort products',
    searchPlaceholder: 'Search products or brands',
    createTitle: 'Create product',
    createSubmit: 'Add to My Vanity',
    createClose: 'Close create product form',
    detailClose: 'Close product details',
    openDetailsPrefix: 'Open details for',
    actionsForPrefix: 'Actions for',
    writeReview: 'Write review',
    reviewTitle: 'Write review',
    reviewClose: 'Close review form',
    deleteAction: 'Delete',
    deleteConfirm: 'Confirm',
    deleteCancel: 'Cancel',
    profileTitle: 'Profile',
    profileClose: 'Close profile',
  },
  es: {
    myVanity: 'Mis productos',
    search: 'Resultados de búsqueda',
    explore: 'Explorar productos',
    navMyVanity: 'Mi Vanity',
    navSearch: 'Buscar',
    navAdd: 'Añadir producto',
    navExplore: 'Explorar',
    navProfile: 'Perfil',
    sortLabel: 'Ordenar productos',
    searchPlaceholder: 'Buscar productos o marcas',
    createTitle: 'Crear producto',
    createSubmit: 'Añadir a My Vanity',
    createClose: 'Cerrar el formulario de creación de producto',
    detailClose: 'Cerrar los detalles del producto',
    openDetailsPrefix: 'Abrir los detalles de',
    actionsForPrefix: 'Acciones para',
    writeReview: 'Escribir reseña',
    reviewTitle: 'Escribir reseña',
    reviewClose: 'Cerrar formulario de reseña',
    deleteAction: 'Eliminar',
    deleteConfirm: 'Confirmar',
    deleteCancel: 'Cancelar',
    profileTitle: 'Perfil',
    profileClose: 'Cerrar perfil',
  },
};

// Real namespace names from src/i18n/config.ts.
const NAMESPACES = ['common', 'auth', 'products', 'reviews', 'errors'];
const RAW_KEY_PATTERN = new RegExp(
  `\\b(${NAMESPACES.join('|')})\\.[a-zA-Z][a-zA-Z0-9]*`
);

async function expectNoRawI18nKeys(page) {
  const bodyText = await page.locator('body').innerText();
  expect(bodyText, 'no raw i18n keys (<namespace>.<key>) may be visible').not.toMatch(
    RAW_KEY_PATTERN
  );
}

for (const lang of ['en', 'es']) {
  test.describe(`texts (${lang})`, () => {
    test(`key headings and buttons show the translated text`, async ({ page, request }, testInfo) => {
      const texts = TEXTS[lang];
      const user = await injectAuth(page, testInfo, { lang });
      const name = uniqueName('Texts', testInfo);
      const product = await createProductViaApi(request, user.jwt, { name });

      const card = `${texts.openDetailsPrefix} ${name}`;
      const cardActions = `${texts.actionsForPrefix} ${name}`;

      try {
        // My Vanity
        await page.goto('/dashboard');
        await expect(page.getByRole('heading', { name: texts.myVanity })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.navMyVanity, exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.navSearch, exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.navAdd, exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.navExplore, exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.navProfile, exact: true })).toBeVisible();
        await expect(page.getByLabel(texts.sortLabel)).toBeVisible();
        await expectNoRawI18nKeys(page);

        // Search
        await page.getByRole('button', { name: texts.navSearch, exact: true }).click();
        await expect(page.getByRole('heading', { name: texts.search })).toBeVisible();
        await expect(page.getByPlaceholder(texts.searchPlaceholder)).toBeVisible();
        await expectNoRawI18nKeys(page);

        // Explore
        await page.getByRole('button', { name: texts.navExplore, exact: true }).click();
        await expect(page.getByRole('heading', { name: texts.explore })).toBeVisible();
        await expectNoRawI18nKeys(page);

        // Back to My Vanity and open the dialogs.
        await page.getByRole('button', { name: texts.navMyVanity, exact: true }).click();
        await expect(page.getByRole('button', { name: card })).toBeVisible();

        // Create product dialog
        await page.getByRole('button', { name: texts.navAdd, exact: true }).click();
        await expect(page.getByRole('heading', { name: texts.createTitle })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.createSubmit })).toBeVisible();
        await expectNoRawI18nKeys(page);
        await page.getByRole('button', { name: texts.createClose }).click();

        // Product detail dialog
        await page.getByRole('button', { name: card }).click();
        await expect(page.getByRole('button', { name: texts.detailClose })).toBeVisible();
        await expectNoRawI18nKeys(page);
        await page.getByRole('button', { name: texts.detailClose }).click();

        // Review dialog
        await page.getByRole('button', { name: cardActions }).click();
        await page.getByRole('button', { name: texts.writeReview }).click();
        await expect(page.getByRole('heading', { name: texts.reviewTitle })).toBeVisible();
        await expectNoRawI18nKeys(page);
        await page.getByRole('button', { name: texts.reviewClose }).click();

        // Delete dialog
        await page.getByRole('button', { name: cardActions }).click();
        await page.getByRole('button', { name: texts.deleteAction, exact: true }).click();
        await expect(page.getByRole('button', { name: texts.deleteConfirm, exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: texts.deleteCancel, exact: true })).toBeVisible();
        await expectNoRawI18nKeys(page);
        await page.getByRole('button', { name: texts.deleteCancel, exact: true }).click();

        // Profile dialog
        await page.getByRole('button', { name: texts.navProfile, exact: true }).click();
        await expect(page.getByRole('heading', { name: texts.profileTitle })).toBeVisible();
        await expectNoRawI18nKeys(page);
        await page.getByRole('button', { name: texts.profileClose }).click();
      } finally {
        try {
          await deleteProductViaApi(request, user.jwt, product.id);
        } catch {
          // Already removed during the flow.
        }
      }
    });
  });
}
