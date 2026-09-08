import { describe, expect, it } from 'vitest';

import i18n from '../../i18n/config';

describe('review translations', () => {
	it.each([
		['en', 'star', 'stars'],
		['es', 'estrella', 'estrellas'],
	])('uses count-based star plurals in %s', (language, oneStar, manyStars) => {
		const t = i18n.getFixedT(language, 'reviews');

		expect(t('form.star', { count: 1 })).toBe(oneStar);
		expect(t('form.star', { count: 2 })).toBe(manyStars);
	});

	it.each([
		['en', 'Product Reviews', 'Loading reviews...', 'Write review'],
		['es', 'Reseñas del producto', 'Cargando reseñas...', 'Escribir reseña'],
	])('provides list and form copy in %s', (language, title, loading, createTitle) => {
		const t = i18n.getFixedT(language, 'reviews');

		expect(t('list.title')).toBe(title);
		expect(t('list.loading')).toBe(loading);
		expect(t('create.title')).toBe(createTitle);
	});
});
