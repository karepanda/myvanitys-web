import { describe, expect, it } from 'vitest';
import {
	ALL_CATEGORIES,
	filterByCategory,
	getAvailableCategories,
	getCategoryLabel,
	getCategoryName,
	getSafeHexColor,
	sortProducts,
} from '../../utils/dashboardProducts';

const products = [
	{ id: '1', name: 'Zulu', brand: 'Alpha', category: { name: 'Face' }, averageRating: 2 },
	{ id: '2', name: 'Alpha', brand: 'Zulu', category: 'Eyelash', averageRating: 5 },
	{ id: '3', name: 'Blush', brand: 'Beta', category: { name: 'Face' }, averageRating: 4 },
];

describe('dashboard product utilities', () => {
	it('normalizes object and text categories and maps Eyelash visually', () => {
		expect(getCategoryName(products[0])).toBe('Face');
		expect(getCategoryName(products[1])).toBe('Eyelash');
		expect(getCategoryLabel('Eyelash')).toBe('Lashes');
	});

	it('only returns available categories and always includes All', () => {
		expect(getAvailableCategories(products)).toEqual([ALL_CATEGORIES, 'Face', 'Eyelash']);
	});

	it('filters by normalized category and restores all products', () => {
		expect(filterByCategory(products, 'Face').map(({ id }) => id)).toEqual(['1', '3']);
		expect(filterByCategory(products, ALL_CATEGORIES)).toEqual(products);
	});

	it.each([
		['default', ['1', '2', '3']],
		['name', ['2', '3', '1']],
		['brand', ['1', '3', '2']],
		['rating', ['2', '3', '1']],
	])('sorts by %s without mutating the source', (sort, expected) => {
		const original = [...products];
		expect(sortProducts(products, sort).map(({ id }) => id)).toEqual(expected);
		expect(products).toEqual(original);
	});

	it('uses a safe neutral for invalid colors', () => {
		expect(getSafeHexColor('#ab12ef')).toBe('#AB12EF');
		expect(getSafeHexColor('red')).toBe('#D8D1CC');
	});
});
