import { describe, expect, it } from 'vitest';

import i18n from '../../i18n/config';

describe('product translations', () => {
	it.each([
		['en', 'item', 'items', 'review', 'reviews', 'star', 'stars'],
		['es', 'producto', 'productos', 'reseña', 'reseñas', 'estrella', 'estrellas'],
	])('uses count-based plurals in %s', (language, oneItem, manyItems, oneReview, manyReviews, oneStar, manyStars) => {
		const t = i18n.getFixedT(language, 'products');

		expect(t('dashboard.item', { count: 1 })).toBe(oneItem);
		expect(t('dashboard.item', { count: 2 })).toBe(manyItems);
		expect(t('card.review', { count: 1 })).toBe(oneReview);
		expect(t('card.review', { count: 2 })).toBe(manyReviews);
		expect(t('card.ratingAria', { rating: '1.0', count: 1 })).toContain(oneStar);
		expect(t('card.ratingAria', { rating: '2.0', count: 2 })).toContain(manyStars);
	});

	it.each([
		['en', 'Close product details', 'Loading reviews...', 'Create product', 'Select a category'],
		['es', 'Cerrar los detalles del producto', 'Cargando reseñas...', 'Crear producto', 'Selecciona una categoría'],
	])('provides popup and create-flow copy in %s', (language, close, loadingReviews, createTitle, selectCategory) => {
		const t = i18n.getFixedT(language, 'products');

		expect(t('popup.close')).toBe(close);
		expect(t('popup.reviews.loading')).toBe(loadingReviews);
		expect(t('create.title')).toBe(createTitle);
		expect(t('create.fields.selectCategory')).toBe(selectCategory);
	});
});
